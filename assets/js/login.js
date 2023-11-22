import { serverUrl } from './config.js';
document.addEventListener("DOMContentLoaded", function () {
    var formLogin = document.getElementById('form-login');
    var loginEmailInput = document.getElementById('loginEmail');
    var loginPasswordInput = document.getElementById('loginPassword');

    formLogin.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        var email = loginEmailInput.value;
        var password = loginPasswordInput.value;

        fetch(`${serverUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.accessToken) {
                    localStorage.setItem('userSession', JSON.stringify(data.user));
                    localStorage.setItem('accessToken', JSON.stringify({ "token": data.accessToken }));

                    window.location.href = 'index.html';
                } else {
                    alert('Inicio de sesión fallido. Verifica tu correo electrónico y contraseña.');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud Fetch:', error);
            });
    });
});