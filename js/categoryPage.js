const params = new URLSearchParams(window.location.search);
const category = params.get('cat') || '';

// Set page title
document.getElementById('category-title').textContent = 
    category.charAt(0).toUpperCase() + category.slice(1);
document.title = `${category} — GrowCart`;

async function loadCategory() {
    try {
        const res = await fetch('https://growcart.onrender.com/api/products');
        const products = await res.json();

        const filtered = products.filter(p => p.category === category);
        const container = document.getElementById('category-container');

        if (filtered.length === 0) {
            container.innerHTML = '<p style="color:#6b7c74;">No products found!</p>';
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
                    <select name="select" class="options-select">
                        <option value="1L">1L</option>
                        <option value="500ml">500ml</option>
                        <option value="250ml">250ml</option>
                    </select>
                    <p class="rating">
                        <i class="fa-solid fa-star" style="color:#178262;"></i>4.1(4.1k)
                    </p>
                    <button class="cart-control">Add</button>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });

    } catch (err) {
        console.error(err);
    }
}

loadCategory();