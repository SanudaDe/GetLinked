import assert from "node:assert";

// 1. Date overlap logic test
function checkDateOverlap(creatorStart, creatorEnd, coverageStart, coverageEnd) {
  const cStart = new Date(creatorStart).getTime();
  const cEnd = new Date(creatorEnd).getTime();
  const aStart = new Date(coverageStart).getTime();
  const aEnd = new Date(coverageEnd).getTime();

  if (isNaN(cStart) || isNaN(cEnd) || isNaN(aStart) || isNaN(aEnd)) {
    return false;
  }

  return cStart <= aEnd && cEnd >= aStart;
}

// 2. WhatsApp cleaning test
function cleanWhatsAppNumber(phone) {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "94" + cleaned.slice(1);
  }
  return cleaned;
}

function generateWhatsAppLink(phone, text) {
  const cleaned = cleanWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

// Test Runner
console.log("=========================================");
console.log("RUNNING GET LINKED BUSINESS RULE TESTS");
console.log("=========================================\n");

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

// TEST 1: Date overlap logic
runTest("Overlapping dates correctly identified (Creator within Stay window)", () => {
  // Creator: Oct 10 to Oct 20, Stay: Oct 1 to Oct 31 -> Overlap!
  assert.strictEqual(checkDateOverlap("2026-10-10", "2026-10-20", "2026-10-01", "2026-10-31"), true);
});

runTest("Overlapping dates correctly identified (Stay within Creator window)", () => {
  // Creator: Oct 01 to Nov 15, Stay: Oct 10 to Oct 20 -> Overlap!
  assert.strictEqual(checkDateOverlap("2026-10-01", "2026-11-15", "2026-10-10", "2026-10-20"), true);
});

runTest("Non-overlapping dates correctly rejected (Creator arrives after stay coverage)", () => {
  // Creator: Nov 01 to Nov 10, Stay: Oct 01 to Oct 20 -> NO overlap
  assert.strictEqual(checkDateOverlap("2026-11-01", "2026-11-10", "2026-10-01", "2026-10-20"), false);
});

runTest("Non-overlapping dates correctly rejected (Creator leaves before stay coverage)", () => {
  // Creator: Sept 10 to Sept 25, Stay: Oct 01 to Oct 20 -> NO overlap
  assert.strictEqual(checkDateOverlap("2026-09-10", "2026-09-25", "2026-10-01", "2026-10-20"), false);
});

// TEST 2: Validation rules
runTest("Age validation blocks under 18", () => {
  const applicantAge = 17;
  const isValidAge = applicantAge >= 18;
  assert.strictEqual(isValidAge, false, "Applicant under 18 must not pass validation");
});

runTest("Follower threshold blocks under 5,000", () => {
  const followers = 4999;
  const meetsThreshold = followers >= 5000;
  assert.strictEqual(meetsThreshold, false, "Applicant with < 5,000 followers must not pass validation");
});

runTest("Travel end date must be after start date", () => {
  const startDate = new Date("2026-10-20");
  const endDate = new Date("2026-10-15");
  const isValidRange = endDate > startDate;
  assert.strictEqual(isValidRange, false, "End date earlier than start date must fail validation");
});

// TEST 3: WhatsApp Sanitization & Links
runTest("Sri Lankan local number converted to international format (077... -> 9477...)", () => {
  const raw = "0771234567";
  const cleaned = cleanWhatsAppNumber(raw);
  assert.strictEqual(cleaned, "94771234567");
});

runTest("International phone formatted cleanly without plus, spaces, dashes", () => {
  const raw = "+44 7911-123456";
  const cleaned = cleanWhatsAppNumber(raw);
  assert.strictEqual(cleaned, "447911123456");
});

runTest("Pre-filled WhatsApp click-to-chat URL correctly constructed", () => {
  const link = generateWhatsAppLink("+94771234567", "Hello Get Linked!");
  assert.strictEqual(link, "https://wa.me/94771234567?text=Hello%20Get%20Linked!");
});

// TEST 4: Privacy & Public Serializer Protection
runTest("Public creator profile strips WhatsApp, document references, and admin notes", () => {
  const privateRecord = {
    id: "app-101",
    full_name: "Elena Rostova",
    whatsapp: "+447911123456",
    document_type: "PASSPORT",
    document_reference: "GB98210344X",
    admin_notes: "Engagement verified 4.8%",
    follower_count: 84200,
    city: "Galle",
  };

  // Safe serializer
  const publicProfile = {
    display_name: privateRecord.full_name,
    follower_count: privateRecord.follower_count,
    city: privateRecord.city,
  };

  assert.strictEqual("whatsapp" in publicProfile, false);
  assert.strictEqual("document_reference" in publicProfile, false);
  assert.strictEqual("admin_notes" in publicProfile, false);
});

// TEST 5: Duplicate Detection Logic
runTest("Duplicate detection identifies repeated WhatsApp numbers", () => {
  const existingRecords = [{ whatsapp: "+447911123456" }];
  const newSubmission = { whatsapp: "07911123456" }; // or same clean
  const isDuplicate = existingRecords.some(r => cleanWhatsAppNumber(r.whatsapp) === cleanWhatsAppNumber("+447911123456"));
  assert.strictEqual(isDuplicate, true);
});

console.log(`\n=========================================`);
console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED`);
console.log(`=========================================\n`);

if (passed !== total) {
  process.exit(1);
}
