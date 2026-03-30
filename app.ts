import { Octokit, App } from "octokit";
import express from 'express';
import path from 'path';
import { fileURLToPath } from "url";
import type { components } from "@octokit/openapi-types";

type Repo = components["schemas"]["repository"];

export const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const octokit = new Octokit({
  auth: process.env.GIT_TOKEN
})

//helper functions
const reposWith5StarsOrHigher = (repos: Repo[]) => {
  return repos
    .filter(r => r.stargazers_count >= 5);
}

const reposWithMostStars = (repos: Repo[]) => {
  return repos
    .filter(r => r.stargazers_count)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);
}

const reposLastUpdated = (repos: Repo[]) => {
  return repos
    .filter((r): r is Repo & { updated_at: string } => typeof r.updated_at === 'string')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);
};

const reposSumStars = (repos: Repo[]) => {
  return repos
    .filter(r => r.stargazers_count)
    .reduce((acc, currentValue) => acc + currentValue.stargazers_count, 0)
}

const removeReposWithH = (repos: Repo[]) => {
  return repos.filter(r => !r.name.toLowerCase().startsWith('h'));
}

const sortReposAlphabetically = (repos: Repo[]) => {
  return repos.sort((a, b) => a.name.localeCompare(b.name));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/api/v2/repos', (req, res) => {
  const { filter } = req.query;
  octokit.request('GET /orgs/{org}/repos', {
    org: 'stackbuilders',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10'
    }
  }).then(response => {
    const repos: Repo[] = response.data as any;

    let result;

    switch (filter) {
      case 'more-than-5-stars':
        result = reposWith5StarsOrHigher(repos);
        break;

      case 'last-updated':
        result = reposLastUpdated(repos);
        break;

      case 'sum-stars':
        result = reposSumStars(repos);
        break;

      case 'most-stars':
        result = reposWithMostStars(repos);
        break;

      case 'alphabetical':
        result = sortReposAlphabetically(removeReposWithH(repos));
        break;

      default:
        result = repos;
    }

    res.json(result);
  })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch repos' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export {
  reposLastUpdated,
  reposSumStars,
  reposWith5StarsOrHigher,
};
export default app;