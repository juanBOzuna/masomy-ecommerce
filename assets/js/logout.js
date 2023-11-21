import { serverUrl } from './config.js';
document.addEventListener("DOMContentLoaded", function () {
    var btnLogout = document.getElementById('btn-logout');

    btnLogout.addEventListener('click', function () {
        var tuTokenDeAcceso = localStorage.getItem('accessToken');

        if (!tuTokenDeAcceso) {
            console.error('Token de acceso no encontrado en el localStorage');
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", "Bearer " + tuTokenDeAcceso);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${serverUrl}/api/logout`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (response.ok) {
                    console.log(data);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userSession');
                    window.location.href = '/';
                } else {
                    console.error('Error en el logout:', response.status, data.message);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud Fetch:', error);
            });
    });
});
