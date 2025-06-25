const errorPreviewContainer = document.getElementById("error-preview");
const errorList = document.getElementById("error-list");
const errorForm = document.getElementById("error-form");
const addErrorButton = document.getElementById("add-error-button");
const navContainer = document.getElementById("nav-container");
const mainNav = document.getElementById("main-nav");

function clearForm() {
    errorForm.reset();
}

function getErrors(callback) {
    fetch("http://localhost:3000/errors")
        .then(res => res.json())
        .then(callback);
};

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
            errorList.innerHTML = createErrorCard(errorObject) + errorList.innerHTML;
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

async function toggleErrorStatus(errorId) {
  try {
    // Fetch the current error
    const res = await fetch(`http://localhost:3000/errors/${errorId}`);
    const error = await res.json();

    const updatedStatus = error.status === 'solved' ? 'pending' : 'solved';

    // Update the status
    await fetch(`http://localhost:3000/errors/${errorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: updatedStatus }),
    });

    // Rerender or refresh UI
    openErrorDetails(errorId);
    errorList.innerHTML = ""
    getErrors(errors => errors.map(error => {
        errorList.innerHTML += createErrorCard(error)
    }).join(""));
  } catch (err) {
    console.error(`Error toggling status for error ${errorId}:`, err);
  }
}


function startEditError(errorId) {
    openErrorDetails(errorId, true);
}

function cancelErrorEdit(errorId) {
    openErrorDetails(errorId, false);
}

function saveErrorEdit(errorId) {
  try {
    const updatedError = {
      title: document.getElementById('edit-title').value,
      project: document.getElementById('edit-project').value,
      githubLink: document.getElementById('edit-github').value,
      description: document.getElementById('edit-description').value,
      code: document.getElementById('edit-code').value,
      tags: document.getElementById('edit-tags').value.split(',').map(tag => tag.trim()).filter(Boolean),
      solution: document.getElementById('edit-solution').value,
      timestamp: new Date().toISOString()
    };

    fetch(`http://localhost:3000/errors/${errorId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedError),
    });

    openErrorDetails(errorId);
  } catch (err) {
    console.error('Error saving edits:', err);
  }
}


