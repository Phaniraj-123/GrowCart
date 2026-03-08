// shopping search navigation

window.alert = function (message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 2500);
    }
};
// user profile navigation

function handleUserIcon() {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/pages/profile/profile.html';
    } else {
        window.location.href = '/pages/auth/login.html';
    }
}

// hidden products and view more button

// const hiddenProducts = document.querySelectorAll('.product-hidden');
// const showMoreBtn = document.getElementById('view-more');

// let visibleCount = 0;
// const SHOW_PER_CLICK = 2;


// showMoreBtn.addEventListener('click', ()=>{
//     for(let i=visibleCount; i<visibleCount+SHOW_PER_CLICK; i++){
//         if(i<hiddenProducts.length){
//             hiddenProducts[i].style.display='block';
//         }
//     }
//     visibleCount += SHOW_PER_CLICK;

// });


function goToCategory(el) {
    const category = el.dataset.category;
    window.location.href = `../category/category.html?cat=${category}`;
}

// footer navigation

// const footer = document.querySelector(".hided-footer");
// const showBtn = document.querySelector(".nav-searchbar");
// const closeBtn = document.querySelector(".close-footrer");

// if (showBtn && footer) {
//     showBtn.addEventListener("click", () => {
//         footer.style.display = "block";
//     });
// }

// if (closeBtn && footer) {
//     closeBtn.addEventListener("click", () => {
//         footer.style.display = "none";
//     });
// }


// product preview

// Use event delegation — works for dynamically loaded cards too
let currentPreviewCard = null;

document.addEventListener("click", function (e) {
    if (e.target.closest(".cart-control")) return;
    if (e.target.closest(".options-select")) return;
    if (e.target.closest(".qty-btn")) return;
    if (e.target.closest(".remove-btn")) return;
    if (e.target.closest(".preview-modal")) return;

    const card = e.target.closest(".product-card");
    if (!card) return;

    currentPreviewCard = card;

    const modal = document.getElementById("previewModal");
    const img = card.querySelector("img").src;
    const price = card.querySelector(".selling-price").innerText;
    const desc = card.querySelector(".description") ? card.querySelector(".description").innerText : '';
    const category = card.dataset.category || '';

    // Set main image
    document.getElementById("previewImage").src = img;
    document.getElementById("previewTitle").innerText = desc;
    document.getElementById("previewPrice").innerText = price;
    document.getElementById("previewDesc").innerText = desc;
    document.getElementById("previewCategory").innerText = category;

    // Thumbnails — just use same image for now
    const thumbs = document.getElementById("previewThumbnails");
    thumbs.innerHTML = `<img src="${img}" class="thumb active">`;

    modal.style.display = "flex";
    loadRatings(card.dataset.id);
});

// Add to cart from modal
document.getElementById("previewAddBtn").addEventListener("click", function () {
    if (currentPreviewCard) {
        // Click the actual Add button on the card
        const addBtn = currentPreviewCard.querySelector(".cart-control");
        if (addBtn) {
            addBtn.click();
        }

        // Replace modal button with qty controls
        const item = cart.find(i => i.id === currentPreviewCard.dataset.id);
        if (item) {
            document.getElementById("previewAddBtn").outerHTML = `
                <div class="preview-qty-wrapper">
                    <button class="qty-btn preview-minus">-</button>
                    <span class="preview-qty">${item.quantity}</span>
                    <button class="qty-btn preview-plus">+</button>
                </div>
            `;

            // Plus button
            document.querySelector(".preview-plus").addEventListener("click", function () {
                item.quantity++;
                document.querySelector(".preview-qty").innerText = item.quantity;
                updateUI();
            });

            // Minus button
            document.querySelector(".preview-minus").addEventListener("click", function () {
                if (item.quantity > 1) {
                    item.quantity--;
                    document.querySelector(".preview-qty").innerText = item.quantity;
                } else {
                    cart = cart.filter(i => i.id !== currentPreviewCard.dataset.id);
                    // Restore Add button
                    document.querySelector(".preview-qty-wrapper").outerHTML = `
                        <button class="preview-add-btn" id="previewAddBtn">Add to Cart</button>
                    `;
                }
                updateUI();
            });
        }
    }
});

// Close modal
// Add to cart from modal
const previewAddBtn = document.getElementById("previewAddBtn");
if (previewAddBtn) {
    previewAddBtn.addEventListener("click", function () {
        // ... existing code
    });
}

// Close modal
const closeBtn = document.querySelector(".close-btn");
if (closeBtn) {
    closeBtn.addEventListener("click", function () {
        document.getElementById("previewModal").style.display = "none";
    });
}

// Close on backdrop click
const previewModal = document.getElementById("previewModal");
if (previewModal) {
    previewModal.addEventListener("click", function (e) {
        if (e.target === this) this.style.display = "none";
    });
}
// 
// review section

