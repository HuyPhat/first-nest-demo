import { useState } from "react";

// Intentional lint error for practising how to read a red CI log. Do not merge.
export function LintPractice({ on }: { on: boolean }) {
  if (on) {
    const [count] = useState(0);
    return <p>{count}</p>;
  }
  return null;
}
