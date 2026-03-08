
const placeholders = [
    "search seeds...",
    "search pesticides...",
    "search organic...",
    "search fertilizer...",
    "search plants...",
    "search tools...",
    "search accessories...",
    "search crop protection...",
    "search soil enhancers...",
    "search crop nutrients..."
];

let index = 0;

setInterval(() => {
    document.getElementById("search").placeholder = placeholders[index];
    index = (index + 1) % placeholders.length;
}, 1500); // changes every 1.5 seconds

