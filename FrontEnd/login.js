document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            localStorage.setItem('authToken', token);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Email ou mot de passe incorrect';
        }
    } catch (error) {
        console.error('Erreur:', error);
        errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
    }
});

Login()
