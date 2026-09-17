/**
 * Date overlap logic specified by Get Linked Business Rules:
 *
 * Creator: visit_start, visit_end
 * Accommodation: coverage_start, coverage_end
 *
 * They overlap when:
 * creator.visit_start <= accommodation.coverage_end
 * AND
 * creator.visit_end >= accommodation.coverage_start
 */
export function checkDateOverlap(
  creatorStart: string | Date,
  creatorEnd: string | Date,
  coverageStart: string | Date,
  coverageEnd: string | Date
): boolean {
  const cStart = new Date(creatorStart).getTime();
  const cEnd = new Date(creatorEnd).getTime();
  const aStart = new Date(coverageStart).getTime();
  const aEnd = new Date(coverageEnd).getTime();

  if (isNaN(cStart) || isNaN(cEnd) || isNaN(aStart) || isNaN(aEnd)) {
    return false;
  }

  return cStart <= aEnd && cEnd >= aStart;
}

/**
 * Calculates how many days of overlap exist between two date ranges.
 */
export function calculateOverlapDays(
  creatorStart: string,
  creatorEnd: string,
  coverageStart: string,
  coverageEnd: string
): number {
  const cStart = new Date(creatorStart).getTime();
  const cEnd = new Date(creatorEnd).getTime();
  const aStart = new Date(coverageStart).getTime();
  const aEnd = new Date(coverageEnd).getTime();

  const overlapStart = Math.max(cStart, aStart);
  const overlapEnd = Math.min(cEnd, aEnd);

  if (overlapStart > overlapEnd) return 0;
  return Math.ceil((overlapEnd - overlapStart) / (1000 * 60 * 60 * 24)) + 1;
}
