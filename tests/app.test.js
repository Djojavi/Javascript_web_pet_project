
import { server } from "./mocks/server.js";
import { http, HttpResponse } from "msw";
import request from "supertest";
import app from "../app.js";

//------------------TESTS: repos with 5 stars or more ------------------
//happy path
test("returns a list with two repos ", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 2, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    })
  );

  const res = await request(app).get("/more-than-5-stars");

  expect(res.body).toEqual(
    [
      { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
      { name: "repo3", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
    ]);
});

//no repos with 5 stars or more
test("returns empty list when no repos have >=5 stars", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 1, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 2, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    })
  );

  const res = await request(app).get("/more-than-5-stars");

  expect(res.body).toEqual([]);
});

//all the repos have 5 stars or more
test("returns a full list when every repos has >=5 stars", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    })
  );

  const res = await request(app).get("/more-than-5-stars");

  expect(res.body).toEqual(
    [
      { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
      { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
    ]);
});

//missing stargazers_count
test("skips repos with missing attribute stargazers_count", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    })
  );

  const res = await request(app).get("/more-than-5-stars");

  expect(res.body).toEqual(
    [
      { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
    ]);
});

//------------------TESTS: Last 5 updated repositories ------------------

//happy path 
test("returns a list with the 5 last updated repos", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-04-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-03-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 6, updated_at: "2026-02-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo6", stargazers_count: 6, updated_at: "2025-12-01T00:00:00Z" },
        { name: "repo7", stargazers_count: 6, updated_at: "2025-11-01T00:00:00Z" },
        { name: "repo8", stargazers_count: 6, updated_at: "2025-10-01T00:00:00Z" },
        { name: "repo9", stargazers_count: 6, updated_at: "2025-09-01T00:00:00Z" },
        { name: "repo10", stargazers_count: 6, updated_at: "2025-08-01T00:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/last-updated");

  expect(res.body).toEqual(
    [
      { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      { name: "repo2", stargazers_count: 6, updated_at: "2026-04-01T00:00:00Z" },
      { name: "repo3", stargazers_count: 6, updated_at: "2026-03-01T00:00:00Z" },
      { name: "repo4", stargazers_count: 6, updated_at: "2026-02-01T00:00:00Z" },
      { name: "repo5", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
    ]);
});

//every repo has the same day and time
test("returns a list with the 5 first repos when all of them have the same day and time", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo6", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo7", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/last-updated");

  expect(res.body).toEqual(
    [
      { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      { name: "repo2", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      { name: "repo4", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      { name: "repo5", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
    ]);
});

//every repo has the same day
test("returns a list with the 5 last updated repos when they have the same day but not the same time", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T01:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-05-01T02:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T03:00:00Z" },
        { name: "repo4", stargazers_count: 6, updated_at: "2026-05-01T04:00:00Z" },
        { name: "repo5", stargazers_count: 6, updated_at: "2026-05-01T05:00:00Z" },
        { name: "repo6", stargazers_count: 6, updated_at: "2026-05-01T06:00:00Z" },
        { name: "repo7", stargazers_count: 6, updated_at: "2026-05-01T07:00:00Z" },
        { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
        { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T09:00:00Z" },
        { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T10:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/last-updated");

  expect(res.body).toEqual(
    [
      { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T10:00:00Z" },
      { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T09:00:00Z" },
      { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
      { name: "repo7", stargazers_count: 6, updated_at: "2026-05-01T07:00:00Z" },
      { name: "repo6", stargazers_count: 6, updated_at: "2026-05-01T06:00:00Z" },
    ]);
});


//missing updated_at attribute
test("returns a list with the last updated repos and skips the ones without updated_at attribute", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 6 },
        { name: "repo2", stargazers_count: 6 },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
        { name: "repo4", stargazers_count: 6, },
        { name: "repo5", stargazers_count: 6, },
        { name: "repo6", stargazers_count: 6, },
        { name: "repo7", stargazers_count: 6, },
        { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T03:00:00Z" },
        { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T02:00:00Z" },
        { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T01:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/last-updated");

  expect(res.body).toEqual(
    [
      { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
      { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T03:00:00Z" },
      { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T02:00:00Z" },
      { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T01:00:00Z" },
    ]);
});

//------------------TESTS: Sum of all repository stars ------------------
//happy path
test("adds the stargazers_count attribute", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 1, updated_at: "2026-05-01T01:00:00Z" },
        { name: "repo2", stargazers_count: 2, updated_at: "2026-05-01T02:00:00Z" },
        { name: "repo3", stargazers_count: 3, updated_at: "2026-05-01T03:00:00Z" },
        { name: "repo4", stargazers_count: 4, updated_at: "2026-05-01T04:00:00Z" },
        { name: "repo5", stargazers_count: 5, updated_at: "2026-05-01T05:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/sum-stars");

  expect(res.body).toBe(15)
});

//missing stargazers_count
test("doesn't add if stargazers_count is missing", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", updated_at: "2026-05-01T01:00:00Z" },
        { name: "repo2", stargazers_count: 2, updated_at: "2026-05-01T02:00:00Z" },
        { name: "repo3", stargazers_count: 3, updated_at: "2026-05-01T03:00:00Z" },
        { name: "repo4", updated_at: "2026-05-01T04:00:00Z" },
        { name: "repo5", stargazers_count: 5, updated_at: "2026-05-01T05:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/sum-stars");

  expect(res.body).toBe(10)
});


//big number of stars
test("adds the stargazers_count attribute", async () => {
  server.use(
    http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
      return HttpResponse.json([
        { name: "repo1", stargazers_count: 150, updated_at: "2026-05-01T01:00:00Z" },
        { name: "repo2", stargazers_count: 2000, updated_at: "2026-05-01T02:00:00Z" },
        { name: "repo3", stargazers_count: 310, updated_at: "2026-05-01T03:00:00Z" },
        { name: "repo4", stargazers_count: 500, updated_at: "2026-05-01T04:00:00Z" },
      ]);
    })
  );

  const res = await request(app).get("/sum-stars");

  expect(res.body).toBe(2960)
});