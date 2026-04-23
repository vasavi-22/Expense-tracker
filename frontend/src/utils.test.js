import { describe, expect, it } from "vitest";

import { calculateTotal, summarizeByCategory } from "./utils";

describe("expense utility functions", () => {
  it("calculates total for visible expenses", () => {
    const expenses = [{ amount: 99.5 }, { amount: 0.5 }, { amount: 100 }];
    expect(calculateTotal(expenses)).toBe(200);
  });

  it("summarizes amounts by category in descending order", () => {
    const expenses = [
      { category: "Food", amount: 10 },
      { category: "Travel", amount: 50 },
      { category: "Food", amount: 15 },
    ];

    expect(summarizeByCategory(expenses)).toEqual([
      { category: "Travel", amount: 50 },
      { category: "Food", amount: 25 },
    ]);
  });
});
