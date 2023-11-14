
document.addEventListener("DOMContentLoaded", function () {
    // Obtén referencia al botón de logout
    var btnLogout = document.getElementById('btn-logout');

    // Agregar un evento de clic al botón de logout
    btnLogout.addEventListener('click', function () {
        // Obtén el token de acceso almacenado en el localStorage
        var tuTokenDeAcceso = localStorage.getItem('accessToken');

        // Si el token de acceso no está presente, maneja el caso según tus necesidades
        if (!tuTokenDeAcceso) {
            console.error('Token de acceso no encontrado en el localStorage');
            return;
        }

        // Configura los encabezados de la solicitud
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + tuTokenDeAcceso);

        // Configura las opciones de la solicitud
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        // Realiza la solicitud de deslogueo
        fetch("http://127.0.0.1:8000/api/logout", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (response.ok) {
                    // Maneja la respuesta exitosa
                    console.log(data);
                    // Borra del localStorage los datos relacionados con la sesión
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userSession');
                    // Redirige a la página de inicio o realiza otras acciones según tus necesidades
                    window.location.href = '/';
                } else {
                    // Maneja la respuesta de error
                    console.error('Error en el logout:', response.status, data.message);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud Fetch:', error);
            });
    });
});
