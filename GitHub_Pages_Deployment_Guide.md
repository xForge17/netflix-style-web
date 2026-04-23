# GitHub Pages Deployment Guide for Vite React Apps

Here's a complete step-by-step guide to deploy your Vite React app to GitHub Pages.

## Prerequisites
- Your project is a Vite-based React app (with `vite.config.js` and `package.json`)
- You have Node.js and npm installed
- You have a GitHub account
- Your project builds successfully with `npm run build`

## Step 1: Build Your Project Locally
1. Open a terminal in your project folder
2. Run: `npm run build`
   - This creates a `dist/` folder with your production-ready files
   - If you get permission errors on Windows, try `npm.cmd run build`

## Step 2: Set Up Git (If Not Already Done)
1. Configure your Git identity (replace with your actual details):
   ```
   git config user.name "YourGitHubUsername"
   git config user.email "your-email@example.com"
   ```
2. If your project isn't a Git repo yet:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

## Step 3: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name it (e.g., `netflix-style-web` or whatever you want)
4. Make it **public** (required for free GitHub Pages) or private
5. **Don't** initialize with README, .gitignore, or license (since you already have files)
6. Click **"Create repository"**
7. Copy the repository URL (HTTPS): `https://github.com/YourUsername/YourRepoName.git`

## Step 4: Connect Local Repo to GitHub
1. In your terminal:
   ```
   git remote add origin https://github.com/YourUsername/YourRepoName.git
   git push -u origin main
   ```
2. If prompted, authenticate in your browser (GitHub will ask for permission)

## Step 5: Configure Vite for GitHub Pages
1. Open `vite.config.js` in your editor
2. Add `base: '/YourRepoName/'` to the config object. For example:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/YourRepoName/',  // ← Add this line
     server: {
       port: 4173,
     },
   })
   ```
3. Save the file

## Step 6: Set Up Automatic Deployment with GitHub Actions
1. Create the folder structure: `.github/workflows/`
2. Create a new file: `.github/workflows/deploy.yml`
3. Add this content to `deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           if: github.ref == 'refs/heads/main'
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```
4. Save the file

## Step 7: Commit and Push the Changes
1. In terminal:
   ```
   git add .
   git commit -m "Add GitHub Pages deployment setup"
   git push
   ```

## Step 8: Enable GitHub Pages
1. Go back to your GitHub repository
2. Click **Settings** (top right)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **"Deploy from a branch"**
5. Select **gh-pages** branch and **/(root)** folder
6. Click **Save**

## Step 9: Wait for Deployment
1. Go to the **Actions** tab in your GitHub repo
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait for it to complete (usually 2-3 minutes)
4. Your site will be live at: `https://YourUsername.github.io/YourRepoName/`

## Future Updates
- Any time you make changes and push to the `main` branch, the site will automatically rebuild and redeploy
- If you need to redeploy manually, go to Actions tab and click "Run workflow" on the deploy workflow

## Troubleshooting Tips
- If the site doesn't load, check the Actions tab for build errors
- Make sure your `base` in `vite.config.js` matches your repo name exactly
- For private repos, GitHub Pages requires a Pro account
- If you get 404s, double-check the Pages settings and that the workflow completed successfully

This process uses GitHub Actions to automatically build and deploy your site, so you don't need to manually upload the `dist` folder each time!