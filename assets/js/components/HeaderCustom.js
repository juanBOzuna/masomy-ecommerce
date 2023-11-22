import { serverUrl } from '../config.js';

class HeaderCustom extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light shadow">
                <div class="container d-flex justify-content-between align-items-center">

                    <a class="navbar-brand text-success logo h1 align-self-center" href="index.html">
                        Masomy
                    </a>

                    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                        data-bs-target="#templatemo_main_nav" aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="align-self-center collapse navbar-collapse flex-fill  d-lg-flex justify-content-lg-between"
                        id="templatemo_main_nav">
                        <div class="flex-fill">
                            <ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="index.html">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="about.html">Sobre Nosotros</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="shop.html">Tienda</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="contact.html">Contacto</a>
                                </li>
                            </ul>
                        </div>
                        <div class="navbar align-self-center d-flex">
                            <div class="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="inputMobileSearch" placeholder="Search ...">
                                    <div class="input-group-text">
                                        <i class="fa fa-fw fa-search"></i>
                                    </div>
                                </div>
                            </div>
                            <a class="nav-icon d-none d-lg-inline" href="#" data-bs-toggle="modal"
                                data-bs-target="#templatemo_search">
                                <i class="fa fa-fw fa-search text-dark mr-2"></i>
                            </a>
                            <a class="nav-icon position-relative text-decoration-none" target="_blank" id="btn-view-cart" href="cart.html">
                                <i class="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                                <!-- <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">7</span> -->
                            </a>
                            <a class="nav-icon position-relative text-decoration-none" href="profile.html"
                                data-bs-target="#profileModal" id="btn-view-profile" href="#">
                                <i class="fa fa-fw fa-user text-dark mr-3"></i>
                                <!-- <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">+99</span> -->
                            </a>

                            <div class="flex-fill">
                                <ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                                    <li class="nav-item">
                                        <a class="nav-link" href="login.html">Iniciar Sesion</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="register.html">Registrarme</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" id="btn-logout" href="#">Logout</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="profileModalLabel">Perfil de Usuario</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <!-- Agrega aquí la imagen del perfil -->
                                    <img src="https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg"
                                        alt="Perfil del usuario" class="img-fluid">

                                    <!-- Botón para desloguearse -->
                                    <button type="button" class="btn btn-danger mt-3" id="btn-logout">Desconectarse</button>

                                    <!-- Botón para ir al perfil -->
                                    <a href="enlace_al_perfil" class="btn btn-primary mt-3">Ir a mi perfil</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>`;

        var btnLogin = this.querySelector('.nav-item .nav-link[href="login.html"]');
        var btnRegister = this.querySelector('.nav-item .nav-link[href="register.html"]');
        var btnProfile = this.querySelector('#btn-view-profile');
        var btnLogout = this.querySelector('#btn-logout');

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

        // btnLogout.addEventListener('click', function () {
        //     localStorage.removeItem('userSession');
        //     window.location.reload();
        // });






        var btnLogout = document.getElementById('btn-logout');

        btnLogout.addEventListener('click', function () {
            var tuTokenDeAcceso = JSON.parse(localStorage.getItem('accessToken')).token;
            // alert(tuTokenDeAcceso)
            if (!tuTokenDeAcceso) {
                console.error('Token de acceso no encontrado ')

                localStorage.removeItem('accessToken');
                localStorage.removeItem('userSession');
                window.location.reload();
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
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userSession');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error en la solicitud Fetch:', error);
                });
        });


    }
}

window.customElements.define("header-custom", HeaderCustom);