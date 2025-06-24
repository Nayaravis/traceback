const errorPreviewContainer = document.getElementById("error-preview");

function displayEmpty() {
    errorPreviewContainer.innerHTML =  `
    <div class="w-full h-full flex items-center justify-center text-gray-400">
        <p class="text-2xl font-semibold">SELECT_ERROR_FROM_SIDEBAR</p>
    </div>
    `;
};

displayEmpty();
