# Siri Bandaru — Security Portfolio

Midnight Plum responsive static portfolio for GitHub/Vercel.

**Pages:** `index.html` home/profile/projects/experience/skills; `journal.html` latest weekly news, observations, archive; `article.html` story detail. `data/news.json` is intentionally empty at first—no made-up news.

Before publishing, verify your profile statements, replace the LinkedIn placeholder, and update AWS/Vaultline links to direct repos when known. Vaultline is marked as a planned specification, not a finished app.

## Journal data
Edit `data/news.json`. An edition should contain an `id`, `date`, `title`, `observations` array and `stories` array. Each story should include `slug`, `title`, `category`, `date`, `sourceName`, `sourceUrl`, `summary`, `observation`, and `takeaway`. Add five stories per weekly edition; summaries should be your own words. Keep past editions in the array and set `currentEdition` to the latest ID.

## Vercel deploy
1. Create a GitHub repo and upload this folder's contents into its root.
2. Sign into Vercel with GitHub, choose **Add New → Project**, import the repo.
3. Framework preset: **Other**. Leave build/install commands blank; output directory `.`.
4. Deploy. Vercel gives you a `*.vercel.app` URL.
5. Push commits to the connected branch; Vercel automatically redeploys.

This is a static site, not a private CMS. Edit JSON, commit, push, and let Vercel redeploy.
