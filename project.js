const USERNAME = "muzxfir";
const repoName = new URLSearchParams(window.location.search).get("repo");

const loading = document.getElementById("projectLoading");
const details = document.getElementById("projectDetails");

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function renderMarkdown(markdown) {
  let html = escapeHtml(markdown);

  html = html
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  return `<p>${html}</p>`;
}

async function loadProject() {
  if (!repoName) {
    loading.textContent = "Repository name is missing.";
    return;
  }

  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${USERNAME}/${repoName}`, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!repoResponse.ok) {
      throw new Error("Repository could not be loaded.");
    }

    const repo = await repoResponse.json();

    document.title = `${repo.name} | MUZXFIR HUB`;
    document.getElementById("projectTitle").textContent = repo.name;
    document.getElementById("projectDescription").textContent =
      repo.description || "No description is available for this repository.";
    document.getElementById("projectLanguage").textContent =
      repo.language || "Repository";
    document.getElementById("projectStars").textContent = repo.stargazers_count;
    document.getElementById("projectForks").textContent = repo.forks_count;
    document.getElementById("projectIssues").textContent = repo.open_issues_count;
    document.getElementById("projectLicense").textContent =
      repo.license?.spdx_id || "None";

    document.getElementById("githubLink").href = repo.html_url;
    document.getElementById("downloadLink").href =
      `https://github.com/${USERNAME}/${repoName}/archive/refs/heads/${repo.default_branch}.zip`;

    const liveUrl = repo.homepage ||
      (repo.has_pages ? `https://${USERNAME}.github.io/${repoName}/` : "");

    if (liveUrl) {
      const liveLink = document.getElementById("liveLink");
      liveLink.href = liveUrl;
      liveLink.classList.remove("hidden");
    }

    const tags = document.getElementById("projectTags");
    tags.innerHTML = (repo.topics || [])
      .map(topic => `<span>${escapeHtml(topic)}</span>`)
      .join("");

    const readmeResponse = await fetch(
      `https://api.github.com/repos/${USERNAME}/${repoName}/readme`,
      { headers: { Accept: "application/vnd.github.raw+json" } }
    );

    document.getElementById("readmeContent").innerHTML = readmeResponse.ok
      ? renderMarkdown(await readmeResponse.text())
      : "README is not available for this repository.";

    loading.classList.add("hidden");
    details.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    loading.textContent = "Unable to load this project. Please try again later.";
  }
}

loadProject();
