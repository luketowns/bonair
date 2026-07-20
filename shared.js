// shared.js - Master Centralized SPA Router (v1.6.6-script-eval-fixed)
(function () {
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

    tailwindScript.onload = function () {
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

    // Helper to evaluate scripts inside dynamically loaded HTML fragments
    function executeScriptsInside(container) {
        if (!container) return;
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // Copy across any defined attributes (like src, type)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // Inject and execute inline code
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }

    // 2. Main Page Render and Routing
    document.addEventListener("DOMContentLoaded", function () {

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
                    <span class="font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400">v1.6.6-script-eval-fixed</span>
                </div>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        const app = document.getElementById('app');

        // Handles rendering inner views inside Safety layout
        async function handleSafetySubRoutes() {
            const pane = document.getElementById('safety-detail-pane');
            if (!pane) return;

            const rawHash = window.location.hash || '#/safety';

            // Reset tab styling
            document.querySelectorAll('[id^="nav-safety-"]').forEach(el => {
                el.classList.remove('border-aviationRed', 'bg-slate-900/80');
                el.classList.add('border-aviationBorder', 'bg-slate-900');
            });

            let targetFragment = '';
            let activeTabId = '';

            if (rawHash === '#/safety/create') {
                targetFragment = './views/safety-create.html';
                activeTabId = 'nav-safety-create';
            } else if (rawHash === '#/safety/view') {
                targetFragment = './views/safety-view.html';
                activeTabId = 'nav-safety-view';
            } else if (rawHash === '#/safety/memos') {
                targetFragment = './views/safety-memos.html';
                activeTabId = 'nav-safety-memos';
            }

            if (targetFragment) {
                const activeTab = document.getElementById(activeTabId);
                if (activeTab) {
                    activeTab.classList.add('border-aviationRed', 'bg-slate-900/80');
                    activeTab.classList.remove('border-aviationBorder', 'bg-slate-900');
                }

                try {
                    const response = await fetch(targetFragment);
                    if (!response.ok) throw new Error();

                    pane.innerHTML = await response.text();

                    // Critical: Manually execute inline scripts after loading
                    executeScriptsInside(pane);

                    // Auto-load date if input is present
                    const dateInput = document.getElementById('eventDate');
                    if (dateInput) dateInput.valueAsDate = new Date();
                } catch (err) {
                    pane.innerHTML = `<div class="p-8 text-center text-red-400">Failed to load sub-module content.</div>`;
                }
            } else {
                pane.innerHTML = `
                    <div class="bg-aviationCard/30 border border-dashed border-aviationBorder rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[450px]">
                        <div class="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center border border-aviationBorder mb-4 shadow-inner">
                            <i class="fa-solid fa-arrow-pointer text-slate-500 text-xl animate-bounce"></i>
                        </div>
                        <h3 class="text-lg font-bold text-slate-300">No Module Selected</h3>
                        <p class="text-sm text-slate-500 mt-1.5 max-w-sm">Select a safety framework module from the panel on the left to display its interactive layout.</p>
                    </div>`;
            }
        }

        // Parent routing engine
        // Parent routing engine
        async function handleRoute() {
            const rawHash = window.location.hash || '#/';
            const onSafetyPage = rawHash.startsWith('#/safety');
            const onTimesheetsPage = rawHash.startsWith('#/timesheets'); // 1. Check for timesheets route

            // If we are navigating to safety, check if the base shell is already present
            const safetyShellExists = document.getElementById('safety-detail-pane') !== null;

            if (onSafetyPage && safetyShellExists) {
                // The parent layout is already loaded! Just update the inside panel.
                await handleSafetySubRoutes();
            } else {
                // Otherwise, perform a full page fade-out transition
                app.classList.remove('visible');

                let targetViewFile = './views/dashboard.html';

                if (onSafetyPage) {
                    targetViewFile = './views/safety.html';
                } else if (onTimesheetsPage) {
                    targetViewFile = './views/timesheets.html'; // 2. Map route to the timesheets file
                } else if (rawHash !== '#/' && rawHash !== '') {
                    targetViewFile = './views/404.html';
                }

                setTimeout(async () => {
                    try {
                        const response = await fetch(targetViewFile);
                        if (!response.ok) throw new Error('Template file not found');

                        app.innerHTML = await response.text();

                        // Execute scripts inside main app viewport
                        executeScriptsInside(app);

                        // If safety was loaded, wait a frame then resolve nested panel
                        if (onSafetyPage) {
                            await handleSafetySubRoutes();
                        }
                    } catch (err) {
                        app.innerHTML = `
                            <div class="text-center py-12">
                                <i class="fa-solid fa-triangle-exclamation text-aviationRed text-5xl mb-4"></i>
                                <h2 class="text-2xl font-bold text-white">Module Under Construction</h2>
                                <p class="text-slate-400 mt-2">The layout file has not been deployed yet.</p>
                                <a href="#/" class="mt-4 inline-block bg-aviationRed text-white px-4 py-2 rounded font-semibold text-sm">Back to Dashboard</a>
                            </div>`;
                    }
                    app.classList.add('visible');
                }, 120);
            }
        }

        window.addEventListener('hashchange', handleRoute);
        handleRoute(); // Boot page view
    });
})();