import { serverUrl } from './config.js';
document.addEventListener("DOMContentLoaded", function () {
    var formRegister = document.querySelector('form');
    var registerEmailInput = document.getElementById('registerEmail');
    var registerPasswordInput = document.getElementById('registerPassword');
    var repeatPasswordInput = document.getElementById('repeatPassword');

    formRegister.addEventListener('submit', function (event) {
        event.preventDefault();

        var name = "juancito";
        var email = registerEmailInput.value;
        var password = registerPasswordInput.value;
        var repeatPassword = repeatPasswordInput.value;

        if (password !== repeatPassword) {
            console.error('Las contraseñas no coinciden');
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
            redirect: 'follow'
        };

        fetch(`${serverUrl}/api/register`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud de registro');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error en el registro:', error.message);

                alert('Error en el registro: El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.');
            });
    });
});
