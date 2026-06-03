export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  return classes
    .flatMap((item) => {
      if (!item) return [];
      if (typeof item === "string") return [item];
      return Object.entries(item)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(" ");
}