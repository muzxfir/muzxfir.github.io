const GITHUB_USERNAME = "muzxfir";
const API_BASE = "https://api.github.com";

const projectsGrid = document.getElementById("projectsGrid");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const languageFilter = document.getElementById("languageFilter");
const sortSelect = document.getElementById("sortSelect");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

let repositories = [];

menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => navLinks.classList.remove("open"))
);

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));

const formatDate = date =>
  new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" })
    .format(new Date(date));

function getDemoUrl(repo) {
  if (repo.homepage) return repo.homepage;
  if (repo.has_pages) return `https://${GITHUB_USERNAME}.github.io/${repo.name}/`;
  return "";
}

function renderRepositories() {
  const query = searchInput.value.trim().toLowerCase();
  const language = languageFilter.value;
  const sort = sortSelect.value;

  let filtered = repositories.filter(repo => {
    const searchable = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    const matchesQuery = searchable.includes(query);
    const matchesLanguage = language === "all" || repo.language === language;
    return matchesQuery && matchesLanguage;
  });

  filtered.sort((a, b) => {
    if (sort === "stars") return b.stargazers_count - a.stargazers_count;
    if (sort === "name") return a.name.localeCompare(b.name);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  projectsGrid.innerHTML = filtered.map(repo => {
    const demoUrl = getDemoUrl(repo);
    return `
      <article class="project-card">
        <div class="repo-top">
          <div class="repo-icon">⌘</div>
          <span class="repo-visibility">Public</span>
        </div>
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || "Open-source project by MUZXFIR.")}</p>
        <div class="repo-meta">
          ${repo.language ? `<span><i class="language-dot"></i>${escapeHtml(repo.language)}</span>` : ""}
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
          <span>${formatDate(repo.updated_at)}</span>
        </div>
        <div class="repo-actions">
          <a href="project.html?repo=${encodeURIComponent(repo.name)}">Details</a>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">GitHub</a>
          ${demoUrl ? `<a href="${demoUrl}" target="_blank" rel="noreferrer">Live Demo</a>` : ""}
        </div>
      </article>
    `;
  }).join("");

  emptyState.classList.toggle("hidden", filtered.length > 0);
}

function populateLanguages() {
  const languages = [...new Set(repositories.map(repo => repo.language).filter(Boolean))].sort();
  languageFilter.innerHTML = `<option value="all">All languages</option>` +
    languages.map(language => `<option value="${escapeHtml(language)}">${escapeHtml(language)}</option>`).join("");
}

async function loadGitHubData() {
  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`${API_BASE}/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github+json" }
      }),
      fetch(`${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`, {
        headers: { Accept: "application/vnd.github+json" }
      })
    ]);

    if (!profileResponse.ok || !reposResponse.ok) {
      throw new Error("GitHub API request failed.");
    }

    const profile = await profileResponse.json();
    repositories = (await reposResponse.json()).filter(repo => !repo.fork);

    document.getElementById("avatar").src = profile.avatar_url;
    document.getElementById("profileName").textContent = profile.name || profile.login;
    document.getElementById("profileBio").textContent =
      profile.bio || "Telegram Bot Developer • Web Developer • Open Source";
    document.getElementById("repoCount").textContent = profile.public_repos;
    document.getElementById("followersCount").textContent = profile.followers;
    document.getElementById("starsCount").textContent =
      repositories.reduce((total, repo) => total + repo.stargazers_count, 0);

    populateLanguages();
    renderFeaturedProjects();
    renderRepositories();
  } catch (error) {
    console.error(error);
    loading.textContent = "Could not load GitHub repositories. Please refresh later.";
  } finally {
    if (repositories.length) loading.classList.add("hidden");
  }
}

[searchInput, languageFilter, sortSelect].forEach(element =>
  element.addEventListener("input", renderRepositories)
);

loadGitHubData();


function createParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  const count = window.innerWidth < 650 ? 18 : 34;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${8 + Math.random() * 10}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.opacity = `${0.2 + Math.random() * 0.5}`;
    container.appendChild(particle);
  }
}

createParticles();


const FEATURED_REPOSITORIES = [
  "Auto-Filter-v7",
  "MovieVault-v2",
  "TipTop-LuckyDraw",
  "MUZXFIR-HUB"
];

function renderFeaturedProjects() {
  const featuredGrid = document.getElementById("featuredGrid");
  if (!featuredGrid) return;

  const featuredRepos = FEATURED_REPOSITORIES
    .map(name => repositories.find(repo => repo.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean);

  if (!featuredRepos.length) {
    featuredGrid.innerHTML = '<div class="empty-state">Featured repositories are not available.</div>';
    return;
  }

  featuredGrid.innerHTML = featuredRepos.map(repo => {
    const demoUrl = getDemoUrl(repo);
    return `
      <article class="featured-card">
        <span class="featured-badge">★ Featured</span>
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || "Featured open-source project by MUZXFIR.")}</p>
        <div class="featured-meta">
          ${repo.language ? `<span>${escapeHtml(repo.language)}</span>` : ""}
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
          <span>${formatDate(repo.updated_at)}</span>
        </div>
        <div class="featured-actions">
          <a href="project.html?repo=${encodeURIComponent(repo.name)}">Details</a>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">GitHub</a>
          ${demoUrl ? `<a href="${demoUrl}" target="_blank" rel="noreferrer">Live Demo</a>` : ""}
        </div>
      </article>
    `;
  }).join("");
}
