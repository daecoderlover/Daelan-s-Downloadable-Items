window.handleDownload = function(itemId) {
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

    window.location.href = `download.html?id=${item.id}`;
};
