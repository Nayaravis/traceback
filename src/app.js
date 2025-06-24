const errorPreviewContainer = document.getElementById("error-preview");
const errorList = document.getElementById("error-list");

function displayEmpty() {
    errorPreviewContainer.innerHTML =  `
    <div class="w-full h-full flex items-center justify-center text-gray-400">
        <p class="text-2xl font-semibold">SELECT_ERROR_FROM_SIDEBAR</p>
    </div>
    `;
};

function createErrorCard(errorObject) {
    return `
    <li class="p-3.5 w-full border-b-2 border-b-gray-400">
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
