
document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencia a los elementos del DOM
    var btnLogin = document.querySelector('.nav-item .nav-link[href="login.html"]');
    var btnRegister = document.querySelector('.nav-item .nav-link[href="register.html"]');
    var btnProfile = document.getElementById('btn-view-profile');
    var btnLogout = document.getElementById('btn-logout');

    // Verificar si hay una sesión activa en el localStorage
    var userSession = localStorage.getItem('userSession');

    if (userSession) {
        // Si hay una sesión activa, ocultar botones de inicio de sesión y registro
        btnLogin.style.display = 'none';
        btnRegister.style.display = 'none';

        // Mostrar el botón de perfil y de deslogueo
        btnProfile.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
    } else {
        // Si no hay una sesión activa, ocultar botón de perfil y deslogueo
        btnProfile.style.display = 'none';
        btnLogout.style.display = 'none';

        // Mostrar botones de inicio de sesión y registro
        btnLogin.style.display = 'inline-block';
        btnRegister.style.display = 'inline-block';
    }

    // Agregar un evento de clic al botón de deslogueo para eliminar la sesión del localStorage
    btnLogout.addEventListener('click', function () {
        localStorage.removeItem('userSession');
        // Actualizar la página o redirigir a la página de inicio de sesión, según tus necesidades
        window.location.reload();
        // O puedes redirigir a la página de inicio de sesión con window.location.href = 'login.html';
    });
});