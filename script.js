// === DAELAN'S DOWNLOADABLE WEBSITE — PART 1 ===
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.vbs', '.jse', '.wsf', 
                            '.msi', '.reg', '.com', '.scr', '.hta', '.cpl', '.jar', '.app'];
const MEDIA_CATEGORIES = ["Media", "Video", "Photo", "Audio"];
const DOCUMENTS_CATEGORIES = ["Documents", "PDF", "Macros", "Slideshows", "Spreadsheets"];
const PROGRAMMING_CATEGORIES = ["Programming", "Web (HTML/CSS/JS)", "Python", "C / C++", "Scripts & Configs"];
const TEXT_CATEGORIES = ["Text", "Plain Text (.txt)", "Markdown (.md)", "Logs & Notes"];
const PROGRAMS_CATEGORIES = ["Programs", "Android Apps", "Windows Tools", "Portable Utilities"];
const ARCHIVE_CATEGORIES = [
    "Archives",
    "Daelan's Archives",
    "Old Daelan's Archives",
    "Zip Archives",
    "Rar Archives",
    "7z Archives",
    "Tar Archives",
    "Other Tar Archives"
];

const CATEGORY_GROUPS = {
    "Media": MEDIA_CATEGORIES,
    "Documents": DOCUMENTS_CATEGORIES,
    "Programming": PROGRAMMING_CATEGORIES,
    "Text": TEXT_CATEGORIES,
    "Programs": PROGRAMS_CATEGORIES,
    "Archives": ARCHIVE_CATEGORIES
};

