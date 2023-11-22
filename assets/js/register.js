import { serverUrl } from './config.js';
document.addEventListener("DOMContentLoaded", function () {

    var formRegister = document.querySelector('form');
    var registerEmailInput = document.getElementById('registerEmail');
    var registerPhoneInput = document.getElementById('registerPhone');
    var registerPasswordInput = document.getElementById('registerPassword');
    var repeatPasswordInput = document.getElementById('repeatPassword');

    document.getElementById('registerPhone').addEventListener('input', function (event) {
        // Eliminar caracteres no numéricos
        this.value = this.value.replace(/\D/g, '');
    
        // Asegurarse de que la longitud no exceda 10 dígitos
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });

    formRegister.addEventListener('submit', function (event) {
        event.preventDefault();

        var name = "juancito";
        var email = registerEmailInput.value;
        var phone = registerPhoneInput.value;
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
                phone_number: phone,
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

                // alert('Error en el registro: El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.');
            });
    });
});
