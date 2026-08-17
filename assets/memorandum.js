(function () {
    const entries = window.memorandumEntries || [];
    const state = {
        selectedId: entries[0] ? entries[0].id : null,
        query: "",
        category: "all"
    };

    const categoryLabels = {
        all: "All",
        games: "Games",
        tech: "Tech",
        science: "Science",
        language: "Language",
        nature: "Nature"
    };

    const categoryColors = {
        games: "#ffb35c",
        tech: "#59d2ff",
        science: "#8ef0bd",
        language: "#d6a6ff",
        nature: "#ffd7a8"
    };

    const sky = document.querySelector("[data-sky]");
    const connections = document.querySelector("[data-connections]");
    const detail = document.querySelector("[data-detail]");
    const filterBar = document.querySelector("[data-filters]");
    const searchInput = document.querySelector("[data-search]");
    const randomButton = document.querySelector("[data-random]");
    const countLabel = document.querySelector("[data-count]");

    function matchesEntry(entry) {
        const text = `${entry.question} ${entry.answer} ${entry.category}`.toLowerCase();
        const matchesQuery = !state.query || text.includes(state.query);
        const matchesCategory = state.category === "all" || entry.category === state.category;
        return matchesQuery && matchesCategory;
    }

    function filteredEntries() {
        return entries.filter(matchesEntry);
    }

    function entryById(id) {
        return entries.find((entry) => entry.id === id);
    }

    function lineKey(a, b) {
        return [a, b].sort().join("--");
    }

    function renderFilters() {
        const categories = ["all"].concat(Array.from(new Set(entries.map((entry) => entry.category))));
        filterBar.innerHTML = categories.map((category) => {
            const active = state.category === category ? "is-active" : "";
            return `<button class="memo-filter ${active}" type="button" data-category="${category}">${categoryLabels[category] || category}</button>`;
        }).join("");

        filterBar.querySelectorAll("button").forEach((button) => {
            button.addEventListener("click", () => {
                state.category = button.dataset.category;
                const visible = filteredEntries();
                if (!visible.some((entry) => entry.id === state.selectedId)) {
                    state.selectedId = visible[0] ? visible[0].id : null;
                }
                render();
            });
        });
    }

    function renderLines(visibleIds) {
        const rendered = new Set();
        const lines = [];

        entries.forEach((entry) => {
            if (!visibleIds.has(entry.id)) return;

            entry.related.forEach((relatedId) => {
                const related = entryById(relatedId);
                if (!related || !visibleIds.has(related.id)) return;

                const key = lineKey(entry.id, related.id);
                if (rendered.has(key)) return;
                rendered.add(key);

                const active = entry.id === state.selectedId || related.id === state.selectedId ? " is-active" : "";
                lines.push(`<line class="memo-line${active}" x1="${entry.x}%" y1="${entry.y}%" x2="${related.x}%" y2="${related.y}%" />`);
            });
        });

        connections.innerHTML = lines.join("");
    }

    function renderStars(visible) {
        const html = visible.map((entry) => {
            const selected = entry.id === state.selectedId ? " is-selected" : "";
            const related = entry.related.includes(state.selectedId) ? " is-related" : "";
            const color = categoryColors[entry.category] || "#ffffff";
            return `
                <button
                    class="memo-star${selected}${related}"
                    type="button"
                    data-id="${entry.id}"
                    style="left:${entry.x}%; top:${entry.y}%; --star-color:${color};"
                    aria-label="${entry.question}">
                    <span class="memo-star-core"></span>
                    <span class="memo-star-label">${entry.question}</span>
                </button>
            `;
        }).join("");

        sky.querySelectorAll(".memo-star").forEach((star) => star.remove());
        sky.insertAdjacentHTML("beforeend", html);

        sky.querySelectorAll(".memo-star").forEach((star) => {
            star.addEventListener("click", () => {
                state.selectedId = star.dataset.id;
                render();
            });
        });
    }

    function renderDetail() {
        const selected = entryById(state.selectedId);
        if (!selected) {
            detail.innerHTML = `
                <p class="memo-empty">No notes match this view yet.</p>
            `;
            return;
        }

        const related = selected.related
            .map(entryById)
            .filter(Boolean)
            .map((entry) => `<button type="button" data-related="${entry.id}">${entry.question}</button>`)
            .join("");

        detail.innerHTML = `
            <div class="memo-detail-kicker">${categoryLabels[selected.category] || selected.category} / ${selected.date}</div>
            <h2>${selected.question}</h2>
            <p>${selected.answer}</p>
            <div class="memo-source">Source: ${selected.source}</div>
            <div class="memo-related">
                ${related ? `<h3>Nearby notes</h3>${related}` : ""}
            </div>
        `;

        detail.querySelectorAll("[data-related]").forEach((button) => {
            button.addEventListener("click", () => {
                state.selectedId = button.dataset.related;
                render();
            });
        });
    }

    function renderCount(visible) {
        const note = visible.length === 1 ? "note" : "notes";
        countLabel.textContent = `${visible.length} ${note}`;
    }

    function render() {
        const visible = filteredEntries();
        const visibleIds = new Set(visible.map((entry) => entry.id));

        renderFilters();
        renderLines(visibleIds);
        renderStars(visible);
        renderDetail();
        renderCount(visible);
    }

    searchInput.addEventListener("input", (event) => {
        state.query = event.target.value.trim().toLowerCase();
        const visible = filteredEntries();
        if (!visible.some((entry) => entry.id === state.selectedId)) {
            state.selectedId = visible[0] ? visible[0].id : null;
        }
        render();
    });

    randomButton.addEventListener("click", () => {
        const visible = filteredEntries();
        if (!visible.length) return;
        const next = visible[Math.floor(Math.random() * visible.length)];
        state.selectedId = next.id;
        render();
    });

    render();
}());
