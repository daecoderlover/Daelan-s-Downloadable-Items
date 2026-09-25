// === DAELAN'S DOWNLOADABLE WEBSITE — JAVASCRIPT ===
// File safety rules — blocks dangerous extensions
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.vbs', '.js', '.jse', '.wsf', 
                            '.msi', '.reg', '.com', '.scr', '.hta', '.cpl', '.jar', '.app'];

// Your downloadable items — add yours here!
const items = [
    {
        id: 1,
        title: "Windows 12 Presentation Pack",
        description: "Complete presentation show showcasing Windows 12 editions, launcher designs, and UI concepts",
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
        thumbnail: "assets/sample-1.jpg", // Name your image to sample-1.jpg when in assets folder or change the sample-1.jpg in file path to your name and extension (eg. "assets/myimage.png")
        isVideoThumbnail: false,
        fileSize: "8.2 MB",
        dateCreated: "2026-09-24",
        downloadLinks: [
            { url: "assets/sample-1.jpg", name: "assets/sample-1.jpg" }
        ],
        featured: false
    },
    {
        id: 3,
        title: "Video Preview",
        description: "Video showcase of upcoming content from Daelan's studio", 
        thumbnail: "assets/video-showcase.mp4", // Name your image to video-showcase.mp4 when in assets folder or change the video-showcase.mp4 in file path to your name and extension (eg. "assets/myvideo.mp4")
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
        thumbnail: null,
        isVideoThumbnail: false,
        fileSize: "45.1 MB",
        dateCreated: "2026-09-23",
        downloadLinks: [
            { url: "assets/The reason behind my Free Product Key of MC Office 360, 2016 (PPXT PDF).pdf", name: "The reason behind my Free Product Key of MC Office 360, 2016 (PPXT PDF)" }
        ],
        featured: false
    }
    // Copy id 4 above and edit the content like file paths, thumbnail paths...
    
];

// === SAFETY CHECK — Block dangerous files ===
function isFileSafe(filename) {
    const lower = filename.toLowerCase();
    return !BLOCKED_EXTENSIONS.some(ext => lower.endsWith(ext));
}

// === CREATE CARD HTML ===
function createItemCard(item) {
    const safeLinks = item.downloadLinks.filter(link => isFileSafe(link.name));
    const unsafeLinks = item.downloadLinks.filter(link => !isFileSafe(link.name));

    const linksHTML = safeLinks.map(link => 
        `<a href="${link.url}" download="${link.name}" class="download-link">⬇ ${link.name}</a>`
    ).join('');

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
                <h3 class="card-title">${item.title}</h3>
                <p class="card-desc">${item.description}</p>
                <div class="card-meta">
                    <span>📅 ${item.dateCreated}</span>
                </div>
                <button class="download-btn" data-item-id="${item.id}">
                    ⬇ Download ${safeLinks.length > 1 ? `(${safeLinks.length} files)` : ''}
                </button>
                ${unsafeLinks.length > 0 
                    ? `<p style="color:#f87171;font-size:11px;margin-top:8px;">⚠️ ${unsafeLinks.length} file blocked for safety</p>` 
                    : ''}
            </div>
        </div>
    `;
}

// === RENDER ALL ITEMS ===
function renderItems(itemsToRender) {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = itemsToRender.map(item => createItemCard(item)).join('');
    
    // Attach download handlers
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.itemId);
            const item = items.find(i => i.id === id);
            if (!item) return;
            
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
        });
    });
}

// === SEARCH FILTER ===
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        renderItems(items);
        return;
    }
    const filtered = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
    renderItems(filtered);
});

// === INITIALIZE ===
renderItems(items);
console.log("✅ Daelan's Downloadable Website loaded!");
console.log("🛡️ Safety active — script/program files blocked");
// that is all in the Javascript code, enjoy the website!