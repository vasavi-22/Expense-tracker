import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { buildApp } from "../src/app.js";
import { clearAllData } from "../src/db.js";

describe("expenses API", () => {
  const app = buildApp();

  beforeEach(() => {
    clearAllData();
  });

  it("creates one expense for retried requests with same idempotency key", async () => {
    const payload = {
      amount: 250.75,
      category: "Food",
      description: "Lunch",
      date: "2026-04-23",
    };

    const first = await request(app).post("/expenses").set("Idempotency-Key", "retry-1").send(payload).expect(201);
    const second = await request(app).post("/expenses").set("Idempotency-Key", "retry-1").send(payload).expect(201);

    expect(second.body.id).toBe(first.body.id);

    const list = await request(app).get("/expenses").expect(200);
    expect(list.body.expenses).toHaveLength(1);
  });

  it("supports case-insensitive partial category filter and sort=date", async () => {
    await request(app).post("/expenses").send({
      amount: 100,
      category: "Food",
      description: "Breakfast",
      date: "2026-04-22",
    });
    await request(app).post("/expenses").send({
      amount: 200,
      category: "fuel",
      description: "Gas",
      date: "2026-04-21",
    });
    await request(app).post("/expenses").send({
      amount: 300,
      category: "Football",
      description: "Match ticket",
      date: "2026-04-23",
    });

    const response = await request(app).get("/expenses?category=FO&sort=date").expect(200);

    expect(response.body.expenses).toHaveLength(2);
    expect(response.body.expenses[0].category).toBe("Football");
    expect(response.body.expenses[1].category).toBe("Food");
  });

  it("returns 400 for invalid payload", async () => {
    const response = await request(app).post("/expenses").send({
      amount: -1,
      category: "",
      description: "Invalid",
      date: "2026-04-23",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
