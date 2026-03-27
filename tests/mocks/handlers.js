import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.github.com/orgs/stackbuilders/repos", () => {
    return HttpResponse.json([
      {
        name: "repo1",
        stargazers_count: 10,
        updated_at: "2026-03-20T10:00:00Z"
      },
      {
        name: "repo2",
        stargazers_count: 3,
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        name: "repo3",
        stargazers_count: 7,
        updated_at: "2026-03-21T10:00:00Z"
      }
    ]);
  })
];