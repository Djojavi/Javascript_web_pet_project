import { Octokit, App } from "octokit";
import express from 'express';

const app = express();
const PORT = 3000;

const octokit = new Octokit({
  auth: process.env.GIT_TOKEN
})

//helper functions
const reposWith5StarsOrHigher = (repos) => {
    return repos
        .filter(r => r.stargazers_count >= 5);
}

const reposLastUpdated = (repos) => {
  return repos
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
};


app.get('/more-than-5-stars', async (req, res) => {
  try {
    const response = await octokit.request('GET /orgs/{org}/repos', {
      org: 'stackbuilders',
      headers: {
        'X-GitHub-Api-Version': '2026-03-10'
      }
    });

    res.json(reposWith5StarsOrHigher(response.data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

app.get('/last-updated', async (req, res) => {
  try {
    const response = await octokit.request('GET /orgs/{org}/repos', {
      org: 'stackbuilders',
      headers: {
        'X-GitHub-Api-Version': '2026-03-10'
      }
    });

    res.json(reposLastUpdated(response.data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
