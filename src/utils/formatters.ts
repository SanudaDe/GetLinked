export function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toLocaleString();
}

export function formatDateRange(start: string, end: string): string {
  if (!start || !end) return "Flexible";
  try {
    const s = new Date(start);
    const e = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const sFormatted = s.toLocaleDateString("en-US", options);
    const eFormatted = e.toLocaleDateString("en-US", { ...options, year: "numeric" });
    return `${sFormatted} - ${eFormatted}`;
  } catch {
    return `${start} to ${end}`;
  }
}

export const SRI_LANKA_CITIES = [
  "All Sri Lanka",
  "Colombo",
  "Galle",
  "Mirissa",
  "Weligama",
  "Ella",
  "Kandy",
  "Sigiriya",
  "Nuwara Eliya",
  "Arugam Bay",
  "Trincomalee",
  "Tangalle",
  "Bentota",
  "Unawatuna",
  "Hiriketiya",
  "Jaffna",
  "Negombo",
  "Dambulla",
  "Yala / Tissamaharama",
] as const;

export const CREATOR_NICHES = [
  "Travel",
  "Food",
  "Lifestyle",
  "Fashion & Beauty",
  "Fitness & Wellness",
  "Family & Kids",
  "Other",
] as const;

export const PROPERTY_TYPES = [
  "Hotel",
  "Villa",
  "Guesthouse",
  "Resort",
  "Boutique Hotel",
  "Eco Lodge",
] as const;

export const OFFER_TYPES = [
  "Free accommodation only",
  "Free accommodation + meals",
  "Paid collaboration",
  "Flexible / open to negotiate",
] as const;
