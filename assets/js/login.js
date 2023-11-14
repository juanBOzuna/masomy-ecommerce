
document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencia al formulario y a los campos de entrada
    var formLogin = document.getElementById('form-login');
    var loginEmailInput = document.getElementById('loginEmail');
    var loginPasswordInput = document.getElementById('loginPassword');

    // Agregar un evento de envío al formulario
    formLogin.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        // Obtener los valores de los campos de entrada
        var email = loginEmailInput.value;
        var password = loginPasswordInput.value;

        // Realizar la solicitud Fetch al API de inicio de sesión
        fetch('http://127.0.0.1:8000/api/login', {
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
                // Verificar si la respuesta contiene un token
                if (data.accessToken) {
                    // Almacenar la información del usuario y el token en el localStorage
                    localStorage.setItem('userSession', JSON.stringify(data.user));
                    localStorage.setItem('accessToken', data.accessToken);

                    // Redirigir a la página deseada (puedes cambiar esto según tus necesidades)
                    window.location.href = 'index.html';
                } else {
                    // Manejar el caso de inicio de sesión fallido
                    alert('Inicio de sesión fallido. Verifica tu correo electrónico y contraseña.');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud Fetch:', error);
            });
    });
});