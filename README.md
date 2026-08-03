# muzxfir.github.io

Simple and working GitHub portfolio website.

## Features

- GitHub profile auto load
- All public repositories auto load
- Search
- Language filter
- Sort by update, stars or name
- Project details page
- README preview
- GitHub, demo and ZIP download buttons
- About page
- Contact page
- 404 page
- Mobile responsive layout

## Upload

Upload all files and folders to the root of:

`https://github.com/muzxfir/muzxfir.github.io`

Keep this structure:

```text
index.html
project.html
about.html
contact.html
404.html
assets/
  css/style.css
  js/app.js
  js/project.js
README.md
```

## Enable GitHub Pages

Open:

`Settings → Pages`

Choose:

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

Website:

`https://muzxfir.github.io`

## Enable Giscus comments

1. Open repository Settings.
2. Under General → Features, enable Discussions.
3. Install the Giscus GitHub App for this repository.
4. Open giscus.app.
5. Enter `muzxfir/muzxfir.github.io`.
6. Choose a Discussions category.
7. Copy the generated script.
8. Open `index.html`.
9. Find: `Paste your generated Giscus script here`.
10. Paste the script inside the comments box.

Comments will not work until this Giscus setup is completed.
