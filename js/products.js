async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        const vegetables = products.filter(p => p.category === 'vegetables');
        const fruits = products.filter(p => p.category === 'fruits');
        const dairy = products.filter(p => p.category === 'dairy');
        const grocery = products.filter(p => p.category === 'grocery');
        const detergents = products.filter(p => p.category === 'detergents');
        const snacks = products.filter(p => p.category === 'snacks');
        const beverages = products.filter(p => p.category === 'beverages');

        renderProducts(vegetables, 'vegetables-container');
        setSeeMore('vegetables', 'vegetables-container');

        renderProducts(fruits, 'fruits-container');
        setSeeMore('fruits', 'fruits-container');

        renderProducts(dairy, 'dairy-container');
        setSeeMore('dairy', 'dairy-container');

        renderProducts(grocery, 'grocery-container');
        setSeeMore('grocery', 'grocery-container');

        renderProducts(detergents, 'detergents-container');
        setSeeMore('detergents', 'detergents-container');

        renderProducts(snacks, 'snacks-container');
        setSeeMore('snacks', 'snacks-container');

        renderProducts(beverages, 'beverages-container');
        setSeeMore('beverages', 'beverages-container');

        const knownCategories = ['vegetables', 'fruits', 'dairy', 'grocery', 'detergents', 'snacks', 'beverages'];
        const extraCategories = [...new Set(products.map(p => p.category))]
            .filter(c => c !== 'general' && !knownCategories.includes(c));

        const viewMoreBtn = document.getElementById('view-more-categories');

        if (extraCategories.length > 0 && viewMoreBtn) {
            viewMoreBtn.style.display = 'block';
            viewMoreBtn.onclick = () => {
                extraCategories.forEach(category => {
                    const section = document.createElement('section');
                    section.innerHTML = `
                        <div class="pestisides-product">
                            <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                            <p class="see-more">see more ></p>
                            <div class="product-containerP1" id="${category}-container"></div>
                        </div>
                    `;
                    document.getElementById('App').appendChild(section);

                    const filtered = products.filter(p => p.category === category);
                    renderProducts(filtered, `${category}-container`);
                    setSeeMore(category, `${category}-container`);
                });
                viewMoreBtn.style.display = 'none';
            };
        }

    } catch (err) {
        console.error('Failed to load products:', err);
    }
}

function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const visible = products.slice(0, 8);

    visible.forEach(product => {
        const card = `
            <div data-id="${product.id}" data-base-price="${product.price}" class="product-card">
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
    ${product.avg_rating > 0
                ? `<i class="fa-solid fa-star" style="color:#f4a400;"></i> ${product.avg_rating} (${product.review_count})`
                : `<i class="fa-regular fa-star" style="color:#aaa;"></i> Give Rating`
            }
</p>
                <button class="cart-control">Add</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', card);
    });
}

function setSeeMore(category, containerId) {
    const section = document.getElementById(containerId).closest('section');
    const seeMore = section.querySelector('.see-more');
    if (seeMore) {
        seeMore.style.cursor = 'pointer';
        seeMore.onclick = () => {
            window.location.href = `../category/category.html?cat=${category}`;
        };
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);