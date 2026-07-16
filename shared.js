// shared.js - Asynchronous Dynamic Router Engine
(function() {
    const head = document.head;

    // 1. Inject Styles & CDNs
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    head.appendChild(tailwindScript);

    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    head.appendChild(fontAwesomeLink);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        #app { opacity: 0; transition: opacity 120ms ease-in-out; }
        #app.visible { opacity: 1; }
    `;
    head.appendChild(styleTag);

    tailwindScript.onload = function() {
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        aviationRed: '#E11D48',
                        aviationDark: '#0F172A',
                        aviationCard: '#1E293B',
                        aviationBorder: '#334155'
                    }
                }
            }
        };
    };

    // 2. Main Page Render and Routing
    document.addEventListener("DOMContentLoaded", function() {
        
        // Static Header Injection
        const navHTML = `
        <nav class="bg-slate-950 text-white shadow-md border-b-4 border-aviationRed">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <a href="#/" class="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                        <i class="fa-solid fa-plane text-aviationRed text-2xl transform -rotate-45"></i>
                        <span class="text-2xl font-black tracking-wider text-white">B<span class="text-aviationRed">ONAIR</span></span>
                    </a>
                    <div class="flex items-center space-x-4">
                        <div class="text-right hidden md:block">
                            <p class="text-sm font-semibold text-slate-200">Bertie Beaver</p>
                            <p class="text-xs text-slate-400">Flight Crew</p>
                        </div>
                        <div class="h-9 w-9 rounded-full bg-aviationRed flex items-center justify-center font-bold text-white shadow-md">B</div>
                    </div>
                </div>
            </div>
        </nav>`;
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // Static Footer Injection
        const footerHTML = `
        <footer class="bg-slate-950 text-slate-500 text-xs py-4 border-t border-slate-900 mt-auto">
            <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>&copy; 2026 Bonair Flight Systems Prototyping. Internal Simulation Only.</div>
                <div class="flex items-center space-x-2">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400">v1.6.0-async</span>
                </div>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        const app = document.getElementById('app');

        // The Engine: Maps the browser hash directly to our external views folder
        async function handleRoute() {
            const rawHash = window.location.hash || '#/';
            app.classList.remove('visible'); // Fade out old content

            // Map URL hashes cleanly to our separate views/ folder paths
            // By prepending a dot and a slash, we force the browser to read relative to your folder root
let targetViewFile = './views/dashboard.html';

if (rawHash === '#/safety') {
    targetViewFile = './views/safety.html';
} else if (rawHash === '#/safety/create') {
    targetViewFile = './views/safety-create.html';
} else if (rawHash !== '#/' && rawHash !== '') {
    targetViewFile = './views/404.html'; 
}

            // Fetch the fragment text over the network and drop it in the app container
            setTimeout(async () => {
                try {
                    const response = await fetch(targetViewFile);
                    if (!response.ok) throw new Error('Template file not found');
                    app.innerHTML = await response.text();
                } catch (err) {
                    app.innerHTML = `
                        <div class="text-center py-12">
                            <i class="fa-solid fa-triangle-exclamation text-aviationRed text-5xl mb-4"></i>
                            <h2 class="text-2xl font-bold text-white">Module Under Construction</h2>
                            <p class="text-slate-400 mt-2">The layout for <strong>${targetViewFile}</strong> hasn't been added to your views folder yet.</p>
                            <a href="#/" class="mt-4 inline-block bg-aviationRed text-white px-4 py-2 rounded font-semibold text-sm">Back to Dashboard</a>
                        </div>
                    `;
                }
                app.classList.add('visible'); // Fade in new content
            }, 120);
        }

        window.addEventListener('hashchange', handleRoute);
        handleRoute(); // Boot page view
    });
})();