// After setting modal content, load ratings
async function loadRatings(productId) {
    try {
        const res = await fetch(`http://localhost:5000/api/reviews/${productId}`);
        const data = await res.json();

        // Update avg rating
        document.getElementById('previewAvgRating').textContent = data.stats.avg_rating || '0.0';
        document.getElementById('previewRatingCount').textContent = `(${data.stats.review_count} reviews)`;

        // Render stars
        const starsEl = document.getElementById('previewStars');
        const avg = parseFloat(data.stats.avg_rating) || 0;
        starsEl.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = '★';
            star.style.color = i <= Math.round(avg) ? '#f4a400' : '#ddd';
            starsEl.appendChild(star);
        }

        // Render reviews
        const list = document.getElementById('reviewsList');
        list.innerHTML = data.reviews.length === 0 ? '<p style="color:#6b7c74; font-size:0.85rem;">No reviews yet!</p>' :
            data.reviews.map(r => `
                <div class="review-item">
                    <span class="reviewer-name">${r.name}</span>
                    <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                    <p class="review-text">${r.review || ''}</p>
                </div>
            `).join('');

    } catch (err) {
        console.error(err);
    }
}

// Star input interaction
let selectedRating = 0;

document.addEventListener('click', function (e) {
    const star = e.target.closest('.star-pick');
    if (star) {
        selectedRating = parseInt(star.dataset.value);
        document.querySelectorAll('.star-pick').forEach((s, i) => {
            s.classList.toggle('active', i < selectedRating);
        });
    }
});

// Submit rating
document.getElementById('submitRatingBtn').addEventListener('click', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login to rate!');
        return;
    }

    if (!selectedRating) {
        showToast('Please select a star rating!');
        return;
    }

    const productId = currentPreviewCard.dataset.id;

    try {
        const res = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: productId,
                rating: selectedRating,
                review: ''
            })
        });

        const data = await res.json();
        if (res.ok) {
            showToast('✅ Rating submitted!');
            loadRatings(productId);
            selectedRating = 0;
            document.querySelectorAll('.star-pick').forEach(s => s.classList.remove('active'));
        } else {
            showToast(data.message);
        }
    } catch (err) {
        showToast('Something went wrong!');
    }
});



// ---------------------------------------------------------------------
// Volume price multipliers
const volumePricing = {
    '1L': 1,        // full price
    '500ml': 0.75,  // 75% of price
    '250ml': 0.5,   // 50% of price
    '1.5L': 1.25,
    '2L': 1.5
};

// Listen for volume change on product cards
document.addEventListener('change', function (e) {
    const select = e.target.closest('.options-select');
    if (!select) return;

    const card = select.closest('.product-card');
    if (!card) return;

    const basePrice = parseFloat(card.dataset.basePrice);
    const multiplier = volumePricing[select.value] || 1;
    const newPrice = (basePrice * multiplier).toFixed(2);

    card.querySelector('.selling-price').innerText = `$${newPrice}`;
});

// =============================================================================
function switchTab(tab) {
    if (window.innerWidth > 768) return;

    document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));

    if (tab === 'home') {
        document.getElementById('App').style.display = 'block';
        document.getElementById('mobile-search-section').style.display = 'none';
        document.getElementById('mob-home').classList.add('active');

    } else if (tab === 'search') {
        document.getElementById('App').style.display = 'none';
        document.getElementById('mobile-search-section').style.display = 'block';
        document.getElementById('mob-search').classList.add('active');
        document.getElementById('mobileSearchInput').focus();

    } else if (tab === 'cart') {
        // Hide all sections
        document.getElementById('App').style.display = 'none';
        document.getElementById('mobile-search-section').style.display = 'none';
        document.getElementById('mob-cart').classList.add('active');
        // Open cart
        const sidebar = document.getElementById('cart-sidebar');
        sidebar.classList.add('active');

    } else if (tab === 'profile') {
        window.location.href = '../profile/profile.html';
    }
}

function renderMobileCart() {
    const container = document.getElementById('mobile-cart-items');
    const totalEl = document.getElementById('mobile-cart-total');

    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#6b7c74; text-align:center; padding:40px 0;">Your cart is empty!</p>';
        totalEl.innerHTML = '';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-left">
                <img src="${item.image}" class="cart-img">
                <div class="cart-info">
                    <h4>${item.name}</h4>
                    <p class="cart-sub">$${item.price}</p>
                </div>
            </div>
            <div class="cart-right">
                <div class="quantity-box">
                    <button class="qty-btn" onclick="mobileCartUpdate('${item.id}', -1)">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="mobileCartUpdate('${item.id}', 1)">+</button>
                </div>
                <p class="price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalEl.innerHTML = `<p class="total">Total: $${total.toFixed(2)}</p>`;
}

function mobileCartUpdate(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    updateUI();
    renderMobileCart();
}

function mobileSearch() {
    const query = document.getElementById('mobileSearchInput').value.trim();
    if (query) window.location.href = `../search/search.html?q=${encodeURIComponent(query)}`;
}