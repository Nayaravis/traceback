const errorPreviewContainer = document.getElementById("error-preview");
const errorList = document.getElementById("error-list");
const errorForm = document.getElementById("error-form");
const addErrorButton = document.getElementById("add-error-button");
const navContainer = document.getElementById("nav-container");
const mainNav = document.getElementById("main-nav");

function clearForm() {
    errorForm.reset();
}

function toggleForm() {
    if (errorForm.classList.contains("hidden")) {
        addErrorButton.textContent = "CLOSE_FORM ---";
        errorForm.classList.remove("hidden");
        navContainer.classList.remove("h-20");
        navContainer.classList.add("h-screen");
        mainNav.classList.remove("h-full");
        mainNav.classList.add("h-20");
    } else {
        addErrorButton.textContent = "ADD_ERROR +++";
        errorForm.classList.add("hidden");
        navContainer.classList.add("h-20");
        navContainer.classList.remove("h-screen");
        mainNav.classList.remove("h-20");
        mainNav.classList.add("h-full");
    }
}

errorForm.addEventListener("submit", e => {
    e.preventDefault();
    const errorTitle = errorForm.title.value;
    const projectName = errorForm.project.value.trim();
    const errorDescription = errorForm.description.value;
    const githubLink = errorForm.githubLink.value.trim();
    const status = errorForm.status.value;
    const code = errorForm.code.value;
    const tags = errorForm.tags.value.split(",");
    const solution = errorForm.solution.value.trim();

    const data = {
        title: errorTitle,
        description: errorDescription,
        code: code,
        tags: tags,
        status: status,
        solution: solution,
        timestamp: new Date().toISOString(),
        project: projectName,
        githubLink: githubLink
    }

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch("http://localhost:3000/errors", requestOptions)
        .then(res => res.json())
        .then(errorObject => {
            toggleForm();
            clearForm();
            console.log(errorObject)
        })
})

function displayEmpty() {
    errorPreviewContainer.innerHTML =  `
    <div class="w-full h-full flex items-center justify-center text-gray-400">
        <p class="text-2xl font-semibold">SELECT_ERROR_FROM_SIDEBAR</p>
    </div>
    `;
};

function createDetail(errorObject) {
    return `
    <div class="w-full h-full p-8">
        <div>
            <span class="p-1.5 text-sm font-semibold 
            ${
                errorObject.status === "solved"
                ? "bg-yellow-500"
                : "bg-pink-500"
            }
            ">
            ${errorObject.status.toUpperCase()}
            </span>
        </div>
        <p class="text-white py-7 text-4xl font-semibold">
        ${errorObject.title}
        </p>
        <div class="flex gap-20">
            <div>
                <p class="text-yellow-500 text-lg font-semibold">PROJECT:</p>
                <p class="text-white text-lg py-2.5">${errorObject.project}</p>
            </div>
            <div>
                <p class="text-yellow-500 text-lg font-semibold">TIMESTAMP:</p>
                <p class="text-white text-lg py-2.5">${errorObject.timestamp}</p>
            </div>
        </div>
        <a class="text-pink-500 text-lg font-semibold underline underline-offset-8" href="${errorObject.githubLink}">VIEW_REPO →</a>
        <div class="pt-10">
            <p class="text-yellow-500 text-lg font-semibold">DESCRIPTION:</p>
            <p class="text-white text-lg p-4 bg-slate-800 mt-2 border-l-4 border-l-white">${errorObject.description}</p>
        </div>
        <div class="pt-10">
            <p class="text-yellow-500 text-lg font-semibold">CODE:</p>
            <p class="text-white p-4 bg-slate-800 mt-2 border-2 border-white">${errorObject.code}</p>
        </div>
        <div class="pt-10">
            <p class="text-yellow-500 text-lg font-semibold">TAGS:</p>
            <div class="flex gap-3">
                ${errorObject.tags.map(tag => {
                    return `<span class="p-1 bg-white text-black font-semibold">${tag}</span>`
                }).join("")}
            </div>
        </div>
        <div class="pt-10 pb-5">
            <p class="text-yellow-500 text-lg font-semibold">SOLUTION:</p>
            <textarea class="text-white p-4 bg-slate-800 mt-2 border-2 border-white w-full h-fit">${errorObject.solution}</textarea>
        </div>
    </div>
    `
}

function openErrorDetails(errorID) {
    fetch(`http://localhost:3000/errors/${errorID}`)
        .then(res => res.json())
        .then(error => {
            errorPreviewContainer.innerHTML = createDetail(error);
        });
};

function createErrorCard(errorObject) {
    return `
    <li onclick="openErrorDetails(${errorObject.id})" class="p-3.5 w-full border-b-2 border-b-gray-400 select-none cursor-pointer">
        <span class="p-1.5 text-sm font-semibold 
        ${
            errorObject.status === "solved"
            ? "bg-yellow-500"
            : "bg-pink-500"
        }
        ">
        ${errorObject.status.toUpperCase()}
        </span>
        <p class="text-white py-1.5 text-xl truncate">
        ${errorObject.title}
        </p>
        <p class="text-gray-300">
        ${errorObject.project}
        </p>
    </li>
    `;
};

function getErrors() {
    fetch("http://localhost:3000/errors")
        .then(res => res.json())
        .then(errors => errors.map(error => {
            errorList.innerHTML += createErrorCard(error);
        }).join(""));
};


document.addEventListener("DOMContentLoaded", () => {
    displayEmpty();
    getErrors();
});
