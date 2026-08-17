window.memorandumEntries = [
    {
        id: "steam-dx",
        question: "What does DX mean when opening games on Steam?",
        answer: "DX usually means DirectX, Microsoft's family of graphics and multimedia APIs for Windows games. A Steam launch option may ask whether to start a game in DX11, DX12, or another DirectX mode. The choice changes which graphics API the game uses to talk to the GPU driver. DX12 can offer more modern features and lower-level control, but it may also expose driver bugs or run worse on some hardware. DX11 is often older, more stable, and sometimes smoother for specific games. If one mode crashes, stutters, or has visual glitches, trying the other is a reasonable troubleshooting step.",
        category: "games",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 19,
        y: 28,
        related: ["directx-api", "gpu-driver"]
    },
    {
        id: "directx-api",
        question: "What is DirectX?",
        answer: "DirectX is a collection of Microsoft APIs that help Windows software communicate with hardware for graphics, sound, input, and multimedia. In games, people usually mean Direct3D, the part of DirectX that sends rendering work to the graphics card. Instead of every game developer writing separate code for every GPU model, the game can use DirectX as a common interface, while the GPU driver translates those requests for the specific hardware. Different versions, such as DirectX 11 and DirectX 12, expose different performance models and features. That is why a launch option can affect frame rate, stability, and visuals.",
        category: "tech",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 30,
        y: 38,
        related: ["steam-dx", "gpu-driver", "tf-idf"]
    },
    {
        id: "gpu-driver",
        question: "Why do GPU drivers matter for games?",
        answer: "GPU drivers are the software layer between a game, a graphics API such as DirectX, and the physical graphics card. The game sends rendering commands, shader programs, memory requests, and display instructions; the driver turns those into hardware-specific work the GPU can execute. Driver updates can improve performance for new games, fix crashes, repair visual bugs, and add support for features such as ray tracing or upscaling. They can also occasionally introduce regressions, which is why some players roll back to an older driver. For gaming, the driver is part translator, part scheduler, and part compatibility patch.",
        category: "tech",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 40,
        y: 23,
        related: ["directx-api", "steam-dx"]
    },
    {
        id: "ac-dc",
        question: "What is the difference between AC and DC?",
        answer: "DC, or direct current, flows in one direction through a circuit, like the current from a battery powering a flashlight. AC, or alternating current, reverses direction periodically, usually many times per second. In the United States, household AC changes direction 60 times per second, or 60 hertz. The practical difference matters because AC voltage is easy to raise or lower with transformers, which made long-distance power transmission efficient. DC is common inside electronics, batteries, solar panels, and USB devices. Many devices plugged into a wall outlet immediately convert AC into DC before using it.",
        category: "science",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 69,
        y: 34,
        related: ["voltage-current", "wall-outlet"]
    },
    {
        id: "voltage-current",
        question: "What is the difference between voltage and current?",
        answer: "Voltage is electric potential difference: it describes how much energy is available per unit of charge between two points. Current is the rate at which electric charge actually flows through a circuit. A common analogy is water: voltage is like pressure, while current is like the amount of water moving through a pipe each second. Resistance determines how much current flows for a given voltage. High voltage does not always mean high current, but dangerous situations often involve enough voltage to push current through the body. Electronics design depends on managing both quantities together, not treating them as interchangeable.",
        category: "science",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 77,
        y: 48,
        related: ["ac-dc", "wall-outlet"]
    },
    {
        id: "wall-outlet",
        question: "Why do homes use AC power from outlets?",
        answer: "Homes use AC power largely because the electrical grid was built around the advantages of alternating current. AC can be stepped up to very high voltages for transmission over long distances, which reduces energy lost as heat in power lines. Near homes, transformers step the voltage back down to safer, useful levels. That historical and engineering advantage made AC the standard for grid distribution. Inside a home, many appliances can use AC directly, such as motors and heaters. Modern electronics, however, usually convert outlet AC into lower-voltage DC using power adapters or internal power supplies.",
        category: "science",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 60,
        y: 52,
        related: ["ac-dc", "voltage-current"]
    },
    {
        id: "eta-origin",
        question: "What does ETA stand for?",
        answer: "ETA stands for estimated time of arrival. It originally feels most natural in travel contexts: a train, flight, ship, delivery driver, or friend on the way can all have an ETA. The phrase has broadened into a general estimate for when something will finish, arrive, or become available. In computing, someone might ask for the ETA on a download, model training run, package delivery, or data pipeline. The important part is that it is an estimate, not a guarantee. It communicates a predicted completion time based on current information, which can change as conditions change.",
        category: "language",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 23,
        y: 69,
        related: ["acronym-initialism"]
    },
    {
        id: "acronym-initialism",
        question: "What is the difference between an acronym and an initialism?",
        answer: "An acronym is an abbreviation formed from initial letters that is pronounced as a word, such as NASA, scuba, or laser. An initialism is also formed from initial letters, but each letter is pronounced separately, such as FBI, CPU, or UCLA. People often use acronym casually for both types, and that loose use is common enough that it is usually understood. The distinction is useful when talking carefully about language because pronunciation is the key difference. If the letters create a new spoken word, it is an acronym; if you read the letters one by one, it is an initialism.",
        category: "language",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 36,
        y: 78,
        related: ["eta-origin", "tf-idf"]
    },
    {
        id: "rain-smell",
        question: "What is the smell after rain called?",
        answer: "The smell after rain is called petrichor. It is especially noticeable when rain falls after a dry period. Part of the scent comes from plant oils that accumulate on rocks and soil, and part comes from geosmin, an earthy-smelling compound produced by certain soil microorganisms. When raindrops hit porous ground, they can trap tiny air bubbles that rise and burst, sending microscopic scented particles into the air. That is why the smell can seem to bloom suddenly right as rain begins. Petrichor is both a chemistry story and a sensory memory trigger.",
        category: "nature",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 74,
        y: 75,
        related: ["geosmin"]
    },
    {
        id: "geosmin",
        question: "What is geosmin?",
        answer: "Geosmin is an organic compound with a strong earthy smell. It is produced by some bacteria and other microorganisms in soil, including actinomycetes, and humans can detect it at extremely low concentrations. Geosmin helps explain why freshly disturbed soil, beets, some fish, and rain after dry weather can smell earthy or mineral-like. It is not usually dangerous at the levels people notice by smell, but in drinking water it can create an unpleasant taste even when the water is otherwise safe. In nature, geosmin may also influence animal behavior by signaling moist soil or microbial activity.",
        category: "nature",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 84,
        y: 64,
        related: ["rain-smell"]
    },
    {
        id: "tf-idf",
        question: "What is TF-IDF?",
        answer: "TF-IDF stands for term frequency-inverse document frequency. It is a way to score how important a word is to one document within a larger collection of documents. Term frequency increases when a word appears often in a specific document. Inverse document frequency increases when that word is rare across the whole collection. The combination gives high scores to words that are frequent in one note but uncommon overall, such as GPU, petrichor, or transformer. It gives low scores to generic words like the, and, or question. That makes TF-IDF useful for search, clustering, and finding similar text.",
        category: "tech",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 48,
        y: 58,
        related: ["directx-api", "acronym-initialism"]
    },
    {
        id: "kalshi-california-sports",
        question: "Why is sports betting on Kalshi allowed in California?",
        answer: "Kalshi is generally described as available in California because it operates as a federally regulated prediction market exchange rather than a state-licensed sportsbook. Its contracts are event contracts traded on a CFTC-regulated designated contract market, so Kalshi argues that federal commodities law governs them and can preempt state gambling restrictions. That is different from ordinary sports betting apps, which need state authorization and are not legal in California. The issue is contested: regulators and courts have debated whether sports event contracts are effectively gaming and whether CFTC oversight is enough. So the short answer is federal prediction-market structure, not California sportsbook legalization.",
        category: "games",
        date: "2026-08-17",
        source: "Legal/regulatory lookup",
        x: 55,
        y: 72,
        related: ["tf-idf", "acronym-initialism"]
    },
    {
        id: "leftover-candle-wax",
        question: "What can I do with candles with wax left?",
        answer: "If a candle has wax left but the wick is gone or buried, you can reuse the wax instead of throwing it away. One option is to gently warm the container in a hot-water bath, remove the softened wax, and melt scraps together in a wax warmer. You can also pour melted leftover wax into a silicone mold with a new wick to make a small recycled candle. Another easy use is making wax melts for fragrance without a flame. Avoid overheating wax, never leave it unattended, and do not pour melted wax down the drain because it can harden and clog pipes.",
        category: "nature",
        date: "2026-08-17",
        source: "Personal lookup",
        x: 68,
        y: 18,
        related: ["rain-smell", "geosmin"]
    }
];
