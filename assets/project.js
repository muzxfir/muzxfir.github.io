
const USERNAME="muzxfir";
const repo=new URLSearchParams(location.search).get("repo");
const loading=document.getElementById("projectLoading");
const details=document.getElementById("projectDetails");

function escapeHtml(value=""){
  return value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function simpleMarkdown(md){
  let html=escapeHtml(md);
  html=html.replace(/^### (.*)$/gm,"<h3>$1</h3>")
           .replace(/^## (.*)$/gm,"<h2>$1</h2>")
           .replace(/^# (.*)$/gm,"<h1>$1</h1>")
           .replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
           .replace(/`([^`]+)`/g,"<code>$1</code>")
           .replace(/\n\n/g,"</p><p>")
           .replace(/\n/g,"<br>");
  return `<p>${html}</p>`;
}
async function init(){
  if(!repo){loading.textContent="Repository name is missing.";return;}
  try{
    const rRes=await fetch(`https://api.github.com/repos/${USERNAME}/${repo}`);
    if(!rRes.ok) throw new Error("Repository not found");
    const data=await rRes.json();

    projectTitle.textContent=data.name;
    projectDescription.textContent=data.description||"No description available.";
    projectLanguage.textContent=data.language||"Repository";
    projectStars.textContent=data.stargazers_count;
    projectForks.textContent=data.forks_count;
    projectIssues.textContent=data.open_issues_count;
    githubLink.href=data.html_url;
    downloadLink.href=`https://github.com/${USERNAME}/${repo}/archive/refs/heads/${data.default_branch}.zip`;

    const live=data.homepage||(data.has_pages?`https://${USERNAME}.github.io/${repo}/`:"");
    if(live){liveLink.href=live;liveLink.classList.remove("hidden");}

    const readmeRes=await fetch(`https://api.github.com/repos/${USERNAME}/${repo}/readme`,{
      headers:{Accept:"application/vnd.github.raw+json"}
    });
    readmeContent.innerHTML=readmeRes.ok?simpleMarkdown(await readmeRes.text()):"README not available.";

    loading.classList.add("hidden");
    details.classList.remove("hidden");
  }catch(e){
    console.error(e);
    loading.textContent="Unable to load this project.";
  }
}
init();
