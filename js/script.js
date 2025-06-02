document.addEventListener("DOMContentLoaded", function() {
    const loadHTML = (elementId, filePath) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${filePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                } else {
                    console.warn(`Element with ID '${elementId}' not found on page ${window.location.pathname}. HTML will not be loaded into it.`);
                }
            })
            .catch(error => console.error(`Error loading HTML into #${elementId} from ${filePath}:`, error));
    };

    // Load partials
    Promise.all([
        loadHTML("header-placeholder", "partials/header.html"),
        loadHTML("sidebar-placeholder", "partials/sidebar.html"),
        loadHTML("footer-placeholder", "partials/footer.html")
    ]).then(() => {
        // Active link highlighting after sidebar is loaded
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");

        let activeLinkFound = false;
        sidebarLinks.forEach(link => {
            let linkPage = link.getAttribute("href").split("/").pop() || "index.html";

            let currentNormalized = currentPage;
            if (currentPage === "index.html" || currentPage === "") currentNormalized = "announcements";
            else currentNormalized = currentPage.replace('.html', '');

            let linkDataPage = link.dataset.page;

            if (linkDataPage === currentNormalized) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
                activeLinkFound = true;
            } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        });

        // Fallback for index.html if it's not explicitly data-page="announcements"
        // but "announcements" link points to index.html
        if (!activeLinkFound && (currentPage === "index.html" || currentPage === "")) {
            sidebarLinks.forEach(link => {
                if (link.dataset.page === "announcements" && (link.getAttribute("href") === "index.html" || link.getAttribute("href") === "./")) {
                    link.classList.add("active");
                    link.setAttribute("aria-current", "page");
                }
            });
        }

    }).catch(error => {
        console.error("Error during Promise.all for loading partials:", error);
    });
});