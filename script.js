// === DAELAN'S DOWNLOADABLE WEBSITE — PART 1 ===
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.vbs', '.jse', '.wsf', 
                            '.msi', '.reg', '.com', '.scr', '.hta', '.cpl', '.jar', '.app'];

const items = [
    {
        id: 1,
        title: "Windows 12 Presentation Pack",
        description: "Complete presentation show showcasing Windows 12 editions, launcher designs, and UI concepts",
        category: "Archives",
        thumbnail: "assets/Win12_Launcher_Preview_Video.mp4",
        isVideoThumbnail: true,
        fileSize: "28.26 MB",
        dateCreated: "2026-09-25",
        downloadLinks: [
            { url: "assets/Win12_Build.daex", name: "Win12_Build.daex" },
            { url: "assets/Win12_Build.daex", name: "Win12_Build.dae" }
        ],
        featured: true
    },
    {
        id: 2,
        title: "Photo Preview",
        description: "Sample preview item — replace with your own creations",
        category: "Media",
        thumbnail: "assets/sample-1.jpg",
        isVideoThumbnail: false,
        fileSize: "8.2 MB",
        dateCreated: "2026-09-24",
        downloadLinks: [
            { url: "assets/sample-1.jpg", name: "sample-1.jpg" }
        ],
        featured: false
    },
    {
        id: 3,
        title: "Video Preview",
        description: "Video showcase of upcoming content from Daelan's studio",
        category: "Media",
        thumbnail: "assets/video-showcase.mp4",
        isVideoThumbnail: true,
        fileSize: "45.1 MB",
        dateCreated: "2026-09-23",
        downloadLinks: [
            { url: "assets/video-showcase.mp4", name: "video-showcase.mp4" }
        ],
        featured: false
    },
    {
        id: 4,
        title: "PDF Preview",
        description: "Random PDF showcase",
        category: "Documents",
        thumbnail: null,
        isVideoThumbnail: false,
        fileSize: "45.1 MB",
        dateCreated: "2026-09-23",
        downloadLinks: [
            { url: "assets/The reason behind my Free Product Key of MC Office 360, 2016 (PPXT PDF).pdf", name: "The reason behind my Free Product Key of MC Office 360, 2016 (PPXT PDF).pdf" }
        ],
        featured: false
    }
];

let currentSourceFilter = "all";
let currentCategoryFilter = "all";
let currentSearchQuery = "";

function getSavedLocals() {
    return JSON.parse(localStorage.getItem("daelan-saved-locals") || "[]");
}

function getDownloadHistory() {
    return JSON.parse(localStorage.getItem("daelan-download-history") || "[]");
}

function isFileSafe(filename) {
    const lower = filename.toLowerCase();
    return !BLOCKED_EXTENSIONS.some(ext => lower.endsWith(ext));
}

function createItemCard(item) {
    const safeLinks = item.downloadLinks.filter(link => isFileSafe(link.name));
    const unsafeLinks = item.downloadLinks.filter(link => !isFileSafe(link.name));
    const savedLocals = getSavedLocals();
    const isLocal = savedLocals.includes(item.id);

    const sourceBadge = isLocal
        ? '<span class="badge-local">Local (Offline)</span>'
        : '<span class="badge-server">Server (Wi-Fi/Data)</span>';

    const categoryBadge = item.category
        ? '<span class="badge-cat">' + item.category + '</span>'
        : '';

    const addLocalBtn = isLocal
        ? '<button class="btn-add-local saved" disabled>✓ Added to Locals</button>'
        : '<button class="btn-add-local" onclick="addToLocals(' + item.id + ', this)">+ Add to Locals</button>';

    const thumbHTML = item.thumbnail ? '<img src="' + item.thumbnail + '" alt="' + item.title + '">' : '';
    const playHTML = item.isVideoThumbnail ? '<div class="play-icon"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>' : '';
    const countText = safeLinks.length > 1 ? '(' + safeLinks.length + ' files)' : '';
    const unsafeHTML = unsafeLinks.length > 0 ? '<p style="color:#f87171;font-size:11px;margin-top:8px;">⚠️ ' + unsafeLinks.length + ' file blocked for safety</p>' : '';

    return '<div class="item-card ' + (item.featured ? 'featured' : '') + '" data-id="' + item.id + '">' +
        '<div class="card-thumbnail">' + thumbHTML + playHTML +
            '<button class="card-menu">⋯</button>' +
            '<span class="card-size-badge">' + item.fileSize + '</span>' +
        '</div>' +
        '<div class="card-content">' +
            '<div>' +
                '<div class="badges-row">' + sourceBadge + categoryBadge + '</div>' +
                '<h3 class="card-title">' + item.title + '</h3>' +
                '<p class="card-desc">' + item.description + '</p>' +
            '</div>' +
            '<div>' +
                '<div class="card-meta"><span>📅 ' + item.dateCreated + '</span></div>' +
                '<div class="card-actions">' +
                    addLocalBtn +
                    '<button class="download-btn" onclick="handleDownload(' + item.id + ')">⬇ Download ' + countText + '</button>' +
                '</div>' +
                unsafeHTML +
            '</div>' +
        '</div>' +
    '</div>';
}

