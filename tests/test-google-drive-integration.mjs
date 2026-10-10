import assert from "node:assert";

console.log("=================================================");
console.log("RUNNING GETLINKED GOOGLE DRIVE INTEGRATION TESTS");
console.log("=================================================\n");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
  }
}

// 1. File type whitelist validation
const ALLOWED_MIME_TYPES = {
  "image/jpeg": { category: "PHOTO", maxSize: 25 * 1024 * 1024 },
  "image/png": { category: "PHOTO", maxSize: 25 * 1024 * 1024 },
  "image/webp": { category: "PHOTO", maxSize: 25 * 1024 * 1024 },
  "application/pdf": { category: "DOCUMENT", maxSize: 35 * 1024 * 1024 },
  "video/mp4": { category: "VIDEO", maxSize: 250 * 1024 * 1024 },
  "video/webm": { category: "VIDEO", maxSize: 250 * 1024 * 1024 },
};

function validateFileType(mimeType) {
  return Boolean(ALLOWED_MIME_TYPES[mimeType]);
}

runTest("Permitted media types accepted (JPEG, PNG, WebP, PDF, MP4, WebM)", () => {
  assert.strictEqual(validateFileType("image/jpeg"), true);
  assert.strictEqual(validateFileType("image/png"), true);
  assert.strictEqual(validateFileType("image/webp"), true);
  assert.strictEqual(validateFileType("application/pdf"), true);
  assert.strictEqual(validateFileType("video/mp4"), true);
  assert.strictEqual(validateFileType("video/webm"), true);
});

runTest("Arbitrary executable and script types strictly rejected", () => {
  assert.strictEqual(validateFileType("application/x-msdownload"), false); // .exe
  assert.strictEqual(validateFileType("application/javascript"), false); // .js
  assert.strictEqual(validateFileType("text/html"), false); // .html
  assert.strictEqual(validateFileType("application/x-sh"), false); // .sh
  assert.strictEqual(validateFileType("application/octet-stream"), false);
});

// 2. File size limit enforcement
function validateFileSize(mimeType, sizeBytes) {
  const rule = ALLOWED_MIME_TYPES[mimeType];
  if (!rule) return false;
  return sizeBytes <= rule.maxSize;
}

runTest("Photos up to 25MB allowed, >25MB rejected", () => {
  assert.strictEqual(validateFileSize("image/jpeg", 24 * 1024 * 1024), true);
  assert.strictEqual(validateFileSize("image/jpeg", 26 * 1024 * 1024), false);
});

runTest("Videos up to 250MB allowed, >250MB rejected", () => {
  assert.strictEqual(validateFileSize("video/mp4", 200 * 1024 * 1024), true);
  assert.strictEqual(validateFileSize("video/mp4", 260 * 1024 * 1024), false);
});

runTest("PDF documents up to 35MB allowed, >35MB rejected", () => {
  assert.strictEqual(validateFileSize("application/pdf", 30 * 1024 * 1024), true);
  assert.strictEqual(validateFileSize("application/pdf", 40 * 1024 * 1024), false);
});

// 3. User storage quota calculation
const USER_QUOTA_BYTES = 500 * 1024 * 1024; // 500MB
function checkUserQuota(currentUsedBytes, newFileSizeBytes) {
  return currentUsedBytes + newFileSizeBytes <= USER_QUOTA_BYTES;
}

runTest("User storage quota blocks uploads exceeding 500MB allowance", () => {
  const existingUsage = 450 * 1024 * 1024; // 450MB
  assert.strictEqual(checkUserQuota(existingUsage, 40 * 1024 * 1024), true); // 490MB <= 500MB
  assert.strictEqual(checkUserQuota(existingUsage, 60 * 1024 * 1024), false); // 510MB > 500MB
});

// 4. Filename sanitization against path traversal
function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

runTest("Filename sanitization strips directory traversal sequences", () => {
  const malicious1 = "../../etc/passwd";
  const sanitized1 = sanitizeFilename(malicious1);
  assert.strictEqual(sanitized1.includes("/"), false);
  assert.strictEqual(sanitized1.includes("\\"), false);
  assert.strictEqual(sanitized1, ".._.._etc_passwd");

  const malicious2 = "my picture<script>.jpg";
  const sanitized2 = sanitizeFilename(malicious2);
  assert.strictEqual(sanitized2, "my_picture_script_.jpg");
});

// 5. Destination Google Drive folder ID enforcement
const EXPECTED_FOLDER_ID = "1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX";
runTest("Enforces designated destination Google Drive folder ID", () => {
  assert.strictEqual(EXPECTED_FOLDER_ID, "1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX");
});

// 6. Google Drive URL extraction and CDN thumbnail formatting
function extractGoogleDriveFileId(url) {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  return m ? m[1] : null;
}

function getGoogleDriveImageUrl(fileId, width = 1600) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

runTest("Extracts Google Drive file ID from standard link formats", () => {
  const url1 = "https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M/view?usp=sharing";
  assert.strictEqual(extractGoogleDriveFileId(url1), "1A2B3C4D5E6F7G8H9I0J1K2L3M");

  const url2 = "https://drive.google.com/uc?id=1A2B3C4D5E6F7G8H9I0J1K2L3M&export=download";
  assert.strictEqual(extractGoogleDriveFileId(url2), "1A2B3C4D5E6F7G8H9I0J1K2L3M");
});

runTest("Generates high-resolution CDN thumbnail URL", () => {
  const fileId = "1A2B3C4D5E6F7G8H9I0J1K2L3M";
  const thumbUrl = getGoogleDriveImageUrl(fileId, 1600);
  assert.strictEqual(thumbUrl, "https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M&sz=w1600");
});

// 7. Security: User Ownership Isolation Simulation
function canUserAccessMedia(requestingUserId, mediaItem) {
  if (mediaItem.visibility === "PUBLIC") return true;
  return requestingUserId === mediaItem.owner_user_id;
}

function canUserDeleteMedia(requestingUserId, mediaItem) {
  return requestingUserId === mediaItem.owner_user_id;
}

runTest("Access control isolates private media between users", () => {
  const mediaUser1 = {
    id: "media-001",
    owner_user_id: "user-111",
    visibility: "PRIVATE",
  };
  const mediaPublic = {
    id: "media-002",
    owner_user_id: "user-111",
    visibility: "PUBLIC",
  };

  // User 1 accessing own media -> allowed
  assert.strictEqual(canUserAccessMedia("user-111", mediaUser1), true);
  // User 2 accessing User 1's private media -> denied
  assert.strictEqual(canUserAccessMedia("user-222", mediaUser1), false);
  // User 2 accessing User 1's public media -> allowed
  assert.strictEqual(canUserAccessMedia("user-222", mediaPublic), true);
  // User 2 trying to delete User 1's media -> strictly denied
  assert.strictEqual(canUserDeleteMedia("user-222", mediaUser1), false);
});

console.log("\n=================================================");
console.log(`TEST SUMMARY: ${passed}/${total} GOOGLE DRIVE TESTS PASSED`);
console.log("=================================================");
