let selectedPaymentMethod = '';
let selectedAddress = null;

// Open checkout modal
function openCheckout() {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('Please login first!');
        window.location.href = '/pages/auth/login.html';
        return;
    }
    document.getElementById('checkout-overlay').style.display = 'flex';
    loadCheckoutAddress();
}

// Close modal
function closeCheckout() {
    document.getElementById('checkout-overlay').style.display = 'none';
    document.getElementById('checkout-step-1').style.display = 'block';
    document.getElementById('checkout-step-2').style.display = 'none';
    selectedPaymentMethod = '';
    selectedAddress = null;
}

// Load saved address
async function loadCheckoutAddress() {
    const token = localStorage.getItem('token');
    const section = document.getElementById('saved-address-section');

    try {
        const res = await fetch('https://growcart.onrender.com/api/addresses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const addresses = await res.json();

        if (addresses.length > 0) {
            const a = addresses[0];
            selectedAddress = a;
            section.innerHTML = `
                <div class="payment-option selected" id="saved-addr-card">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                        <b>${a.full_name}</b><br>
                        <span style="font-size:0.85rem; color:#6b7c74;">
                            ${a.street}${a.apt ? ', ' + a.apt : ''}, ${a.city}, ${a.state} ${a.zip}
                        </span>
                    </div>
                </div>
                <p onclick="toggleAddressForm()" 
                   style="color:#178262; cursor:pointer; font-size:0.85rem; margin-top:8px;">
                   + Add different address
                </p>
            `;
        } else {
            section.innerHTML = `<p style="color:#6b7c74; margin-bottom:12px;">No saved address. Please add one below.</p>`;
            document.getElementById('checkout-address-form').style.display = 'block';
        }
    } catch (err) {
        console.error(err);
    }
}

// Toggle address form
function toggleAddressForm() {
    const form = document.getElementById('checkout-address-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'block') selectedAddress = null;
}

// Confirm address → go to step 2
async function confirmAddress() {
    const form = document.getElementById('checkout-address-form');

    if (form.style.display === 'block') {
        // Use new address from form
        const full_name = document.getElementById('co-name').value;
        const street = document.getElementById('co-street').value;
        const apt = document.getElementById('co-apt').value;
        const city = document.getElementById('co-city').value;
        const state = document.getElementById('co-state').value;
        const zip = document.getElementById('co-zip').value;
        const phone = document.getElementById('co-phone').value;

        if (!full_name || !street || !city || !state || !zip || !phone) {
            showToast('Please fill all address fields!');
            return;
        }

        // Save new address
        const token = localStorage.getItem('token');
        await fetch('https://growcart.onrender.com/api/addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ full_name, street, apt, city, state, zip, phone })
        });

        selectedAddress = { full_name, street, apt, city, state, zip, phone };
    }

    if (!selectedAddress) {
        showToast('Please select or add a delivery address!');
        return;
    }

    // Go to step 2
    // Go to payment page
    document.getElementById('checkout-step-1').style.display = 'none';
    localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    localStorage.setItem('pendingCart', JSON.stringify(cart));
    window.location.href = '/pages/payment/payment.html';
}

// Select payment method
function selectPayment(el, method) {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedPaymentMethod = method;
    document.getElementById('selected-payment-label').textContent = `Selected: ${method.toUpperCase()}`;
}

// Confirm order
async function confirmOrder() {
    if (!selectedPaymentMethod) {
        showToast('Please select a payment method!');
        return;
    }

    const token = localStorage.getItem('token');

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    try {
        // Place order
        const orderRes = await fetch('https://growcart.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
            showToast(orderData.message);
            return;
        }

        // Make payment
        const paymentRes = await fetch('https://growcart.onrender.com/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                order_id: orderData.order_id,
                method: selectedPaymentMethod
            })
        });

        const paymentData = await paymentRes.json();

        if (paymentRes.ok) {
            closeCheckout();
            cart = [];
            updateUI();
            showToast(`✅ Order placed! Total: $${orderData.total}`);
        } else {
            showToast(paymentData.message);
        }

    } catch (err) {
        showToast('Something went wrong!');
    }
}