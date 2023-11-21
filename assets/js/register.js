document.addEventListener("DOMContentLoaded", function () {
    // Obtén referencia al formulario y a los campos de entrada
    var formRegister = document.querySelector('form');
    var registerEmailInput = document.getElementById('registerEmail');
    var registerPasswordInput = document.getElementById('registerPassword');
    var repeatPasswordInput = document.getElementById('repeatPassword');

    // Agregar un evento de envío al formulario
    formRegister.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        // Obtener los valores de los campos de entrada
        var name = "juancito"; // Puedes agregar un campo para el nombre si es necesario
        var email = registerEmailInput.value;
        var password = registerPasswordInput.value;
        var repeatPassword = repeatPasswordInput.value;

        // Validar que las contraseñas coincidan
        if (password !== repeatPassword) {
            console.error('Las contraseñas no coinciden');
            // Puedes mostrar un mensaje de error en el formulario si lo deseas
            return;
        }

        // Configurar los encabezados de la solicitud
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        // Configurar las opciones de la solicitud
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

        // Realizar la solicitud de registro
        fetch("http://masomy-admin.test/api/register", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud de registro');
                }
                return response.json();
            })
            .then(data => {
                // Manejar la respuesta exitosa
                console.log(data);
                // Redirigir a la página de inicio de sesión
                window.location.href = 'login.html';
            })
            .catch(error => {
                // Manejar la respuesta de error
                console.error('Error en el registro:', error.message);

                // Mostrar un mensaje de error más amigable
                alert('Error en el registro: El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.');
            });
    });
});
