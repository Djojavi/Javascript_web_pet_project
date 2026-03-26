import { Octokit, App } from "octokit";
import express from 'express';

const app = express();
const PORT = 3000;

const octokit = new Octokit({
  auth: process.env.GIT_TOKEN
})

app.get('/', async (req, res) => {
  try {
    const response = await octokit.request('GET /orgs/{org}/repos', {
      org: 'stackbuilders',
      headers: {
        'X-GitHub-Api-Version': '2026-03-10'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch repos' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
