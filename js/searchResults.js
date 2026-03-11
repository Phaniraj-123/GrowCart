
// Get query from URL
const params = new URLSearchParams(window.location.search);
const query = params.get('q') || '';

document.getElementById('search-heading').textContent = 
    `Search results for: "${query}"`;

async function loadSearchResults() {
    try {
        const res = await fetch('http://localhost:5000/api/products');
        const products = await res.json();

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        );

        const container = document.getElementById('search-results');

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:40px; color:#6b7c74;">
                    <i class="fa-solid fa-magnifying-glass fa-3x" style="margin-bottom:16px;"></i>
                    <h3>No products found for "${query}"</h3>
                    <p>Try searching something else!</p>
                </div>
            `;
            return;
        }

        filtered.forEach(product => {
            const card = `
                <div data-id="${product.id}" class="product-card">
                    <img src="${product.image_url}" alt="${product.name}">
                    <div class="price-section">
                        <p class="selling-price">$${product.price}</p>
                    </div>
                    <p class="description">${product.name}</p>
                    <p>${product.description}</p>
                    <select class="options-select">
                        <option value="1L">1L</option>
                        <option value="500ml">500ml</option>
                        <option value="250ml">250ml</option>
                    </select>
                    <p class="rating">
                        <i class="fa-solid fa-star" style="color:#178262;"></i>4.1(4.1k)
                    </p>
                    <button class="cart-control" onclick="addToCart(this)">Add</button>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (err) {
        console.error(err);
    }
}

loadSearchResults();