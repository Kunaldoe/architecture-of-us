# Deploy to GitHub so she can see the website

Your code is committed locally. Follow these steps to put it on GitHub and turn on GitHub Pages.

---

## Step 1: Create a new repository on GitHub

1. Go to **https://github.com/new**
2. **Repository name:** e.g. `happy-6th-anniversary` or `architecture-of-us`
3. Set visibility to **Public**
4. **Do not** add a README, .gitignore, or license (you already have these)
5. Click **Create repository**

---

## Step 2: Push your code from your computer

Open **PowerShell** or **Command Prompt** in `e:\Website` and run (replace `YOUR_USERNAME` and `REPO_NAME` with your GitHub username and the repo name you chose):

```powershell
cd e:\Website

git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Example if your username is `john` and repo is `happy-6th-anniversary`:

```powershell
git remote add origin https://github.com/john/happy-6th-anniversary.git
git branch -M main
git push -u origin main
```

If Git asks for login, use your GitHub username and a **Personal Access Token** (not your password). Create one at: **GitHub → Settings → Developer settings → Personal access tokens**.

---

## Step 3: Turn on GitHub Pages

1. On your repo page, go to **Settings**
2. In the left sidebar, click **Pages**
3. Under **Build and deployment**, **Source** choose **Deploy from a branch**
4. **Branch:** select `main`, folder **/ (root)**
5. Click **Save**

After a minute or two, your site will be live at:

**https://YOUR_USERNAME.github.io/REPO_NAME/**

Example: `https://john.github.io/happy-6th-anniversary/`

Share that link with P and she can open it on her phone or laptop.

---

## If your branch is still `master` instead of `main`

If `git branch -M main` didn’t run or failed, use `master` in GitHub Pages:

- In **Settings → Pages**, choose branch **master** and folder **/ (root)**.

Your site URL will be the same style: `https://YOUR_USERNAME.github.io/REPO_NAME/`.

---

## What if I make the repo private?

- **On a free GitHub account:** If you change the repo to **Private**, GitHub will **unpublish** your Pages site. The site will go down and P won’t be able to open the link anymore. GitHub Pages from private repos is only available on **paid** plans (e.g. GitHub Pro).

- **If you have GitHub Pro:** You can publish Pages from a private repo. The **code** stays private, but the **website** (the `username.github.io/...` URL) is still **public** — anyone with the link can view it. So “private repo” = private source code, not a private website.

- **If you want only P to see the site:**  
  - Keep the repo **public** but don’t share the link widely (only send it to her), or  
  - Host the same files somewhere that supports password protection (e.g. Netlify with password protect, or a simple “secret” URL), or  
  - Zip the `e:\Website` folder and send it to her so she can open `index.html` in her browser offline (works but no single “link” to open).

**Summary:** Private repo on free account = no live GitHub Pages. For a live link she can visit, keep the repo public or use a paid plan / different host.
