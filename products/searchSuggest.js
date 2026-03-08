const input = document.getElementById("search");
const suggestBox = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");

let allProducts = [];

// Fetch all products from DB once
async function fetchProducts() {
    try {
        const res = await fetch('https://growcart.onrender.com/api/products');
        allProducts = await res.json();
    } catch (err) {
        console.error('Failed to fetch products:', err);
    }
}

fetchProducts();

// Show suggestions while typing
input.addEventListener("input", () => {
    const value = input.value.toLowerCase().trim();
    suggestBox.innerHTML = "";

    if (value === "") {
        suggestBox.style.display = "none";
        return;
    }

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value) ||
        p.description.toLowerCase().includes(value)
    );

    if (filtered.length === 0) {
        suggestBox.style.display = "none";
        return;
    }

    suggestBox.style.display = "block";

    filtered.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
            <span style="font-size:0.9rem; font-weight:lighter">${product.name}</span>
            <small style="color:#178262; margin-left:8px;font-size:0.8rem;">$${product.price}</small>
        `;

       div.onclick = () => {
    input.value = product.name;
    suggestBox.style.display = "none";
    window.location.href = `/pages/search/search.html?q=${encodeURIComponent(product.name)}`;
};
        suggestBox.appendChild(div);
    });
});

// Search button
searchBtn.addEventListener("click", () => {
    const value = input.value.trim();
    suggestBox.style.display = "none";

    if (!value) return;
    else {
        window.location.href = `/shopping/search.html?q=${encodeURIComponent(value)}`;
    }
});

// Highlight and scroll to product on page
function highlightProduct(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.transition = 'box-shadow 0.3s ease';
        card.style.boxShadow = '0 0 0 3px #22c98a';
        setTimeout(() => {
            card.style.boxShadow = '';
        }, 2000);
    }
}

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!suggestBox.contains(e.target) && e.target !== input) {
        suggestBox.style.display = "none";
    }
});