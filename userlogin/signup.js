async function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Basic validation
    if (!name || !email || !mobile || !password) {
        document.getElementById('error-msg').textContent = 'All fields are required!';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('error-msg').textContent = 'Passwords do not match!';
        return;
    }

    try {
        const response = await fetch('https://growcart.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, mobile, password })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('success-msg').textContent = 'Account created! Redirecting to login...';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            document.getElementById('error-msg').textContent = data.message;
        }

    } catch (err) {
        document.getElementById('error-msg').textContent = 'Something went wrong!';
    }
}