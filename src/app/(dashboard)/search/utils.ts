export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function scoreLabel(score: number): {
  label: string;
  className: string;
} {
  if (score >= 0.8) {
    return {
      label: "Excellent Match",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
  }
  if (score >= 0.6) {
    return {
      label: "Good Match",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
  }
  return {
    label: "Match",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };
}

export function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 10 ? `${Math.round(k)}K` : `${k.toFixed(1)}K`;
  }
  return n.toLocaleString();
}
