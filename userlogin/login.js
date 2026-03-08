async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.is_admin) {
                window.location.href = '/pages/admin/dashboard.html';
            } else {
                window.location.href = '/pages/home/content.html';
            }
        } else {
            document.getElementById('error-msg').textContent = data.message;
        }

    } catch (err) {
        document.getElementById('error-msg').textContent = 'Something went wrong!';
    }
}