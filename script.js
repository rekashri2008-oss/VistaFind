const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("image-search");
const results = document.getElementById("results");
const resultCount = document.getElementById("result-count");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    // Ignore blank searches
    if (!query) {
        return;
    }

    // Clear previous results
    results.innerHTML = "";

    const url =
        `https://commons.wikimedia.org/w/api.php` +
        `?action=query` +
        `&generator=search` +
        `&gsrsearch=${encodeURIComponent(query)}` +
        `&gsrnamespace=6` +
        `&gsrlimit=12` +
        `&prop=imageinfo` +
        `&iiprop=url` +
        `&iiurlwidth=500` +
        `&format=json` +
        `&origin=*`;

    const response = await fetch(url);

    if (!response.ok) {
        return;
    }

    const data = await response.json();

    const pages = data.query?.pages || {};
    const items = Object.values(pages);

    resultCount.textContent = `Showing ${items.length} results for "${query}"`;

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "image-card";

        const image = document.createElement("img");
        image.src = item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url;
        image.alt = item.title.replace("File:", "");
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = item.title.replace("File:", "");

        card.appendChild(image);
        card.appendChild(title);

        results.appendChild(card);
    });
});