let editMode = false;
function createDetail(errorObject, isEditing = editMode) {
    const statusBadgeClass = errorObject.status === 'solved' 
        ? 'bg-yellow-400 text-black' 
        : 'bg-pink-500 text-black';
  
    const statusToggleText = errorObject.status === 'solved' ? 'PENDING' : 'SOLVED';
  
    const tagsHTML = errorObject.tags.map(tag => 
        `<span class="px-3 py-1 bg-white text-black font-black text-xs">${tag.trim()}</span>`
    ).join('');

    const projectDisplay = errorObject.project || 'No project specified';
    const githubDisplay = errorObject.githubLink 
        ? `<a href="${errorObject.githubLink}" target="_blank" rel="noopener noreferrer" class="text-pink-500 hover:text-yellow-400 underline font-bold break-all">VIEW_REPO →</a>`
        : '<p class="text-gray-500">No repository linked</p>';

    const solutionDisplay = errorObject.solution 
        ? `<pre class="text-sm text-white whitespace-pre-wrap">${errorObject.solution}</pre>`
        : '<p class="text-gray-500 italic">No solution provided yet...</p>';

    const createdDate = new Date(errorObject.timestamp).toLocaleString();

    return `
        <div class="flex-1 p-6 overflow-y-auto bg-black">
            <div class="flex items-center mb-6 pb-4 border-b-2 border-gray-800">
                <div class="flex items-center gap-4">
                    <span class="px-3 py-1 font-black text-sm ${statusBadgeClass}">
                        ${errorObject.status.toUpperCase()}
                    </span>
                    ${!isEditing ? `
                        <button
                            onclick="toggleErrorStatus(${errorObject.id})"
                            class="px-4 py-2 border-2 border-white bg-black text-white font-black text-xs hover:bg-white hover:text-black transition-colors"
                        >
                            MARK_${statusToggleText}
                        </button>
                        <button
                            onclick="startEditError(${errorObject.id})"
                            class="px-4 py-2 bg-pink-500 text-black font-black text-xs border-2 border-white hover:bg-yellow-400 transition-colors"
                        >
                            EDIT_ERROR
                        </button>
                    ` : `
                        <button
                            onclick="saveErrorEdit(${errorObject.id})"
                            class="px-4 py-2 bg-yellow-400 text-black font-black text-xs border-2 border-white hover:bg-green-500 transition-colors"
                        >
                            SAVE_CHANGES
                        </button>
                        <button
                            onclick="cancelErrorEdit(${errorObject.id})"
                            class="px-4 py-2 border-2 border-white bg-black text-white font-black text-xs hover:bg-red-500 hover:text-white transition-colors"
                        >
                            CANCEL
                        </button>
                    `}
                </div>
            </div>
            <div class="space-y-6">
                <div>
                    <h3 class="font-black mb-2 text-yellow-400 text-sm tracking-wider">ERROR_TITLE:</h3>
                    ${isEditing ? `
                        <input
                            type="text"
                            id="edit-title"
                            value="${errorObject.title}"
                            class="w-full text-2xl font-black bg-gray-900 border-2 border-white p-3 text-white font-mono"
                        />
                        ` : `
                        <h1 class="text-2xl font-black mb-4 tracking-wide text-white">${errorObject.title}</h1>
                    `}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-900 border-l-4 border-pink-500">
                    <div>
                        <h3 class="font-black mb-2 text-yellow-400 text-sm">PROJECT:</h3>
                            ${isEditing ? `
                                <input
                                    type="text"
                                    id="edit-project"
                                    value="${errorObject.project || ''}"
                                    class="w-full bg-black border-2 border-white p-2 text-white font-mono"
                                />
                                ` : `
                                <p class="font-bold text-white">${projectDisplay}</p>
                            `}
                    </div>
                <div>
                    <h3 class="font-black mb-2 text-yellow-400 text-sm">GITHUB_REPO:</h3>
                    ${isEditing ? `
                        <input
                            type="url"
                            id="edit-github"
                            value="${errorObject.githubLink || ''}"
                            class="w-full bg-black border-2 border-white p-2 text-white font-mono"
                        />
                    ` : `
                        ${githubDisplay}
                    `}
                </div>
            </div>
            <div>
                <h3 class="font-black mb-2 text-yellow-400 text-sm">DESCRIPTION:</h3>
                ${isEditing ? `
                  <textarea
                        id="edit-description"
                        rows="3"
                        class="w-full bg-gray-900 p-4 border-2 border-white text-white font-mono resize-none"
                  >${errorObject.description}</textarea>
                ` : `
                    <p class="bg-gray-900 p-4 border-l-4 border-white leading-relaxed text-white">${errorObject.description}</p>
                `}
            </div>
            <div>
                <h3 class="font-black mb-2 text-yellow-400 text-sm">CODE_SNIPPET:</h3>
                ${isEditing ? `
                    <textarea
                        id="edit-code"
                        rows="6"
                        class="w-full bg-gray-900 p-4 border-2 border-white text-white font-mono text-sm resize-none"
                    >${errorObject.code}</textarea>
                    ` : `
                    <div class="bg-gray-900 border-2 border-white">
                        <div class="bg-gray-800 px-4 py-2 border-b border-gray-600">
                            <span class="text-xs text-gray-400 font-black">CODE</span>
                        </div>
                        <pre class="p-4 overflow-x-auto text-sm">
                            <code class="text-green-400">${errorObject.code}</code>
                        </pre>
                    </div>
                `}
            </div>
            <div>
                <h3 class="font-black mb-2 text-yellow-400 text-sm">TAGS:</h3>
                ${isEditing ? `
                    <input
                        type="text"
                        id="edit-tags"
                        value="${errorObject.tags.join(', ')}"
                        placeholder="Separate with commas"
                        class="w-full bg-gray-900 border-2 border-white p-3 text-white font-mono"
                    />
                ` : `
                    <div class="flex flex-wrap gap-2">
                        ${tagsHTML}
                    </div>
                `}
            </div>
            <div>
                <h3 class="font-black mb-2 text-yellow-400 text-sm">SOLUTION:</h3>
                ${isEditing ? `
                    <textarea
                        id="edit-solution"
                        placeholder="Describe the solution..."
                        rows="4"
                        class="w-full bg-gray-900 border-2 border-white p-4 text-white font-mono resize-none"
                    >${errorObject.solution || ''}</textarea>
                ` : `
                    <div class="bg-gray-900 border-2 border-white">
                        <div class="bg-gray-800 px-4 py-2 border-b border-gray-600">
                            <span class="text-xs text-gray-400 font-black">SOLUTION</span>
                        </div>
                        <div class="p-4">
                            ${solutionDisplay}
                        </div>
                    </div>
              `}
            </div>
            <div class="pt-4 border-t border-gray-800">
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Created: ${createdDate}</span>
                    <span>ID: #${errorObject.id}</span>
                </div>
            </div>
        </div>
    </div>
  `;
}

function openErrorDetails(errorID, isEditing = false) {
    fetch(`http://localhost:3000/errors/${errorID}`)
        .then(res => res.json())
        .then(error => {
            errorPreviewContainer.innerHTML = createDetail(error, isEditing);
        });
};

function createErrorCard(errorObject) {
    return `
    <li onclick="openErrorDetails('${errorObject.id}')" class="p-3.5 w-full border-b-2 border-b-gray-400 select-none cursor-pointer">
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

document.addEventListener("DOMContentLoaded", () => {
    displayEmpty();
    getErrors(errors => errors.map(error => {
        errorList.innerHTML += createErrorCard(error)
    }).join(""));
});