function applyFiltersAndRender() {
    const grid = document.getElementById('items-grid');
    if (!grid) return;
    const savedLocals = getSavedLocals();

    const filtered = items.filter(item => {
        const isLocal = savedLocals.includes(item.id);
        const itemSource = isLocal ? "Local" : "Server";
        const matchesSource = currentSourceFilter === "all" || itemSource === currentSourceFilter;
        const matchesCategory = currentCategoryFilter === "all" || item.category === currentCategoryFilter;
        const matchesSearch = !currentSearchQuery || 
            item.title.toLowerCase().includes(currentSearchQuery) ||
            item.description.toLowerCase().includes(currentSearchQuery);
        return matchesSource && matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:#94A3B8; grid-column: 1/-1; text-align:center; padding: 40px;">No downloadable items match your current filter.</p>';
    } else {
        grid.innerHTML = filtered.map(item => createItemCard(item)).join('');
    }
    updateFilterBar();
}

function addToLocals(itemId, btnElement) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (!navigator.onLine) {
        alert("You are offline! Connect to Wi-Fi or Mobile Data to turn Server files into Local files.");
        return;
    }

    btnElement.innerText = "Copying to Local...";
    btnElement.disabled = true;

    const urlsToCache = item.downloadLinks
        .filter(link => isFileSafe(link.name))
        .map(link => link.url);

    if (item.thumbnail) {
        urlsToCache.push(item.thumbnail);
    }

    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: "SAVE_LOCAL_ITEM",
            id: item.id,
            urls: urlsToCache
        });
    } else {
        markItemAsLocal(item.id);
    }
}

function markItemAsLocal(itemId) {
    const locals = getSavedLocals();
    if (!locals.includes(itemId)) {
        locals.push(itemId);
        localStorage.setItem("daelan-saved-locals", JSON.stringify(locals));
    }
    applyFiltersAndRender();
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "LOCAL_ITEM_SAVED") {
            markItemAsLocal(event.data.id);
        }
    });
}

// === DAELAN'S DOWNLOADABLE WEBSITE — PART 2 ===
function handleDownload(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const isLocal = getSavedLocals().includes(item.id);

    if (!isLocal && !navigator.onLine) {
        alert("Offline Error: This item has a Server tag and requires Wi-Fi or Data. Tap + Add to Locals while online to download it offline!");
        return;
    }

    const history = getDownloadHistory();
    history.unshift({
        id: item.id,
        title: item.title,
        source: isLocal ? "Local" : "Server",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem("daelan-download-history", JSON.stringify(history.slice(0, 30)));

    item.downloadLinks.forEach(link => {
        if (isFileSafe(link.name)) {
            const a = document.createElement('a');
            a.href = link.url;
            a.download = link.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });
}

const categoriesBtn = document.getElementById('categories-toggle-btn');
const categoriesMenu = document.getElementById('categories-menu');

if (categoriesBtn && categoriesMenu) {
    categoriesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        categoriesMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        categoriesMenu.classList.remove('show');
    });
}

function filterBySource(source) {
    currentSourceFilter = source;
    applyFiltersAndRender();
}

function filterByFileType(category) {
    currentCategoryFilter = category;
    applyFiltersAndRender();
}

function resetFilters() {
    currentSourceFilter = "all";
    currentCategoryFilter = "all";
    currentSearchQuery = "";
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = "";
    applyFiltersAndRender();
}

function updateFilterBar() {
    const bar = document.getElementById('active-filter-bar');
    const label = document.getElementById('filter-label');
    if (!bar || !label) return;

    if (currentSourceFilter === "all" && currentCategoryFilter === "all") {
        bar.style.display = "none";
    } else {
        bar.style.display = "inline-flex";
        label.innerText = "Source: " + currentSourceFilter.toUpperCase() + " | Type: " + currentCategoryFilter.toUpperCase();
    }
}

const searchInputEl = document.getElementById('search-input');
if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        applyFiltersAndRender();
    });
}