const items = [
    {
        id: 1,
        title: "Windows 12 Presentation Pack DAEX",
        description: "Complete presentation show showcasing Windows 12 editions, launcher designs, and UI concepts",
        category: "Daelan's Archives",
        thumbnail: "assets/Win12_Launcher_Preview_Video.mp4",
        isVideoThumbnail: true,
        fileSize: "14.13 MB",
        dateCreated: "2026-09-25",
        downloadLinks: [
            { url: "https://github.com/daecoderlover/Daelan-s-Downloadable-Items/raw/refs/heads/files_for_download/assets/Win12_Build.daex", name: "Win12_Build.daex" }
        ],
        featured: true
    },
    {
        id: 2,
        title: "Windows 12 Presentation Pack DAE",
        description: "Complete presentation show showcasing Windows 12 editions, launcher designs, and UI concepts",
        category: "Old Daelan's Archives",
        thumbnail: "assets/Win12_Launcher_Preview_Video.mp4",
        isVideoThumbnail: true,
        fileSize: "14.13 MB",
        dateCreated: "2026-09-25",
        downloadLinks: [
            { url: "https://github.com/daecoderlover/Daelan-s-Downloadable-Items/raw/refs/heads/files_for_download/assets/Win12_Build.dae", name: "Win12_Build.dae" }
        ],
        featured: true
    },
    {
        id: 3,
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
        id: 4,
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
        id: 5,
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

function toggleCardVideo(videoEl) {
    if (!videoEl || videoEl.tagName !== 'VIDEO') return;
    const playIcon = videoEl.parentElement.querySelector('.play-icon');
    if (videoEl.paused) {
        videoEl.play();
        if (playIcon) playIcon.style.display = 'none';
    } else {
        videoEl.pause();
        if (playIcon) playIcon.style.display = 'flex';
    }
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

    const thumbHTML = item.thumbnail
        ? (item.isVideoThumbnail
            ? '<video src="' + item.thumbnail + '#t=0.5" muted loop playsinline preload="metadata" style="width:100%; height:100%; object-fit:cover; display:block;" onclick="toggleCardVideo(this)"></video>'
            : '<img src="' + item.thumbnail + '" alt="' + item.title + '" style="width:100%; height:100%; object-fit:cover; display:block;">')
        : '';
    const playHTML = item.isVideoThumbnail
        ? '<div class="play-icon" onclick="event.stopPropagation(); toggleCardVideo(this.parentElement.querySelector(\'video\'))" style="cursor:pointer; pointer-events:auto; z-index:5;"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>'
        : '';
    const countText = safeLinks.length > 1 ? '(' + safeLinks.length + ' files)' : '';
    const unsafeHTML = unsafeLinks.length > 0 ? '<p style="color:#f87171;font-size:11px;margin-top:8px;">⚠️ ' + unsafeLinks.length + ' file blocked for safety</p>' : '';
    return '<div class="item-card ' + (item.featured ? 'featured' : '') + '" data-id="' + item.id + '">' +
        '<div class="card-thumbnail">' + thumbHTML + playHTML +
            '<button class="card-menu" onclick="toggleCardMenu(event, ' + item.id + ')" style="z-index:6; cursor:pointer;">⋯</button>' +
            '<div id="card-menu-' + item.id + '" class="card-dropdown-menu" onclick="event.stopPropagation()" style="display:none; position:absolute; top:44px; right:10px; background:#0F172A; border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:6px; min-width:175px; z-index:20; box-shadow:0 8px 24px rgba(0,0,0,0.6);">' +
                '<button onclick="copyItemLink(' + item.id + ', this)" style="display:flex; align-items:center; gap:8px; width:100%; text-align:left; background:none; border:none; color:#E2E8F0; padding:8px 10px; font-size:13px; border-radius:6px; cursor:pointer;">' +
                    '<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:15px; height:15px; flex-shrink:0;"><path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clip-rule="evenodd" /></svg>' +
                    '<span>Copy Download Link</span>' +
                '</button>' +
                '<button onclick="showItemDetails(' + item.id + ')" style="display:flex; align-items:center; gap:8px; width:100%; text-align:left; background:none; border:none; color:#E2E8F0; padding:8px 10px; font-size:13px; border-radius:6px; cursor:pointer;">' +
                    '<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:15px; height:15px; flex-shrink:0;"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>' +
                    '<span>File Details</span>' +
                '</button>' +
                '<button onclick="handleDownload(' + item.id + ')" style="display:flex; align-items:center; gap:8px; width:100%; text-align:left; background:none; border:none; color:#38BDF8; padding:8px 10px; font-size:13px; border-radius:6px; cursor:pointer;">' +
                    '<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:15px; height:15px; flex-shrink:0;"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>' +
                    '<span>Download File</span>' +
                '</button>' +
            '</div>' +
            '<span class="card-size-badge">' + item.fileSize + '</span>' +
        '</div>' +
        '<div class="card-content">' +
            '<div>' +
                '<div class="badges-row">' + sourceBadge + categoryBadge + '</div>' +
                '<h3 class="card-title">' + item.title + '</h3>' +
                '<p class="card-desc">' + item.description + '</p>' +
            '</div>' +
            '<div>' +
                '<div class="card-meta"><span style="display:inline-flex; align-items:center; gap:5px;"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:14px; height:14px;"><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" /></svg>' + item.dateCreated + '</span></div>' +
                '<div class="card-actions">' +
                    addLocalBtn +
                    '<button class="download-btn" onclick="handleDownload(' + item.id + ')" style="display:inline-flex; align-items:center; justify-content:center; gap:6px;"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:15px; height:15px;"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg><span>Download ' + countText + '</span></button>' +
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

    if (item.thumbnail && !item.isVideoThumbnail) {
        urlsToCache.push(item.thumbnail);
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            const worker = navigator.serviceWorker.controller || registration.active;
            if (worker) {
                worker.postMessage({
                    type: "SAVE_LOCAL_ITEM",
                    id: item.id,
                    urls: urlsToCache
                });
            } else {
                markItemAsLocal(item.id);
            }
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

function toggleCategorySubmenu(event, groupKey) {
    event.stopPropagation();
    const target = document.getElementById('submenu-' + groupKey);
    const arrow = document.getElementById('arrow-' + groupKey);
    if (!target) return;

    const isOpening = target.style.display === 'none';
    document.querySelectorAll('.cat-submenu').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id^="arrow-"]').forEach(el => el.textContent = '▾');

    if (isOpening) {
        target.style.display = 'block';
        if (arrow) arrow.textContent = '▴';
    }
}

(function initCategorySubmenus() {
    const menu = document.getElementById('categories-menu');
    if (!menu) return;
    menu.style.maxHeight = "75vh";
    menu.style.overflowY = "auto";

    const fileTypeGroup = menu.querySelectorAll('.cat-group')[1];
    if (!fileTypeGroup) return;

    let html = '<span class="cat-heading">File Types</span>' +
               '<button onclick="filterByFileType(\'all\')">All File Types</button>';

    Object.keys(CATEGORY_GROUPS).forEach(group => {
        const key = group.toLowerCase();
        html += '<div class="cat-subdropdown">' +
            '<button type="button" onclick="toggleCategorySubmenu(event, \'' + key + '\')" style="display:flex;justify-content:space-between;width:100%;">' +
                '<span>' + group + '</span><span id="arrow-' + key + '">▾</span>' +
            '</button>' +
            '<div id="submenu-' + key + '" class="cat-submenu" style="display:none;padding-left:12px;border-left:2px solid rgba(255,255,255,0.15);margin:4px 0;">';

        CATEGORY_GROUPS[group].forEach((sub, idx) => {
            const label = idx === 0 ? 'All ' + group : sub;
            html += '<button onclick="filterByFileType(\'' + sub.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + '\')">' + label + '</button>';
        });
        html += '</div></div>';
    });

    fileTypeGroup.innerHTML = html;

    const origFilter = applyFiltersAndRender;
    applyFiltersAndRender = function () {
        if (CATEGORY_GROUPS[currentCategoryFilter]) {
            const saved = currentCategoryFilter;
            const list = CATEGORY_GROUPS[saved];
            const origItems = items.map(i => i.category);
            items.forEach(i => { if (list.includes(i.category)) i.category = saved; });
            origFilter();
            items.forEach((i, idx) => i.category = origItems[idx]);
        } else {
            origFilter();
        }
    };
    applyFiltersAndRender();
})();

function toggleCardMenu(event, itemId) {
    event.stopPropagation();
    const target = document.getElementById('card-menu-' + itemId);
    if (!target) return;

    const isOpening = target.style.display === 'none';
    document.querySelectorAll('.card-dropdown-menu').forEach(el => el.style.display = 'none');
    if (isOpening) target.style.display = 'block';
}

document.addEventListener('click', () => {
    document.querySelectorAll('.card-dropdown-menu').forEach(el => el.style.display = 'none');
});

function copyItemLink(itemId, btnEl) {
    const item = items.find(i => i.id === itemId);
    if (!item || !item.downloadLinks.length) return;

    const url = item.downloadLinks[0].url;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
    }
    const labelSpan = btnEl.querySelector('span') || btnEl;
    const origText = labelSpan.innerText;
    labelSpan.innerText = 'Link Copied!';
    setTimeout(() => {
        labelSpan.innerText = origText;
        document.querySelectorAll('.card-dropdown-menu').forEach(el => el.style.display = 'none');
    }, 900);
}

function showItemDetails(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    document.querySelectorAll('.card-dropdown-menu').forEach(el => el.style.display = 'none');

    let modal = document.getElementById('file-details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'file-details-modal';
        modal.onclick = function() { modal.style.display = 'none'; };
        modal.style.cssText = 'display:none; position:fixed; inset:0; background:rgba(2,6,23,0.82); backdrop-filter:blur(6px); z-index:9999; align-items:center; justify-content:center; padding:16px;';
        modal.innerHTML =
            '<div onclick="event.stopPropagation()" style="background:#0F172A; border:1px solid rgba(255,255,255,0.14); border-radius:16px; width:100%; max-width:380px; padding:20px; text-align:left; box-shadow:0 20px 40px rgba(0,0,0,0.65);">' +
              '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px;">' +
                '<div style="display:flex; align-items:center; gap:8px;">' +
                  '<span style="display:inline-flex; width:18px; height:18px; color:#38BDF8; flex-shrink:0;">' +
                    '<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>' +
                  '</span>' +
                  '<h3 id="fd-title" style="margin:0; font-size:16px; color:#F8FAFC;">File Details</h3>' +
                '</div>' +
                '<button type="button" onclick="document.getElementById(\'file-details-modal\').style.display=\'none\'" style="background:none; border:none; color:#94A3B8; font-size:18px; cursor:pointer;">✕</button>' +
              '</div>' +
              '<div style="display:flex; flex-direction:column; gap:10px; font-size:13px; color:#CBD5E1;">' +
                '<div style="display:flex; align-items:center; gap:10px; background:#1E293B; padding:10px 12px; border-radius:10px;">' +
                  '<span style="display:inline-flex; width:17px; height:17px; color:#A78BFA; flex-shrink:0;"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg></span>' +
                  '<div><span style="color:#94A3B8; font-size:11px; display:block;">Category</span><strong id="fd-category" style="color:#F8FAFC;"></strong></div>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:10px; background:#1E293B; padding:10px 12px; border-radius:10px;">' +
                  '<span style="display:inline-flex; width:17px; height:17px; color:#38BDF8; flex-shrink:0;"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg></span>' +
                  '<div style="word-break:break-all;"><span style="color:#94A3B8; font-size:11px; display:block;">File</span><strong id="fd-files" style="color:#F8FAFC;"></strong></div>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:10px; background:#1E293B; padding:10px 12px; border-radius:10px;">' +
                  '<span style="display:inline-flex; width:17px; height:17px; color:#34D399; flex-shrink:0;"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" /><path fill-rule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" /></svg></span>' +
                  '<div><span style="color:#94A3B8; font-size:11px; display:block;">Size</span><strong id="fd-size" style="color:#F8FAFC;"></strong></div>' +
                '</div>' +
                '<div style="display:flex; align-items:center; gap:10px; background:#1E293B; padding:10px 12px; border-radius:10px;">' +
                  '<span style="display:inline-flex; width:17px; height:17px; color:#FBBF24; flex-shrink:0;"><svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:100%; height:100%;"><path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" /></svg></span>' +
                  '<div><span style="color:#94A3B8; font-size:11px; display:block;">Created</span><strong id="fd-date" style="color:#F8FAFC;"></strong></div>' +
                '</div>' +
              '</div>' +
              '<button id="fd-download-btn" type="button" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; margin-top:16px; padding:11px 16px; font-size:14px; font-weight:600; color:#FFFFFF; background:#2563EB; border:none; border-radius:10px; cursor:pointer;">' +
                '<svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="currentColor" style="width:16px; height:16px;"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg>' +
                '<span>Download Now</span>' +
              '</button>' +
            '</div>';
        document.body.appendChild(modal);
    }

    const files = item.downloadLinks.map(l => l.name).join(', ');
    document.getElementById('fd-title').textContent = item.title;
    document.getElementById('fd-category').textContent = item.category;
    document.getElementById('fd-files').textContent = files;
    document.getElementById('fd-size').textContent = item.fileSize;
    document.getElementById('fd-date').textContent = item.dateCreated;

    document.getElementById('fd-download-btn').onclick = function() {
        modal.style.display = 'none';
        handleDownload(item.id);
    };

    modal.style.display = 'flex';
}
