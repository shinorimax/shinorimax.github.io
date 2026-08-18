(function () {
    let entries = window.memorandumEntries || [];
    const state = {
        selectedId: entries[0] ? entries[0].id : null,
        query: "",
        category: "all",
        language: "en"
    };

    const copy = {
        en: {
            all: "All",
            games: "Games",
            tech: "Tech",
            science: "Science",
            language: "Language",
            nature: "Nature",
            heroTitle: "Memorandum Constellation",
            heroDescription: "A living map of small questions, everyday trivia, and useful fragments I want to remember.",
            controlsLabel: "Memorandum controls",
            searchPlaceholder: "Search questions, answers, topics",
            randomNote: "Random note",
            languageToggle: "日本語",
            source: "Source",
            nearbyNotes: "Nearby notes",
            lookUp: "Look up on web",
            noMatches: "No notes match this view yet.",
            note: "note",
            notes: "notes",
            sharedTerms: "Shared terms"
        },
        ja: {
            all: "すべて",
            games: "ゲーム",
            tech: "技術",
            science: "科学",
            language: "言語",
            nature: "自然",
            heroTitle: "Memorandum Constellation",
            heroDescription: "小さな疑問、日常の豆知識、覚えておきたい断片をつなぐ生きた地図。",
            controlsLabel: "メモランダムの操作",
            searchPlaceholder: "質問、回答、トピックを検索",
            randomNote: "ランダム表示",
            languageToggle: "English",
            source: "出典",
            nearbyNotes: "近くのノート",
            lookUp: "ウェブで調べる",
            noMatches: "この表示に一致するノートはありません。",
            note: "件",
            notes: "件",
            sharedTerms: "共通語"
        }
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
    const languageToggle = document.querySelector("[data-language-toggle]");
    const stopWords = new Set([
        "a", "about", "after", "again", "all", "also", "am", "an", "and", "any", "are", "as", "at",
        "be", "because", "been", "being", "between", "but", "by", "can", "could", "did", "do", "does",
        "doing", "down", "each", "for", "from", "had", "has", "have", "having", "he", "her", "here",
        "hers", "him", "his", "how", "i", "if", "in", "into", "is", "it", "its", "like", "may", "me",
        "more", "most", "my", "near", "not", "of", "on", "one", "or", "other", "our", "out", "over",
        "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "them",
        "then", "there", "these", "they", "this", "through", "to", "too", "under", "up", "use", "used",
        "uses", "using", "very", "was", "way", "we", "were", "what", "when", "where", "which", "while",
        "who", "why", "will", "with", "within", "would", "you", "your"
    ]);

    function matchesEntry(entry) {
        const text = [
            entry.question,
            entry.answer,
            entry.questionJa,
            entry.answerJa,
            entry.category,
            label(entry.category)
        ].join(" ").toLowerCase();
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

    function label(key) {
        return copy[state.language][key] || copy.en[key] || key;
    }

    function questionFor(entry) {
        return state.language === "ja" && entry.questionJa ? entry.questionJa : entry.question;
    }

    function answerFor(entry) {
        return state.language === "ja" && entry.answerJa ? entry.answerJa : entry.answer;
    }

    function updateStaticText() {
        document.documentElement.lang = state.language === "ja" ? "ja" : "en";
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            element.textContent = label(element.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
            element.setAttribute("aria-label", label(element.dataset.i18nAria));
        });
        searchInput.placeholder = label("searchPlaceholder");
        languageToggle.textContent = label("languageToggle");
        languageToggle.setAttribute("aria-pressed", String(state.language === "ja"));
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function seededUnit(id, salt) {
        let hash = 2166136261;
        const text = `${id}:${salt}`;
        for (let index = 0; index < text.length; index += 1) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0) / 4294967295;
    }

    function normalizeToken(token) {
        return token
            .replace(/'s$/, "")
            .replace(/(?:ing|edly|edly|ed|es|s)$/, "");
    }

    function tokenize(entry) {
        return `${entry.question} ${entry.answer}`
            .toLowerCase()
            .replace(/tf-idf/g, "tfidf")
            .replace(/directx/g, "directx")
            .match(/[a-z0-9]+/g)
            ?.map(normalizeToken)
            .filter((token) => token.length > 2 && !stopWords.has(token)) || [];
    }

    function cosineSimilarity(a, b) {
        let dot = 0;
        let aNorm = 0;
        let bNorm = 0;
        Object.keys(a).forEach((term) => {
            aNorm += a[term] * a[term];
            if (b[term]) dot += a[term] * b[term];
        });
        Object.keys(b).forEach((term) => {
            bNorm += b[term] * b[term];
        });
        if (!aNorm || !bNorm) return 0;
        return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
    }

    function analyzeEntries(sourceEntries) {
        const docs = sourceEntries.map((entry) => {
            const tokens = tokenize(entry);
            const counts = tokens.reduce((accumulator, token) => {
                accumulator[token] = (accumulator[token] || 0) + 1;
                return accumulator;
            }, {});
            return {
                entry,
                counts,
                unique: new Set(Object.keys(counts)),
                vector: {}
            };
        });
        const documentFrequency = {};
        docs.forEach((doc) => {
            doc.unique.forEach((term) => {
                documentFrequency[term] = (documentFrequency[term] || 0) + 1;
            });
        });
        const idf = {};
        Object.keys(documentFrequency).forEach((term) => {
            idf[term] = Math.log((sourceEntries.length + 1) / (documentFrequency[term] + 1)) + 1;
        });
        docs.forEach((doc) => {
            const maxCount = Math.max(...Object.values(doc.counts), 1);
            Object.keys(doc.counts).forEach((term) => {
                doc.vector[term] = (doc.counts[term] / maxCount) * idf[term];
            });
        });
        return { docs, idf };
    }

    function buildSimilarityPairs(docs, idf) {
        const pairs = [];
        for (let i = 0; i < docs.length; i += 1) {
            for (let j = i + 1; j < docs.length; j += 1) {
                const a = docs[i];
                const b = docs[j];
                const sharedTerms = [...a.unique]
                    .filter((term) => b.unique.has(term) && idf[term] >= 1.25)
                    .sort((left, right) => idf[right] - idf[left] || left.localeCompare(right))
                    .slice(0, 5);
                const sharedScore = sharedTerms.reduce((total, term) => total + idf[term], 0);
                const similarity = cosineSimilarity(a.vector, b.vector);
                pairs.push({
                    a: a.entry.id,
                    b: b.entry.id,
                    similarity,
                    sharedTerms,
                    edgeScore: similarity + sharedScore * 0.04
                });
            }
        }
        return pairs;
    }

    function assignRelatedFromText(sourceEntries, pairs) {
        const byEntry = {};
        sourceEntries.forEach((entry) => {
            byEntry[entry.id] = [];
            entry.related = [];
            entry.sharedTerms = {};
        });
        pairs
            .filter((pair) => pair.sharedTerms.length && pair.edgeScore >= 0.14)
            .sort((left, right) => right.edgeScore - left.edgeScore)
            .forEach((pair) => {
                if (byEntry[pair.a].length >= 3 || byEntry[pair.b].length >= 3) return;
                byEntry[pair.a].push(pair.b);
                byEntry[pair.b].push(pair.a);
                entryById(pair.a).sharedTerms[pair.b] = pair.sharedTerms;
                entryById(pair.b).sharedTerms[pair.a] = pair.sharedTerms;
            });
        sourceEntries.forEach((entry) => {
            entry.related = byEntry[entry.id];
        });
    }

    function assignLayoutFromText(sourceEntries, pairs) {
        const positions = {};
        const categoryAnchors = {
            games: { x: 0.24, y: 0.28 },
            tech: { x: 0.38, y: 0.36 },
            science: { x: 0.70, y: 0.42 },
            language: { x: 0.30, y: 0.72 },
            nature: { x: 0.73, y: 0.72 }
        };

        sourceEntries.forEach((entry) => {
            const anchor = categoryAnchors[entry.category] || { x: 0.5, y: 0.5 };
            const angle = seededUnit(entry.id, "angle") * Math.PI * 2;
            const radius = 0.05 + seededUnit(entry.id, "radius") * 0.17;
            positions[entry.id] = {
                x: clamp(anchor.x + Math.cos(angle) * radius, 0.09, 0.91),
                y: clamp(anchor.y + Math.sin(angle) * radius, 0.12, 0.88),
                vx: 0,
                vy: 0
            };
        });

        for (let step = 0; step < 320; step += 1) {
            for (let i = 0; i < sourceEntries.length; i += 1) {
                for (let j = i + 1; j < sourceEntries.length; j += 1) {
                    const a = positions[sourceEntries[i].id];
                    const b = positions[sourceEntries[j].id];
                    const dx = b.x - a.x || 0.001;
                    const dy = b.y - a.y || 0.001;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const overlap = Math.max(0, 0.16 - distance);
                    if (!overlap) continue;
                    const force = overlap * overlap * 0.09;
                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;
                    a.vx -= fx;
                    a.vy -= fy;
                    b.vx += fx;
                    b.vy += fy;
                }
            }

            pairs.forEach((pair) => {
                if (pair.similarity <= 0) return;
                const a = positions[pair.a];
                const b = positions[pair.b];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
                const target = 0.12 + (1 - clamp(pair.similarity * 4, 0, 0.82)) * 0.18;
                const force = (distance - target) * pair.similarity * 0.028;
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;
                a.vx += fx;
                a.vy += fy;
                b.vx -= fx;
                b.vy -= fy;
            });

            sourceEntries.forEach((entry) => {
                const point = positions[entry.id];
                const anchor = categoryAnchors[entry.category] || { x: 0.5, y: 0.5 };
                const drift = 0.0012 + seededUnit(entry.id, "drift") * 0.0015;
                const twinkle = Math.sin(step * 0.17 + seededUnit(entry.id, "phase") * Math.PI * 2) * 0.0007;
                point.vx += (anchor.x - point.x) * drift + twinkle;
                point.vy += (anchor.y - point.y) * drift - twinkle * 0.6;
                point.vx *= 0.86;
                point.vy *= 0.86;
                point.x = clamp(point.x + point.vx, 0.09, 0.91);
                point.y = clamp(point.y + point.vy, 0.12, 0.88);
            });
        }

        sourceEntries.forEach((entry) => {
            const point = positions[entry.id];
            entry.x = Math.round(point.x * 1000) / 10;
            entry.y = Math.round(point.y * 1000) / 10;
        });
    }

    function refreshConstellationLayout(sourceEntries = entries) {
        entries = sourceEntries;
        const { docs, idf } = analyzeEntries(entries);
        const pairs = buildSimilarityPairs(docs, idf);
        assignLayoutFromText(entries, pairs);
        assignRelatedFromText(entries, pairs);
        if (!entries.some((entry) => entry.id === state.selectedId)) {
            state.selectedId = entries[0] ? entries[0].id : null;
        }
        window.memorandumEntries = entries;
        return entries;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#39;"
        }[character]));
    }

    function lineKey(a, b) {
        return [a, b].sort().join("--");
    }

    function renderFilters() {
        const categories = ["all"].concat(Array.from(new Set(entries.map((entry) => entry.category))));
        filterBar.innerHTML = categories.map((category) => {
            const active = state.category === category ? "is-active" : "";
            return `<button class="memo-filter ${active}" type="button" data-category="${category}">${label(category)}</button>`;
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
                const sharedTerms = entry.sharedTerms?.[related.id] || [];
                const titleLabel = sharedTerms.length ? `${label("sharedTerms")}: ${sharedTerms.join(", ")}` : "";
                lines.push(`
                    <line class="memo-line${active}" x1="${entry.x}%" y1="${entry.y}%" x2="${related.x}%" y2="${related.y}%">
                        ${titleLabel ? `<title>${escapeHtml(titleLabel)}</title>` : ""}
                    </line>
                `);
            });
        });

        connections.innerHTML = lines.join("");
    }

    function renderStars(visible) {
        const html = visible.map((entry) => {
            const selected = entry.id === state.selectedId ? " is-selected" : "";
            const related = entry.related.includes(state.selectedId) ? " is-related" : "";
            const color = categoryColors[entry.category] || "#ffffff";
            const question = questionFor(entry);
            return `
                <button
                    class="memo-star${selected}${related}"
                    type="button"
                    data-id="${entry.id}"
                    style="left:${entry.x}%; top:${entry.y}%; --star-color:${color};"
                    aria-label="${escapeHtml(question)}">
                    <span class="memo-star-core"></span>
                    <span class="memo-star-label">${escapeHtml(question)}</span>
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
                <p class="memo-empty">${escapeHtml(label("noMatches"))}</p>
            `;
            return;
        }

        const related = selected.related
            .map(entryById)
            .filter(Boolean)
            .map((entry) => {
                const terms = selected.sharedTerms?.[entry.id] || [];
                const title = terms.length ? `${label("sharedTerms")}: ${terms.join(", ")}` : "";
                return `<button type="button" data-related="${entry.id}" title="${escapeHtml(title)}">${escapeHtml(questionFor(entry))}</button>`;
            })
            .join("");
        const selectedQuestion = questionFor(selected);
        const selectedAnswer = answerFor(selected);
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedQuestion)}`;

        detail.innerHTML = `
            <div class="memo-detail-kicker">${escapeHtml(label(selected.category))} / ${escapeHtml(selected.date)}</div>
            <h2>${escapeHtml(selectedQuestion)}</h2>
            <p>${escapeHtml(selectedAnswer)}</p>
            <div class="memo-source">${escapeHtml(label("source"))}: ${escapeHtml(selected.source)}</div>
            <div class="memo-actions">
                <a class="memo-web" href="${googleSearchUrl}" target="_blank" rel="noopener" data-web-search>
                    <span aria-hidden="true">🔎</span>
                    <span>${escapeHtml(label("lookUp"))}</span>
                </a>
            </div>
            <div class="memo-related">
                ${related ? `<h3>${escapeHtml(label("nearbyNotes"))}</h3>${related}` : ""}
            </div>
        `;

        detail.querySelectorAll("[data-related]").forEach((button) => {
            button.addEventListener("click", () => {
                state.selectedId = button.dataset.related;
                render();
            });
        });

        const webSearch = detail.querySelector("[data-web-search]");
        if (webSearch) {
            webSearch.addEventListener("click", () => {
                if (!navigator.clipboard) return;
                navigator.clipboard.writeText(selectedQuestion).catch(() => {});
            });
        }
    }

    function renderCount(visible) {
        if (state.language === "ja") {
            countLabel.textContent = `${visible.length}${label("notes")}`;
            return;
        }
        const note = visible.length === 1 ? label("note") : label("notes");
        countLabel.textContent = `${visible.length} ${note}`;
    }

    function render() {
        const visible = filteredEntries();
        const visibleIds = new Set(visible.map((entry) => entry.id));

        updateStaticText();
        renderFilters();
        renderLines(visibleIds);
        renderStars(visible);
        renderDetail();
        renderCount(visible);
    }

    window.refreshMemorandumConstellation = function (nextEntries = entries) {
        refreshConstellationLayout(nextEntries);
        render();
        return entries;
    };

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

    languageToggle.addEventListener("click", () => {
        state.language = state.language === "en" ? "ja" : "en";
        render();
    });

    refreshConstellationLayout(entries);
    render();
}());
