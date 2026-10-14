/**
 * Utility to format phone numbers and construct pre-filled WhatsApp click-to-chat links
 * Strictly used by Get Linked admins for manual human introductions (never automated).
 */

export function cleanWhatsAppNumber(phone: string): string {
  // Remove non-digit characters except leading plus if any
  let cleaned = phone.replace(/[^0-9]/g, "");

  // If starts with 0 (Sri Lankan local format e.g. 0771234567), convert to 94771234567
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "94" + cleaned.slice(1);
  }

  return cleaned;
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const cleaned = cleanWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export interface AccommodationIntroParams {
  contactName: string;
  accommodationName: string;
  creatorName: string;
  creatorNiche: string;
  creatorFollowers: number;
  city: string;
  visitStart: string;
  visitEnd: string;
  offerType: string;
}

export function createAccommodationIntroMessage(params: AccommodationIntroParams): string {
  return `Hi ${params.contactName}, this is the Get Linked Sri Lanka team! 👋

We are pleased to introduce you to verified creator ${params.creatorName} (${params.creatorNiche}, ${params.creatorFollowers.toLocaleString()} followers) for your stay at ${params.accommodationName} in ${params.city}.

🗓️ Available dates: ${params.visitStart} to ${params.visitEnd}
🤝 Proposed arrangement: ${params.offerType}

Our team has verified ${params.creatorName}'s identity and travel plans. Please let us know if you would like us to connect you directly to finalize your dates!

Warm regards,
Get Linked Team
getlinked.lk`;
}

export interface CreatorIntroParams {
  creatorName: string;
  accommodationName: string;
  contactPerson: string;
  city: string;
  coverageStart: string;
  coverageEnd: string;
  offerType: string;
}

export function createCreatorIntroMessage(params: CreatorIntroParams): string {
  return `Hi ${params.creatorName}, this is the Get Linked Sri Lanka team! 🌴

Great news! We have matched your upcoming visit to ${params.city} with verified stay partner ${params.accommodationName} (Contact: ${params.contactPerson}).

🗓️ Available stay window: ${params.coverageStart} to ${params.coverageEnd}
🎁 Host offer: ${params.offerType}

Both your profile and the property have been reviewed and approved by our team. Please confirm if you'd like to proceed with this collaboration!

Warm regards,
Get Linked Team
getlinked.lk`;
}
