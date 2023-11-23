import { serverUrl } from "./config";
document.addEventListener('DOMContentLoaded', function () {
    var buttonGenerateLink = document.querySelector('#btn_generar_link');
    var containerButtons = document.querySelector('#container_buttons_payment');
    // console.log


    let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

    const cartContainer = document.getElementById('cart-container');
    let emptyCartMessage = document.getElementById('empty-cart-message');
    renderProducts();


    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('col-lg-4', 'mb-4');
        card.innerHTML = `
            <div class="card h-100">
                <img src="${product.picture}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Precio: $${product.price}</p>
                    <p class="card-text">Cantidad: ${product.quantity}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger btn-remove">Eliminar</button>
                    <button class="btn btn-success btn-add">Agregar</button>
                    <button class="btn btn-warning btn-subtract">Quitar</button>
                </div>
            </div>
        `;

        const addButton = card.querySelector('.btn-add');
        addButton.addEventListener('click', function () {
            product.quantity++;
            updateLocalStorage();
            updateCardQuantity(card, product.quantity);
        });

        const subtractButton = card.querySelector('.btn-subtract');
        subtractButton.addEventListener('click', function () {
            if (product.quantity > 0) {
                product.quantity--;
                updateLocalStorage();
                updateCardQuantity(card, product.quantity);

                if (product.quantity === 0) {
                    cartProducts = cartProducts.filter(p => p !== product);
                    updateLocalStorage();
                    cartContainer.removeChild(card);
                }

                renderProducts();
            }
        });

        const removeButton = card.querySelector('.btn-remove');
        removeButton.addEventListener('click', function () {
            cartProducts = cartProducts.filter(p => p !== product);
            updateLocalStorage();
            cartContainer.removeChild(card);

            renderProducts();
        });

        return card;
    }

    function updateCardQuantity(card, quantity) {
        const quantityElement = card.querySelector('.card-text:last-child');
        quantityElement.innerText = `Cantidad: ${quantity}`;
    }

    function updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }

    function renderProducts() {
        cartContainer.innerHTML = ' <p id="empty-cart-message" class="text-center">El carrito está vacío</p>';
        emptyCartMessage = document.getElementById('empty-cart-message');
        if (cartProducts.length != 0) {
            console.log(cartProducts.length)
            cartProducts.forEach(product => {
                const productCard = createProductCard(product);
                cartContainer.appendChild(productCard);
            });
            emptyCartMessage.style.display = "none";
            buttonGenerateLink.style.display = "block";
        } else {
            buttonGenerateLink.style.display = "none";
            emptyCartMessage.style.display = 'block';
        }
    }

    buttonGenerateLink.addEventListener('click', function () {

        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        let accessToken = JSON.parse(localStorage.getItem('accessToken')) || "";
        // alert(accessToken);
        if (accessToken != "") {
            accessToken = accessToken.token;
            const requestBody = {
                products: cartItems.map(item => ({
                    id: parseInt(item.id),
                    quantity: item.quantity
                }))
            };
            var myHeaders = new Headers();
            myHeaders.append("Accept", "application/json");
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + accessToken);

            console.log(JSON.stringify({
                "products": [
                    {
                        "id": 4,
                        "quantity": 2
                    }
                ]
            }))

            console.log(JSON.stringify(requestBody))

            var raw = JSON.stringify(requestBody);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            this.style.display = "none";
            document.getElementById('loadingSpinner').classList.remove('d-none');


            fetch(`${serverUrl}/api/generatePayMentLink`, requestOptions)
                .then(response => {
                    document.getElementById('loadingSpinner').classList.add('d-none');
                    if (!response.ok) {
                        if (response.status === 401) {
                            // localStorage.removeItem('accessToken');
                            // localStorage.removeItem('userSession');
                            alert('Necesita volver a Loguearse');
                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        } else if (response.status === 422) {
                            alert('Hay productos en tu carrito que no existen o estan inactivos');
                        } else {
                            throw new Error(response.statusText);
                        }
                    }

                    return response.json()
                })
                .then(result => {
                    document.getElementById('loadingSpinner').classList.add('d-none');

                    console.log(result.url)
                    containerButtons.innerHTML += ` <button id="btn_pagar" class="btn btn-success w-100" >Pagar!</button>`;

                    let btnPagar = document.querySelector('#btn_pagar');
                    btnPagar.addEventListener('click', function () {
                        window.open(result.url, '_blank');
                    });

                })
                .catch(error => {
                    document.getElementById('loadingSpinner').classList.add('d-none');
                    if (error instanceof TypeError) {
                        console.log('Error de red o conexión.');
                    } else {
                        error.json().then(errorMessage => {
                            // Manejar el mensaje de error
                            console.log('Error:', errorMessage);
                        });
                    }
                });
        } else {
            // buttonGenerateLink.style.display = "block";
            alert('Necesita loguearse primero')
            setTimeout(function () {
                window.location.href = 'login.html';
            }, 1000);
        }

    });


    window.addEventListener('focus', function () {
        cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
        renderProducts()
    });


});



