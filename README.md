# MUZXFIR HUB

A dark neon developer portfolio that automatically loads all public repositories from the GitHub account **muzxfir**.

## Files

- `index.html` — website structure
- `style.css` — full responsive neon design
- `script.js` — GitHub profile and repository API integration

## Publish with GitHub Pages

1. Use the existing public repository `muzxfir.github.io`.
2. Upload `index.html`, `style.css`, and `script.js`.
3. Open the repository:
   `Settings → Pages`
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Save.

Your site should be available at:

`https://muzxfir.github.io/`

## Enable comments with Giscus

1. In the website repository, open:
   `Settings → General → Features`
2. Enable **Discussions**.
3. Install the Giscus GitHub App for the website repository.
4. Open `https://giscus.app`.
5. Enter your repository as:
   `muzxfir/muzxfir.github.io`
6. Select a Discussions category, such as **General**.
7. Copy the generated `<script>` code.
8. In `index.html`, find the `GISCUS SETUP` comment.
9. Remove the placeholder card and paste the generated script inside `.comments-card`.

Example placement:

```html
<div class="comments-card">
  <!-- Paste the generated Giscus script here -->
</div>
```

Giscus commenters must sign in with GitHub. Comments are stored in GitHub Discussions.

## Change GitHub username

In `script.js`, edit:

```js
const GITHUB_USERNAME = "muzxfir";
```

Also update GitHub links inside `index.html`.

## Notes

The public GitHub API can be used without a token, but GitHub applies an unauthenticated rate limit. For a normal personal portfolio, this is usually sufficient.
