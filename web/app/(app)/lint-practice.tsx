import { useState } from "react";

// Intentional lint error for practising how to read a red CI log. Do not merge.
export function LintPractice({ on }: { on: boolean }) {
  const [count] = useState(0);
  if (on) {
    
    return <p>{count}</p>;
  }
  return null;
}
