import { http, HttpResponse } from "msw";
import { server } from "./mocks/server.js";
import request from "supertest";
import app from "../app.js";
import { expect, describe, afterEach, it } from '@jest/globals';

//------------------TESTS: 5 repos with the most stars------------------
describe("GET api/v2/repos?filter=most-stars", () => {
  afterEach(() => server.resetHandlers());

  describe("when every repo has the same amount of stars", () => {
    it("should return a list with the 5 first ones", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo3", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo4", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo5", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo6", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo7", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=most-stars");

      expect(res.body).toEqual([
        { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
      ]);
    });

  });

  describe("when there are no repos", () => {
    it("should return an empty list ", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=most-stars");

      expect(res.body).toEqual([]);
    });
  });

  describe("when each repo has a different amount of stars", () => {
    it("should return the 5 repos with the most stars", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo3", stargazers_count: 7, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo4", stargazers_count: 8, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo5", stargazers_count: 9, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo6", stargazers_count: 10, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo7", stargazers_count: 11, updated_at: "2026-01-01T00:00:00Z" },
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=most-stars");

      expect(res.body).toEqual([
        { name: "repo7", stargazers_count: 11, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo6", stargazers_count: 10, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 9, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 8, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 7, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    });

    it("should return the  repos with the most stars", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=most-stars");

      expect(res.body).toEqual([
        { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },

      ]);
    });
  });

  describe("when some repos don't have stargazers_count attribute", () => {
    it("should skip repos with missing attribute stargazers_count", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 60, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo3", updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo4", stargazers_count: 18, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo5", stargazers_count: 9, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo6", updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo7", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo8", stargazers_count: 3, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo9", stargazers_count: 1, updated_at: "2026-01-01T00:00:00Z" },

          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=most-stars");

      expect(res.body).toEqual([
        { name: "repo2", stargazers_count: 60, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 18, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 9, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo7", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo8", stargazers_count: 3, updated_at: "2026-01-01T00:00:00Z" },
      ]);
    });
  });
});
//------------------TESTS: repos alphabetically and without the letter "h" ------------------

//------------------TESTS: repos with 5 stars or more ------------------

describe("GET api/v2/repos?filter=more-than-5-stars", () => {
  afterEach(() => server.resetHandlers());

  describe("when some repos have more than 5 stars", () => {
    it("should return a list with two repos", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 2, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo3", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=more-than-5-stars");

      expect(res.body).toEqual([
        { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    });

  });

  describe("when no repo has more than or equal than 5 stars", () => {
    it("should return an empty list when no repos have >=5 stars", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 1, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 2, updated_at: "2026-01-01T00:00:00Z" }
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=more-than-5-stars");

      expect(res.body).toEqual([]);
    });
  });

  describe("when all repos have more than or equal than 5 stars", () => {
    it("should return a full list when every repos has >=5 stars", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=more-than-5-stars");

      expect(res.body).toEqual([
        { name: "repo1", stargazers_count: 5, updated_at: "2026-01-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    });
  });

  describe("when some repos don't have stargazers_count attribute", () => {
    it("should skip repos with missing attribute stargazers_count", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", updated_at: "2026-01-01T00:00:00Z" },
            { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=more-than-5-stars");

      expect(res.body).toEqual([
        { name: "repo2", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" }
      ]);
    });
  });
});

//------------------TESTS: Last 5 updated repositories ------------------
describe("GET api/v2/repos?filter=last-updated", () => {
  afterEach(() => server.resetHandlers());

  describe("when there are more than 5 repos", () => {
    it("should return a list with the 5 last updated repos", async () => {
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

      const res = await request(app).get("/api/v2/repos?filter=last-updated");

      expect(res.body).toEqual([
        { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-04-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-03-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 6, updated_at: "2026-02-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 6, updated_at: "2026-01-01T00:00:00Z" },
      ]);
    });
  });

  describe("when every repo has the same updated_at date", () => {
    it("should return a list with the 5 first repos", async () => {
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

      const res = await request(app).get("/api/v2/repos?filter=last-updated");

      expect(res.body).toEqual([
        { name: "repo1", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo2", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo4", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
        { name: "repo5", stargazers_count: 6, updated_at: "2026-05-01T00:00:00Z" },
      ]);
    });
  });

  describe("when the repos have the same updated_at date but different times", () => {
    it("should return a list with the 5 last updated repos", async () => {
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

      const res = await request(app).get("/api/v2/repos?filter=last-updated");

      expect(res.body).toEqual([
        { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T10:00:00Z" },
        { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T09:00:00Z" },
        { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
        { name: "repo7", stargazers_count: 6, updated_at: "2026-05-01T07:00:00Z" },
        { name: "repo6", stargazers_count: 6, updated_at: "2026-05-01T06:00:00Z" },
      ]);
    });
  });

  describe("when some repos don't have updated_at attribute", () => {
    it("returns a list with the last updated repos and skips the ones without updated_at attribute", async () => {
      server.use(
        http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
          return HttpResponse.json([
            { name: "repo1", stargazers_count: 6 },
            { name: "repo2", stargazers_count: 6 },
            { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
            { name: "repo4", stargazers_count: 6 },
            { name: "repo5", stargazers_count: 6 },
            { name: "repo6", stargazers_count: 6 },
            { name: "repo7", stargazers_count: 6 },
            { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T03:00:00Z" },
            { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T02:00:00Z" },
            { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T01:00:00Z" },
          ]);
        })
      );

      const res = await request(app).get("/api/v2/repos?filter=last-updated");

      expect(res.body).toEqual([
        { name: "repo3", stargazers_count: 6, updated_at: "2026-05-01T08:00:00Z" },
        { name: "repo8", stargazers_count: 6, updated_at: "2026-05-01T03:00:00Z" },
        { name: "repo9", stargazers_count: 6, updated_at: "2026-05-01T02:00:00Z" },
        { name: "repo10", stargazers_count: 6, updated_at: "2026-05-01T01:00:00Z" },
      ]);
    });
  });
});

//------------------TESTS: Sum of all repository stars ------------------

describe("GET api/v2/repos?filter=sum-stars", () => {
  afterEach(() => server.resetHandlers());

  describe("when all repos have stargazers_count attribute", () => {
    it("should return the sum of all stargazers_count values", async () => {
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

      const res = await request(app).get("/api/v2/repos?filter=sum-stars");

      expect(res.body).toBe(15);
    });
  });

  describe("when some repos don't have stargazers_count attribute", () => {
    it("should skip the repos without the attribute and add the remaining values", async () => {
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

      const res = await request(app).get("/api/v2/repos?filter=sum-stars");

      expect(res.body).toBe(10);
    });
  });

  describe("when the stargazers_count values are big numbers", () => {
    it("should return the addition of all stargazers_count values", async () => {
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

      const res = await request(app).get("/api/v2/repos?filter=sum-stars");

      expect(res.body).toBe(2960);
    });
  });
});