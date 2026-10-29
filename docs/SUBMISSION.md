# GitHub submission steps

1. Create a new public GitHub repository for this project, using the project folder name.
2. Open a terminal in this project folder.
3. Run:
   ```bash
   git init
   git add .
   git commit -m "Build initial frontend internship project"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
4. Replace the remote URL with your own repository URL. Do not publish secrets or `.env` files.
5. Add README screenshots only after capturing your own actual application.
6. Verify the repository README renders, source files are present, and a fresh clone can install/build.
7. If using GitHub Pages, note that a Vite SPA may require base-path configuration; otherwise use a suitable static hosting provider.
8. Include repository URL and demo URL in your final submission only after they exist and work.
