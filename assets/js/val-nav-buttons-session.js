
document.addEventListener("DOMContentLoaded", function () {
    var btnLogin = document.querySelector('.nav-item .nav-link[href="login.html"]');
    var btnRegister = document.querySelector('.nav-item .nav-link[href="register.html"]');
    var btnProfile = document.getElementById('btn-view-profile');
    var btnLogout = document.getElementById('btn-logout');

    var userSession = localStorage.getItem('userSession');

    if (userSession) {

        btnLogin.style.display = 'none';
        btnRegister.style.display = 'none';


        btnProfile.style.display = 'inline-block';
        btnLogout.style.display = 'inline-block';
    } else {

        btnProfile.style.display = 'none';
        btnLogout.style.display = 'none';


        btnLogin.style.display = 'inline-block';
        btnRegister.style.display = 'inline-block';
    }

    btnLogout.addEventListener('click', function () {
        localStorage.removeItem('userSession');

        window.location.reload();

    });
});