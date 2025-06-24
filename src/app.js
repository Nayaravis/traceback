const errorPreviewContainer = document.getElementById("error-preview");
const errorList = document.getElementById("error-list");

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
            <p class="text-white p-4 bg-slate-800 mt-2 border-2 border-white">${errorObject.solution}</p>
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
