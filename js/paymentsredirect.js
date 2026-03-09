const token = localStorage.getItem('token');
const cart = JSON.parse(localStorage.getItem('pendingCart')) || [];
const address = JSON.parse(localStorage.getItem('selectedAddress'));
let selectedPaymentMethod = '';

// Redirect if not logged in
if (!token) window.location.href = '../userlogin/login.html';

// Load order summary
function loadSummary() {
    const container = document.getElementById('order-summary');
    let total = 0;

    cart.forEach(item => {
        total += Number(item.price) * item.quantity;
        container.innerHTML += `
            <div class="summary-item">
                <img src="${item.image}" class="summary-img">
                <div class="summary-info">
                    <p><b>${item.name}</b></p>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <p class="summary-price">$${(Number(item.price) * item.quantity).toFixed(2)}</p>
            </div>
        `;
    });

    container.innerHTML += `
        <div class="total-row">
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

// Load delivery address
function loadAddress() {
    const container = document.getElementById('delivery-address');
    if (!address) {
        container.innerHTML = '<p style="color:#dc3c3c;">No address found!</p>';
        return;
    }
    container.innerHTML = `
        <p><b>${address.full_name}</b></p>
        <p>${address.street}${address.apt ? ', ' + address.apt : ''}</p>
        <p>${address.city}, ${address.state} ${address.zip}</p>
        <p>📞 ${address.phone}</p>
    `;
}

// Select payment
function selectPayment(el, method) {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedPaymentMethod = method;
}

// Confirm order
async function confirmOrder() {
    if (!selectedPaymentMethod) {
        showToast('Please select a payment method!');
        return;
    }

    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    try {
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
            localStorage.removeItem('pendingCart');
            showToast(`✅ Order placed! Total: $${orderData.total}`);
            setTimeout(() => {
                window.location.href = '/pages/home/content.html';
            }, 2000);
        } else {
            showToast(paymentData.message);
        }

    } catch (err) {
        showToast('Something went wrong!');
    }
}

// Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 2500);
}

loadSummary();
loadAddress();


// Calculate total
function getTotal() {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0).toFixed(2);
}

// Render PayPal button
paypal.Buttons({
    createOrder: async function() {
        const res = await fetch('https://growcart.onrender.com/api/paypal/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: getTotal() })
        });
        const data = await res.json();
        return data.orderID;
    },

    onApprove: async function(data) {
        // Capture payment
        const captureRes = await fetch('https://growcart.onrender.com/api/paypal/capture-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderID: data.orderID })
        });

        const captureData = await captureRes.json();

        if (captureData.status === 'COMPLETED') {
            // Place order in DB
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            const orderRes = await fetch('https://growcart.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items })
            });

            const orderData = await orderRes.json();

            // Record payment
            await fetch('https://growcart.onrender.com/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: orderData.order_id,
                    method: 'paypal'
                })
            });

            localStorage.removeItem('pendingCart');
            showToast('✅ Payment successful! Order placed!');
            setTimeout(() => {
                window.location.href = '/pages/home/content.html';
            }, 2000);
        }
    },

    onError: function(err) {
        showToast('Payment failed. Please try again!');
        console.error(err);
    }
}).render('#paypal-button-container');

async function confirmCOD() {
    const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
    }));

    try {
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

        await fetch('https://growcart.onrender.com/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                order_id: orderData.order_id,
                method: 'cod'
            })
        });

        localStorage.removeItem('pendingCart');
        showToast('✅ Order placed! Pay on delivery.');
        setTimeout(() => {
            window.location.href = '/pages/home/content.html';
        }, 2000);

    } catch (err) {
        showToast('Something went wrong!');
    }
}