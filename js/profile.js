// Check if logged in
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
    window.location.href = '/pages/auth/login.html';
}

// Load user info
document.getElementById('profile-name').textContent = user.name;
document.getElementById('profile-email').textContent = user.email;
document.getElementById('detail-name').textContent = user.name;
document.getElementById('detail-email').textContent = user.email;
document.getElementById('detail-mobile').textContent = user.mobile || 'npp';

// Show section
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    if (id === 'orders') loadOrders();
    if (id === 'address') loadAddress();
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await response.json();
        const list = document.getElementById('orders-list');

        if (orders.length === 0) {
            list.innerHTML = '<p>No orders yet!</p>';
            return;
        }
        const activeOrders = orders.filter(order => order.status !== 'cancelled');

        if (activeOrders.length === 0) {
            list.innerHTML = '<p>No orders yet!</p>';
            return;
        }

        list.innerHTML = activeOrders.map(order => `
    <div class="order-card">
        <p><b>Order #${order.id}</b></p>
        <p>Total: $${order.total}</p>
        <p>Status: <span class="status ${order.status}">${order.status.replace('_', ' ')}</span></p>
        <p>Date: ${new Date(order.created_at).toLocaleDateString('en-US')}</p>
        ${order.status !== 'delivered' && order.status !== 'cancelled' ?
                `<button onclick="cancelOrder(${order.id})" class="cancel-btn">Cancel Order</button>`
                : ''}
    </div>
    `).join('');

    } catch (err) {
        document.getElementById('orders-list').innerHTML = '<p>Failed to load orders!</p>';
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/pages/home/content.html';
}

// Load address
async function loadAddress() {
    try {
        const res = await fetch('http://localhost:5000/api/addresses', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const addresses = await res.json();
        const section = document.getElementById('address');

        if (addresses.length === 0) {
            section.innerHTML = `
                <h3>My Address</h3>
                <p>No address saved yet.</p>
                ${addressForm()}
            `;
        } else {
            const a = addresses[0];
            section.innerHTML = `
                <h3>My Address</h3>
                <div class="order-card">
                    <p><b>${a.full_name}</b></p>
                    <p>${a.street}${a.apt ? ', ' + a.apt : ''}</p>
                    <p>${a.city}, ${a.state} ${a.zip}</p>
                    <p>📞 ${a.phone}</p>
                    <button onclick="deleteAddress(${a.id})" 
                        style="margin-top:12px; padding:8px 16px; background:#dc3c3c; 
                        color:white; border:none; border-radius:8px; cursor:pointer;">
                        Remove
                    </button>
                </div>
                <h4 style="margin-top:20px; margin-bottom:12px; color:#0d3d2b;">Add New Address</h4>
                ${addressForm()}
            `;
        }
    } catch (err) {
        console.error(err);
    }
}

// Address form HTML
function addressForm() {
    return `
        <div class="address-form">
            <input type="text" id="addr-name" placeholder="Full Name">
            <input type="text" id="addr-street" placeholder="Street Address">
            <input type="text" id="addr-apt" placeholder="Apt/Suite (optional)">
            <input type="text" id="addr-city" placeholder="City">
            <input type="text" id="addr-state" placeholder="State">
            <input type="text" id="addr-zip" placeholder="ZIP Code">
            <input type="tel" id="addr-phone" placeholder="Phone Number">
            <button onclick="saveAddress()">Save Address</button>
        </div>
    `;
}

// Save address
async function saveAddress() {
    const full_name = document.getElementById('addr-name').value;
    const street = document.getElementById('addr-street').value;
    const apt = document.getElementById('addr-apt').value;
    const city = document.getElementById('addr-city').value;
    const state = document.getElementById('addr-state').value;
    const zip = document.getElementById('addr-zip').value;
    const phone = document.getElementById('addr-phone').value;

    if (!full_name || !street || !city || !state || !zip || !phone) {
        alert('Please fill all required fields!');
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/addresses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ full_name, street, apt, city, state, zip, phone })
        });

        const data = await res.json();
        if (res.ok) {
            alert('✅ Address saved!');
            loadAddress();
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Something went wrong!');
    }
}

// Delete address
async function deleteAddress(id) {
    try {
        await fetch(`http://localhost:5000/api/addresses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadAddress();
    } catch (err) {
        alert('Something went wrong!');
    }
}

async function cancelOrder(id) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
        const res = await fetch(`http://localhost:5000/api/orders/cancel/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
            showToast('Order cancelled successfully!');
            loadOrders();
        } else {
            showToast(data.message);
        }
    } catch (err) {
        showToast('Something went wrong!');
    }
}

function showToast(message) {
    const toast = document.getElementById('toast') || createToast();
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => toast.style.opacity = '0', 2500);
}

function createToast() {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%;
        transform: translateX(-50%); background: #0d3d2b;
        color: white; padding: 12px 24px; border-radius: 24px;
        font-size: 0.9rem; opacity: 0; transition: opacity 0.3s ease;
        z-index: 9999; pointer-events: none;
    `;
    document.body.appendChild(toast);
    return toast;
}