// === DAELAN'S DOWNLOADABLE WEBSITE — JAVASCRIPT ===
// File safety rules — blocks dangerous extensions
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.vbs', '.jse', '.wsf', 
                            '.msi', '.reg', '.com', '.scr', '.hta', '.cpl', '.jar', '.app'];

// Your downloadable items — add yours here!
// Note: 'category' options are: "Media", "Documents", "Programming", "Text", "Programs", "Archives"
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
    // Copy id 4 above and edit the content like file paths, thumbnail paths, and category...
];

// === ACTIVE FILTER & STORAGE STATES ===
let currentSourceFilter = "all";   // 'all', 'Local', 'Server'
let currentCategoryFilter = "all"; // 'all', 'Media', 'Documents', 'Programming', 'Text', 'Programs', 'Archives'
let currentSearchQuery = "";

function getSavedLocals() {
    return JSON.parse(localStorage.getItem("daelan-saved-locals") || "[]");
}

function getDownloadHistory() {
    return JSON.parse(localStorage.getItem("daelan-download-history") || "[]");
}

// === SAFETY CHECK — Block dangerous files ===
function isFileSafe(filename) {
    const lower = filename.toLowerCase();
    return !BLOCKED_EXTENSIONS.some(ext => lower.endsWith(ext));
}

// === CREATE CARD HTML ===
function createItemCard(item) {
    const safeLinks = item.downloadLinks.filter(link => isFileSafe(link.name));
    const unsafeLinks = item.downloadLinks.filter(link => !isFileSafe(link.name));
    
    const savedLocals = getSavedLocals();
    const isLocal = savedLocals.includes(item.id);

    // Server vs Local Badge & Category Badge
    const sourceBadge = isLocal
        ? `<span class="badge-local">Local (Offline)</span>`
        : `<span class="badge-server">Server (Wi-Fi/Data)</span>`;

    const categoryBadge = item.category
        ? `<span class="badge-cat">${item.category}</span>`
        : '';

    // Add to Locals button placed right on top of the Download button
    const addLocalBtn = isLocal
        ? `<button class="btn-add-local saved" disabled>✓ Added to Locals</button>`
        : `<button class="btn-add-local" onclick="addToLocals(${item.id}, this)">+ Add to Locals</button>`;

    return `
        <div class="item-card ${item.featured ? 'featured' : ''}" data-id="${item.id}">
            <div class="card-thumbnail">
                ${item.thumbnail 
                    ? `<img src="${item.thumbnail}" alt="${item.title}">` 
                    : ''}
                ${item.isVideoThumbnail 
                    ? `<div class="play-icon"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>` 
                    : ''}
                <button class="card-menu">⋯</button>
                <span class="card-size-badge">${item.fileSize}</span>
            </div>
            <div class="card-content">
                <div>
                    <div class="badges-row">
                        ${sourceBadge}
                        ${categoryBadge}
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-desc">${item.description}</p>
                </div>
                <div>
                    <div class="card-meta">
                        <span>📅 ${item.dateCreated}</span>
                    </div>
                    <div class="card-actions">
                        ${addLocalBtn}
                        <button class="download-btn" onclick="handleDownload(${item.id})">
                            ⬇ Download ${safeLinks.length > 1 ? `(${safeLinks.length} files)` : ''}
                        </button>
                    </div>
                    ${unsafeLinks.length > 0 
                        ? `<p style="color:#f87171;font-size:11px;margin-top:8px;">⚠️ ${unsafeLinks.length} file blocked for safety</p>` 
                        : ''}
                </div>
            </div>
        </div>
    `;
}

// === RENDER ALL ITEMS WITH FILTERS ===
function applyFiltersAndRender() {
    const grid = document.getElementById('items-grid');
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
        grid.innerHTML = `<p style="color:#94A3B8; grid-column: 1/-1; text-align:center; padding: 40px;">No downloadable items match your current filter.</p>`;
    } else {
        grid.innerHTML = filtered.map(item => createItemCard(item)).join('');
    }

    updateFilterBar();
}

// === ADD TO LOCALS (OFFLINE CACHING) ===
function addToLocals(itemId, btnElement) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (!navigator.onLine) {
        alert("You are offline! Connect to Wi-Fi or Mobile Data to turn Server files into Local files.");
        return;
    }

    btnElement.innerText = "Copying to Local...";
    btnElement.disabled = true;

    // Collect all safe URLs + thumbnail for this item so the whole card works offline
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

// Listen for Service Worker confirmation that files finished caching
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "LOCAL_ITEM_SAVED") {
            markItemAsLocal(event.data.id);
        }
    });
}

// === DOWNLOAD HANDLER (BLOCKS SERVER FILES WHEN OFFLINE) ===
function handleDownload(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const isLocal = getSavedLocals().includes(item.id);

    // Block download if item is still on Server and user has no Wi-Fi/Data
    if (!isLocal && !navigator.onLine) {
        alert("Offline Error: This item has a 'Server' tag and requires Wi-Fi or Data. Tap '+ Add to Locals' while online to download it offline!");
        return;
    }

    // Record in My Downloads History
    const history = getDownloadHistory();
    history.unshift({
        id: item.id,
        title: item.title,
        source: isLocal ? "Local" : "Server",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem("daelan-download-history", JSON.stringify(history.slice(0, 30)));

    // Trigger all safe downloads
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

// === CATEGORIES DROPDOWN & SEARCH FILTERING ===
const categoriesBtn = document.getElementById('categories-toggle-btn');
const categoriesMenu = document.getElementById('categories-menu');

