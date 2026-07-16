// shared.js - Consolidated layout engine with page transition handling
(function() {
    const head = document.head;

    // 1. Inject Tailwind & FontAwesome directly into the <head>
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    head.appendChild(tailwindScript);

    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    head.appendChild(fontAwesomeLink);

    // 2. Inject seamless page transition CSS rules
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        /* Start hidden for the entry transition */
        body {
            opacity: 0;
            transition: opacity 180ms ease-out;
        }
        /* Fade in class when page loads */
        body.page-loaded {
            opacity: 1;
        }
        /* Fade out transition class when navigating away */
        body.page-exit {
            opacity: 0 !important;
            transition: opacity 120ms ease-in;
        }
    `;
    head.appendChild(styleTag);

    // Configure Tailwind Theme Colors on Load
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

    // 3. Inject Navigation, Footer, and handle transition classes
    document.addEventListener("DOMContentLoaded", function() {
        
        // --- NAVIGATION INJECTION ---
        const navHTML = `
        <nav class="bg-slate-950 text-white shadow-md border-b-4 border-aviationRed">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <a href="index.html" class="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                        <i class="fa-solid fa-plane text-aviationRed text-2xl transform -rotate-45"></i>
                        <span class="text-2xl font-black tracking-wider text-white">B<span class="text-aviationRed">ONAIR</span></span>
                    </a>
                    <div class="flex items-center space-x-4">
                        <div class="text-right hidden md:block">
                            <p class="text-sm font-semibold text-slate-200">Bertie Beaver</p>
                            <p class="text-xs text-slate-400">Flight Crew</p>
                        </div>
                        <div class="h-9 w-9 rounded-full bg-aviationRed flex items-center justify-center font-bold text-white shadow-md">
                            B
                        </div>
                    </div>
                </div>
            </div>
        </nav>`;
        
        document.body.className = "bg-aviationDark text-slate-200 font-sans min-h-screen flex flex-col";
        document.body.insertAdjacentHTML('afterbegin', navHTML);

        // --- FOOTER INJECTION ---
        const footerHTML = `
        <footer class="bg-slate-950 text-slate-500 text-xs py-4 border-t border-slate-900 mt-auto">
            <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div>
                    &copy; 2026 Bonair Flight Systems Prototyping. Internal Simulation Only.
                </div>
                <div class="flex items-center space-x-2">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-400">v1.4.1-build</span>
                </div>
            </div>
        </footer>`;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        // Trigger the entry fade-in
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 30);

        // --- INTERCEPT CLICKS FOR SEAMLESS TRANSITION ---
        document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a');
            
            // Only intercept normal local internal links
            if (anchor && anchor.href && anchor.getAttribute('href').endsWith('.html')) {
                const targetUrl = anchor.getAttribute('href');
                
                // Prevent immediate jump
                e.preventDefault();
                
                // Fade out current page first
                document.body.classList.remove('page-loaded');
                document.body.classList.add('page-exit');
                
                // Travel to next page once completely faded out
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 120);
            }
        });
    });
})();
