const removeActive = () => {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

}

const loadSpinner = (loadStatus) => {
    if(loadStatus){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("issues-container").classList.add("hidden");
    }else{
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("issues-container").classList.remove("hidden");
    }
}

const loadAllIssues = () => {
    loadSpinner(true);
    removeActive();
    document.getElementById("allTab").classList.add("active");
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
        displayIssues(data.data);
    })
}

const loadOpenIssues = () => {
    loadSpinner(true);
    removeActive();
    document.getElementById("openTab").classList.add("active");
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
        const allIssues = data.data;
        const openIssues = allIssues.filter(issue => issue.status === "open");
        displayIssues(openIssues);
    })
}

const loadClosedIssues = () => {
    loadSpinner(true);
    removeActive();
    document.getElementById("closedTab").classList.add("active");
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((data) => {
        const allIssues = data.data;
        const closedIssues = allIssues.filter(issue => issue.status === "closed");
        console.log(closedIssues);
        displayIssues(closedIssues);
    })
}

const displayIssues = (issues) => {
    const issuesContainer = document.getElementById("issues-container");
    
    issuesContainer.innerHTML = "";

    issues.forEach(issue => {
        const issueCard = document.createElement("div");
        const borderColor = issue.status === "open"
        ? ["border-t-3", "border-green-600"]
        : ["border-t-3", "border-purple-500"];

        issueCard.classList.add("card", "bg-white", "shadow-md", "rounded-md", ...borderColor);
        
        const statusImg = issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";
        let priorityClss;
        if(issue.priority === "high") {
            priorityClss = "text-[#EF4444] bg-[#FEECEC]";
        }else if(issue.priority === "medium") {
            priorityClss = "text-[#D97706] bg-[#FFF8DB]";
        }else{
            priorityClss = "text-[#9CA3AF] bg-[#EEEFF2]";
        }

        const date = new Date(issue.createdAt);
        const formattedDate = date.toLocaleDateString();

        

        issueCard.innerHTML = `
            <div class="border-b border-gray-300 p-6 space-y-3">
              <div class="flex justify-between items-center">
                <img class="w-6 h-6" src="${statusImg}" alt="no-img" />
                <span
                  class="px-6 py-1 ${priorityClss} font-semibold rounded-full"
                  >${issue.priority.toUpperCase()}</span
                >
              </div>
              <h3 class="font-semibold text-xl">
                ${issue.title}
              </h3>
              <p class="text-[#64748B] mb-6">
                ${issue.description}
              </p>
              <div id="tags-${issue.id}" class="flex items-center gap-2 flex-wrap">
                
              </div>
            </div>
            <div class="p-6 space-y-2 text-[#64748B]">
              <p>#${issue.id} by ${issue.author}</p>
              <p>${formattedDate}</p>
            </div>
        `;
          
        issuesContainer.appendChild(issueCard);
         addTags(issue.labels, issue.id);
    });
        loadSpinner(false);
}


const addTags = (labels, id) => {
    const tagsContainer = document.getElementById(`tags-${id}`);
    tagsContainer.innerHTML = "";
    labels.forEach(label => {
        const tag = document.createElement("span");
        

        const labelClass = label === "bug"
        ? ["text-[#EF4444]", "bg-[#FEECEC]"]
        : label === "help wanted"
        ? ["text-[#D97706]", "bg-[#FFF8DB]"]
        :label === "enhancement" 
        ? ["text-[#00A96E]", "bg-[#DEFCE8]"]
        :label === "documentation" 
        ? ["text-[#A855F7]", "bg-[#F3E8FF]"]
        : ["text-[#6B7280]", "bg-[#E5E7EB]"];



        tag.classList.add("px-6", "py-2", "rounded-full", "font-semibold", ...labelClass);
        tag.innerHTML = `<i class="fa-solid fa-${label === "bug" ? "bug" 
                        : label === "help wanted" ? "life-ring" 
                        : label === "enhancement" ? "wand-magic-sparkles" 
                        : label === "documentation" ? "book"
                        : "check-double"}">
                        </i> ${label.toUpperCase()}`;
        tagsContainer.appendChild(tag);
    });
}

loadAllIssues();


