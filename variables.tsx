function stringifyFrequency(frequency) {
  if (frequency === 60) return "hour";
  if (frequency === 120) return "2 hrs";
  if (frequency === 240) return "4 hrs";
  if (frequency === 360) return "6 hrs";
}

export { stringifyFrequency };
