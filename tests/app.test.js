
import { server } from "./mocks/server.js";
import { http, HttpResponse } from "msw";
import request from "supertest";
import app from "../app.js";

//TESTS: repos with 5 stars or more ------------------

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
