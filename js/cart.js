let cart = [];

// ── CART SIDEBAR TOGGLE ──
document.getElementById("cartCount").onclick = () => {
  document.getElementById("cart-sidebar").classList.toggle("active");
};
document.querySelector(".closeCart").onclick = () => {
  document.getElementById("cart-sidebar").classList.remove("active");
};

// ── ADD TO CART ──
document.addEventListener("click", function (e) {
  // Handle Add button on product cards
  const addBtn = e.target.closest(".cart-control");
  if (addBtn) {
    e.stopPropagation();
    const card = addBtn.closest(".product-containerP1 .product-card");
    if (!card) return;

    const productId = String(card.dataset.id);
    const name = card.querySelector(".description") ? card.querySelector(".description").innerText : '';
    const price = card.querySelector(".selling-price").innerText.replace(/[^0-9.]/g, '');
    const image = card.querySelector("img").src;

    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ id: productId, name, price, image, quantity: 1 });
    }

    // Replace button immediately
    const wrapper = document.createElement("div");
    wrapper.className = "qty-wrapper";
    wrapper.innerHTML = `
        <button class="qty-btn minus">-</button>
        <span class="qty">${cart.find(i => i.id === productId).quantity}</span>
        <button class="qty-btn plus">+</button>
    `;
    addBtn.replaceWith(wrapper);

    updateCartCount();
    renderCart();
    return;
  }

  // Handle + on product card
  const plusBtn = e.target.closest(".plus");
  if (plusBtn) {
    e.stopPropagation();
    const card = plusBtn.closest(".product-card");
    if (!card) return;
    const item = cart.find(i => i.id === String(card.dataset.id));
    if (item) {
      item.quantity++;
      plusBtn.closest(".qty-wrapper").querySelector(".qty").innerText = item.quantity;
      updateCartCount();
      renderCart();
    }
    return;
  }
  // Handle - on product card
  const minusBtn = e.target.closest(".minus");
  if (minusBtn) {
    e.stopPropagation();
    const card = minusBtn.closest(".product-card");
    if (!card) return;
    const productId = String(card.dataset.id);
    const item = cart.find(i => i.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        // Update qty display
        minusBtn.closest(".qty-wrapper").querySelector(".qty").innerText = item.quantity;
      } else {
        // Remove from cart and restore Add button
        cart = cart.filter(i => i.id !== productId);
        const wrapper = minusBtn.closest(".qty-wrapper");
        const btn = document.createElement("button");
        btn.className = "cart-control";
        btn.innerText = "Add";
        wrapper.replaceWith(btn);
      }
      updateCartCount();
      renderCart();
    }
    return;
  }


  function syncProductCards() {
    document.querySelectorAll(".product-containerP1 .product-card").forEach(card => {
      const id = String(card.dataset.id);
      const item = cart.find(i => i.id === id);
      const qtyWrapper = card.querySelector(".qty-wrapper");
      const addBtn = card.querySelector(".cart-control");

      if (item) {
        if (qtyWrapper) {
          // Update existing qty wrapper
          qtyWrapper.querySelector(".qty").innerText = item.quantity;
        } else if (addBtn) {
          // Replace Add button with qty wrapper
          const wrapper = document.createElement("div");
          wrapper.className = "qty-wrapper";
          wrapper.innerHTML = `
                    <button class="qty-btn minus">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn plus">+</button>
                `;
          addBtn.replaceWith(wrapper);
        }
      } else {
        if (qtyWrapper) {
          // Restore Add button
          const btn = document.createElement("button");
          btn.className = "cart-control";
          btn.innerText = "Add";
          qtyWrapper.replaceWith(btn);
        }
      }
    });
  }


  // Handle + in cart sidebar
  if (e.target.classList.contains("cart-plus")) {
    const cartItem = e.target.closest(".cart-item");
    const index = cartItem.dataset.index;
    cart[index].quantity++;
    updateCartCount();
    renderCart();
    syncProductCards();
    return;
  }

  // Handle - in cart sidebar
  if (e.target.classList.contains("cart-minus")) {
    const cartItem = e.target.closest(".cart-item");
    const index = cartItem.dataset.index;
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    }
    updateCartCount();
    renderCart();
    syncProductCards();
    return;
  }

  // Handle remove in cart sidebar
  if (e.target.classList.contains("remove-btn")) {
    const cartItem = e.target.closest(".cart-item");
    const index = cartItem.dataset.index;
    cart.splice(index, 1);
    updateCartCount();
    renderCart();
    syncProductCards();
    return;
  }

  // Handle checkout
  if (e.target.classList.contains("checkout-btn")) {
    if (window.innerWidth <= 768) {
      document.getElementById('cart-sidebar').classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
    }
    openCheckout();
    return;
    
  }
});

  // ── UPDATE UI ──
  function updateUI() {
    updateCartCount();
    renderCart();
  }

  // ── CART COUNT ──
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("counting");
    const mobileCartCount = document.getElementById("mobileCartCount");
    if (total === 0) {
      cartCountEl.style.display = 'none';
      if (mobileCartCount) mobileCartCount.style.display = 'none';
    } else {
      cartCountEl.style.display = 'inline-block';
      cartCountEl.innerText = total;
      if (mobileCartCount) {
        mobileCartCount.style.display = 'flex';
        mobileCartCount.innerText = total;
      }
    }
  }

  // ── RENDER CART SIDEBAR ──
  function renderCart() {
    const cartItems = document.getElementById("cart-items");

    if (cart.length === 0) {
      cartItems.innerHTML = `
            <div class="empty-cart" style="text-align:center; padding:20px; color:#e91515;">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
            </div>
        `;
      return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
      total += Number(item.price) * item.quantity;

      const productDiv = document.createElement("div");
      productDiv.classList.add("cart-item");
      productDiv.dataset.cartId = item.id;  // instead of dataset.id
      productDiv.dataset.index = index;

      productDiv.innerHTML = `
            <div class="cart-left">
                <img src="${item.image}" class="cart-img">
                <div class="cart-info">
                    <h4>${item.name}</h4>
                    <p class="cart-sub">1 pc</p>
                </div>
            </div>
            <div class="cart-right">
                <div class="quantity-box">
                    <button class="qty-btn cart-minus">-</button>
                    <span class="qty cart-qty">${item.quantity}</span>
                    <button class="qty-btn cart-plus">+</button>
                </div>
                <div class="price">$${item.price}</div>
                <button class="remove-btn">Remove</button>
            </div>
        `;
      cartItems.appendChild(productDiv);
    });

    cartItems.innerHTML += `<h3 class="total">Total: $${total.toFixed(2)}</h3>`;

    const checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.innerHTML = `Checkout > $${total.toFixed(2)}`;
    cartItems.appendChild(checkoutBtn);
  }

  // ── RENDER PRODUCT CARDS ──
  function renderProducts() {
    console.log('renderProducts running');
    document.querySelectorAll(".product-containerP1 .product-card:not(.cart-item)").forEach(card => {
      const id = String(card.dataset.id);
      console.log('checking card:', id, 'cart item:', cart.find(i => i.id === id));
      if (!id) return;

      const item = cart.find(i => i.id === id);
      const addBtn = card.querySelector(".cart-control");
      const qtyWrapper = card.querySelector(".qty-wrapper");

      if (item) {
        if (addBtn) {
          const wrapper = document.createElement("div");
          wrapper.className = "qty-wrapper";
          wrapper.innerHTML = `
                    <button class="qty-btn minus">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn plus">+</button>
                `;
          addBtn.replaceWith(wrapper);
        } else if (qtyWrapper) {
          qtyWrapper.querySelector(".qty").innerText = item.quantity;
        }
      } else {
        if (qtyWrapper) {
          const btn = document.createElement("button");
          btn.className = "cart-control";
          btn.innerText = "Add";
          qtyWrapper.replaceWith(btn);
        }
      }
    });
  }

  // ── TOGGLE CART ──
  function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');

    // On mobile, go back to home when cart closes
    if (window.innerWidth <= 768 && !sidebar.classList.contains('active')) {
      switchTab('home');
    }
  }