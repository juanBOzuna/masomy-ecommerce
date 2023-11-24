import { serverUrl } from "./config";
document.addEventListener('DOMContentLoaded', function () {
    var buttonGenerateLink = document.querySelector('#btn_generar_link');
    var containerCountableDetails = document.querySelector('#container_countable_details');
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
                    <hr/>
                    <p class="card-text py-0" style="margin:0px; font-size:16px !important;" >Precio Unitario: $${product.price}</p>
                    <p class="card-text py-0" style="margin:0px; font-size:16px !important;" >Cantidad: ${product.quantity}</p>
                    <p class="card-text py-0" style="margin:0px; font-size:16px !important;" >Subtotal: $${(product.subtotal)}</p>
                    <p class="card-text py-0" style="margin:0px; font-size:16px !important;" >Descuento: ${(product.discountPercentaje)}%</p>
                    <p class="card-text py-0" style="margin:0px; font-size:16px !important;" >Total Descuento: $${(product.discount)}</p>
                    <p class="card-text py-0" style="margin:0px; font-size:16px !important; color:green;font-weight: bold !important ; " >Total: $${(product.total)}</p>
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
            // product.quantity++;

            const existingProduct = cartProducts.find(item => item.id === product.id);
            actProduct(existingProduct)
        });

        const subtractButton = card.querySelector('.btn-subtract');
        subtractButton.addEventListener('click', function () {
            const existingProduct = cartProducts.find(item => item.id === product.id);
            actProduct(existingProduct, 'rest')
        });

        const removeButton = card.querySelector('.btn-remove');
        removeButton.addEventListener('click', function () {
            const existingProduct = cartProducts.find(item => item.id === product.id);
            actProduct(existingProduct, 'delete')
        });

        return card;
    }

    function actProduct(existingProduct, action = 'sum') {

        const alterCountableDetail = { subtotal: 0, total: 0, totalDiscountAmmount: 0 };
        let cartCountableDetails = JSON.parse(localStorage.getItem("cart_countable_details")) || {}

        if (cartCountableDetails.total == null || cartCountableDetails.subtotal == null || cartCountableDetails.totalDiscountAmmount == null) {
            cartCountableDetails = alterCountableDetail;
        }

        console.log(existingProduct.discountPercentaje)

        let valDelete = false;

        if (action == 'sum') {
            existingProduct.quantity += 1;
        } else if (action == 'rest') {
            if (existingProduct.quantity == 1) {
                valDelete = true
            } else {
                existingProduct.quantity -= 1;
            }
        } else if (action == 'delete') {
            valDelete = true;
        }

        if (!valDelete) {
            let subtotal = existingProduct.price * existingProduct.quantity;
            console.log('suubt' + ((subtotal) * parseFloat(existingProduct.discountPercentaje)) / 100)
            let discount = (((subtotal) * parseFloat(existingProduct.discountPercentaje)) / 100);
            let total = subtotal - discount;

            cartCountableDetails.subtotal -= existingProduct.subtotal;
            cartCountableDetails.totalDiscountAmmount -= existingProduct.discount;
            cartCountableDetails.total -= existingProduct.total;

            existingProduct.subtotal = subtotal;
            existingProduct.discountPercentaje = parseFloat(existingProduct.discountPercentaje);
            existingProduct.discount = discount;
            existingProduct.total = total
            cartCountableDetails.subtotal += subtotal;
            cartCountableDetails.totalDiscountAmmount += discount;
            cartCountableDetails.total += total;
        } else {
            cartCountableDetails.subtotal -= existingProduct.subtotal;
            cartCountableDetails.totalDiscountAmmount -= existingProduct.discount;
            cartCountableDetails.total -= existingProduct.total;
            cartProducts = cartProducts.filter(p => p.id !== existingProduct.id);
        }



        localStorage.setItem("cart", JSON.stringify(cartProducts));
        localStorage.setItem("cart_countable_details", JSON.stringify(cartCountableDetails));

        cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

        renderProducts()
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

            const alterCountableDetail = { subtotal: 0, total: 0, totalDiscountAmmount: 0 };
            let cartCountableDetails = JSON.parse(localStorage.getItem("cart_countable_details")) || {}

            if (cartCountableDetails.total == null || cartCountableDetails.subtotal == null || cartCountableDetails.totalDiscountAmmount == null) {
                cartCountableDetails = alterCountableDetail;
            }
            document.querySelector('#totalCompra').innerText = 'TOTAL: ' + cartCountableDetails.total;
            document.querySelector('#descuentoCompra').innerText = 'DESCUENTO: ' + cartCountableDetails.totalDiscountAmmount;
            document.querySelector('#subtotalCompra').innerText = 'SUBTOTAL: ' + cartCountableDetails.subtotal;

            emptyCartMessage.style.display = "none";
            buttonGenerateLink.style.display = "block";
            containerCountableDetails.style.display = "block";
            containerCountableDetails.style.display = "block";
        } else {
            buttonGenerateLink.style.display = "none";
            containerCountableDetails.style.display = "none";
            containerCountableDetails.style.display = "none";
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
            containerCountableDetails.style.display = "none";
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
                    console.log(result);
                    document.getElementById('loadingSpinner').classList.add('d-none');

                    document.getElementById("payment-reference-container").style.display = "block";
                    // document.getElementById("payment-reference-text").innerText = "Referencia de Pago: " + result.payment_reference;
                    document.getElementById("reference-code").innerText =  result.payment_reference;


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



