const app = {
    content: document.getElementById('markdown-content'),
    menu: document.getElementById('menu'),
    themeBtn: document.getElementById('theme-toggle'),

    init() {
        this.bindEvents();
        this.loadNav();
        this.router();
        document.getElementById('year').innerText = new Date().getFullYear();
    },

    bindEvents() {
        // Theme Toggle Logic
        this.themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // Watch for Hash changes (Routing)
        window.addEventListener('hashchange', () => this.router());
    },

    async router() {
        const page = window.location.hash.slice(1) || 'home';
        this.loadMarkdown(page);
    },

    async loadNav() {
        try {
            const res = await fetch('nav.md');
            const md = await res.text();
            // Parse: "Name | Link" format
            this.menu.innerHTML = md.split('\n')
                .filter(l => l.trim())
                .map(line => {
                    const [name, link] = line.split('|').map(s => s.trim());
                    return `<li><a href="#${link}">${name}</a></li>`;
                }).join('');
        } catch (e) { console.error("Nav failed to load"); }
    },

    async loadMarkdown(page) {
        this.content.style.opacity = '0.5'; // Visual feedback for loading
        try {
            const res = await fetch(`pages/${page}.md`);
            if (!res.ok) throw new Error();
            const md = await res.text();
            
            // Render with Marked.js
            this.content.innerHTML = marked.parse(md);
            window.scrollTo(0, 0);
        } catch (e) {
            this.content.innerHTML = `<h1>404</h1><p>The workspace "${page}" doesn't exist.</p>`;
        }
        this.content.style.opacity = '1';
    }
};

app.init();
