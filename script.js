const contentDiv = document.getElementById('content');
const navLinksUl = document.getElementById('nav-links');

// 1. Function to fetch and render Markdown
async function loadPage(pageName) {
    const fileName = `pages/${pageName}.md`;
    contentDiv.innerHTML = '<div class="loader">Loading...</div>';

    try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error('Page not found');
        const markdown = await response.text();
        contentDiv.innerHTML = marked.parse(markdown);
    } catch (error) {
        contentDiv.innerHTML = `<h1>404</h1><p>The page "${pageName}" could not be found.</p>`;
    }
}

// 2. Function to load Navigation from nav.md
async function loadNav() {
    try {
        const response = await fetch('nav.md');
        const markdown = await response.text();
        // Custom parser for simple list-based nav
        const lines = markdown.split('\n').filter(line => line.trim() !== '');
        
        navLinksUl.innerHTML = lines.map(line => {
            const [name, link] = line.split('|').map(s => s.trim());
            return `<li><a href="#${link}">${name}</a></li>`;
        }).join('');
    } catch (err) {
        console.error("Could not load navigation", err);
    }
}

// 3. Router: logic to handle page changes
function router() {
    const hash = window.location.hash.substring(1) || 'home';
    loadPage(hash);
}

// Initialize
window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    loadNav();
    router();
});