const modal = document.getElementById('mydownloads-modal');
const openModalBtn = document.getElementById('open-mydownloads-btn');
const closeModalBtn = document.getElementById('close-mydownloads-btn');
let activeModalTab = "downloads";

if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
        modal.style.display = "flex";
        renderModalContent();
    });
}

if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });
}

function switchModalTab(tab) {
    activeModalTab = tab;
    document.getElementById('tab-downloads').classList.toggle('active', tab === "downloads");
    document.getElementById('tab-locals').classList.toggle('active', tab === "locals");
    renderModalContent();
}

function renderModalContent() {
    const container = document.getElementById('modal-list-container');
    if (!container) return;
    container.innerHTML = "";

    if (activeModalTab === "downloads") {
        const history = getDownloadHistory();
        if (history.length === 0) {
            container.innerHTML = '<p style="color:#94A3B8; text-align:center; padding:20px;">No downloads recorded yet.</p>';
            return;
        }
        history.forEach(entry => {
            container.innerHTML += '<div class="modal-item">' +
                '<div class="modal-item-info">' +
                    '<h4>' + entry.title + '</h4>' +
                    '<span>Downloaded via ' + entry.source + ' at ' + entry.time + '</span>' +
                '</div>' +
                '<button class="btn-download" style="width:auto; padding:6px 14px; font-size:12px;" onclick="handleDownload(' + entry.id + ')">Download Again</button>' +
            '</div>';
        });
    } else {
        const localIds = getSavedLocals();
        if (localIds.length === 0) {
            container.innerHTML = '<p style="color:#94A3B8; text-align:center; padding:20px;">No Local files saved yet. Tap "+ Add to Locals" on any item to store a copy offline.</p>';
            return;
        }
        localIds.forEach(id => {
            const item = items.find(i => i.id === id);
            if (!item) return;
            container.innerHTML += '<div class="modal-item">' +
                '<div class="modal-item-info">' +
                    '<h4>' + item.title + '</h4>' +
                    '<span>' + (item.category || 'File') + ' • ' + item.fileSize + ' (Offline Ready)</span>' +
                '</div>' +
                '<div style="display:flex; gap:6px;">' +
                    '<button class="btn-download" style="width:auto; padding:6px 12px; font-size:12px;" onclick="handleDownload(' + item.id + ')">Download</button>' +
                    '<button class="btn-remove-local" onclick="removeFromLocals(' + item.id + ')">Remove</button>' +
                '</div>' +
            '</div>';
        });
    }
}

function removeFromLocals(itemId) {
    const item = items.find(i => i.id === itemId);
    const updated = getSavedLocals().filter(id => id !== itemId);
    localStorage.setItem("daelan-saved-locals", JSON.stringify(updated));

    if (item && navigator.serviceWorker && navigator.serviceWorker.controller) {
        const urlsToRemove = item.downloadLinks.map(l => l.url);
        if (item.thumbnail) urlsToRemove.push(item.thumbnail);

        navigator.serviceWorker.controller.postMessage({
            type: "REMOVE_LOCAL_ITEM",
            urls: urlsToRemove
        });
    }
    renderModalContent();
    applyFiltersAndRender();
}

applyFiltersAndRender();
console.log("✅ Daelan's Downloadable Website loaded!");
console.log("🛡️ Safety active — script/program files blocked");
