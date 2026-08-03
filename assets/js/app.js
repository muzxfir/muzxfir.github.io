
const USERNAME = "muzxfir";
const API = "https://api.github.com";
let repos = [];

const grid = document.getElementById("projectsGrid");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const languageFilter = document.getElementById("languageFilter");
const sortSelect = document.getElementById("sortSelect");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click",()=>navLinks.classList.toggle("open"));

function escapeHtml(value=""){
  return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function formatDate(date){
  return new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric"}).format(new Date(date));
}
function demoUrl(repo){
  if(repo.homepage) return repo.homepage;
  if(repo.has_pages) return `https://${USERNAME}.github.io/${repo.name}/`;
  return "";
}
function render(){
  const q=searchInput.value.trim().toLowerCase();
  const lang=languageFilter.value;
  const sort=sortSelect.value;

  let list=repos.filter(r=>{
    const text=`${r.name} ${r.description||""} ${(r.topics||[]).join(" ")}`.toLowerCase();
    return text.includes(q)&&(lang==="all"||r.language===lang);
  });

  list.sort((a,b)=>{
    if(sort==="stars") return b.stargazers_count-a.stargazers_count;
    if(sort==="name") return a.name.localeCompare(b.name);
    return new Date(b.updated_at)-new Date(a.updated_at);
  });

  grid.innerHTML=list.map(r=>`
    <article class="project-card">
      <h3>${escapeHtml(r.name)}</h3>
      <p>${escapeHtml(r.description||"Open-source project by MUZXFIR.")}</p>
      <div class="repo-meta">
        ${r.language?`<span>${escapeHtml(r.language)}</span>`:""}
        <span>★ ${r.stargazers_count}</span>
        <span>Forks ${r.forks_count}</span>
        <span>${formatDate(r.updated_at)}</span>
      </div>
      <div class="repo-actions">
        <a href="project.html?repo=${encodeURIComponent(r.name)}">Details</a>
        <a href="${r.html_url}" target="_blank" rel="noreferrer">GitHub</a>
        ${demoUrl(r)?`<a href="${demoUrl(r)}" target="_blank" rel="noreferrer">Demo</a>`:""}
      </div>
    </article>`).join("");

  emptyState.classList.toggle("hidden",list.length>0);
}
function languages(){
  const items=[...new Set(repos.map(r=>r.language).filter(Boolean))].sort();
  languageFilter.innerHTML='<option value="all">All languages</option>'+
    items.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join("");
}
async function init(){
  try{
    const [pRes,rRes]=await Promise.all([
      fetch(`${API}/users/${USERNAME}`),
      fetch(`${API}/users/${USERNAME}/repos?per_page=100&sort=updated&type=owner`)
    ]);
    if(!pRes.ok||!rRes.ok) throw new Error("GitHub API error");
    const profile=await pRes.json();
    repos=(await rRes.json()).filter(r=>!r.fork);

    avatar.src=profile.avatar_url;
    profileName.textContent=profile.name||profile.login;
    profileBio.textContent=profile.bio||"Telegram Bot Developer • Web Developer • Open Source";
    repoCount.textContent=profile.public_repos;
    followersCount.textContent=profile.followers;
    starsCount.textContent=repos.reduce((n,r)=>n+r.stargazers_count,0);

    languages();
    render();
    loading.classList.add("hidden");
  }catch(e){
    console.error(e);
    loading.textContent="Unable to load repositories. Please refresh later.";
  }
}
[searchInput,languageFilter,sortSelect].forEach(el=>el.addEventListener("input",render));
init();
