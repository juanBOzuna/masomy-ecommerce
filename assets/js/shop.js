import { serverUrl } from './config.js';
document.addEventListener("DOMContentLoaded", function () {
    fetch(`${serverUrl}/api/categories`)
        .then(response => response.json())
        .then(categories => {
            renderAccordion(categories);
            addSubcategoryClickEvent();
        })
        .catch(error => console.error('Error al obtener categorías:', error));



    function renderAccordion(categories) {
        const accordion = document.getElementById('accordion');

        if (categories.length > 0 && categories[0].subcategories.length > 0) {
            const firstCategory = categories[0];
            const firstSubcategory = firstCategory.subcategories[0];

            fetch(`${serverUrl}/api/products/subcategorie/${firstSubcategory.id}`)
                .then(response => response.json())
                .then(products => {
                    renderAccordionItems(categories);

                    renderProducts(products);

                    addSubcategoryClickEvent();
                })
                .catch(error => console.error('Error al obtener productos:', error));
        } else {
            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = "";
            renderAccordionItems(categories);
        }
    }



});



function renderAccordionItems(categories) {
    categories.forEach(category => {
        const categoryID = `category-${category.id}`;

        accordion.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="${categoryID}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${categoryID}">
                        ${category.name}
                    </button>
                </h2>
                <div id="collapse-${categoryID}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <ul class="list-unstyled">
                            ${renderSubcategories(category.subcategories)}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });
}

function renderSubcategories(subcategories) {
    return subcategories.map(subcategory => `
        <li>
            <a href="#" data-subcategoryId="${subcategory.id}" class="href-sub-categories">
                ${subcategory.name}
            </a>
        </li>
    `).join('');
}

function addSubcategoryClickEvent() {
    const subcategoryLinks = document.querySelectorAll('.href-sub-categories');
    subcategoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const subcategoryId = link.dataset.subcategoryid;

            fetch(`${serverUrl}/api/products/subcategorie/${subcategoryId}`)
                .then(response => response.json())
                .then(products => {
                    renderProducts(products);
                })
                .catch(error => console.error('Error al obtener productos:', error));
        });
    });
}

function renderProducts(products) {
    console.log('ye');
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = "";




    if (Array.isArray(products)) {
        products.forEach(product => {
            // const productElement = document.createElement('div');
            var htmlProductActual = `
            <div class="col-md-4">
                <div class="card mb-4 product-wap rounded-0">
                    <!-- Estructura del producto (ajusta según tu diseño) -->
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${serverUrl}/${product.picture}" alt="${product.name}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li class="open-rating-modal"  productId="${product.id}" ><a class="btn btn-success text-white" href="#"><i class="far fa-heart"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" TARGET="_BLANK"  href="shop-single.html?product_id=${product.id}"  ><i class="far fa-eye"></i></a></li>
                                <li id="add-to-cart" productPicture="${product.picture}" productDiscount="${product.discount}" productId="${product.id}" productName="${product.name}" productPrice="${product.price}"  ><a class="btn btn-success text-white mt-2"><i  class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html" class="h3 text-decoration-none">${product.name}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li>${product.description}</li>
                            <li class="pt-2">
                                <!-- Puedes agregar más detalles aquí -->
                            </li>
                        </ul>
                        <ul class="list-unstyled d-flex justify-content-center mb-1">
                            <li>
                                <!-- Puedes agregar más detalles aquí -->
                            </li>
                        </ul>
                        <p class="text-center mb-0">$${product.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            `;
            productsContainer.innerHTML += htmlProductActual;
        });

        document.querySelectorAll('.open-rating-modal').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault(); // Evita que el enlace siga el 
                const productId = link.getAttribute('productId')
                document.querySelector('#product_id_modal_calificar').value = productId;
                $('#ratingModal').modal('show');
            });
        });



        const addToCartLinks = document.querySelectorAll('#add-to-cart');
        addToCartLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const productId = link.getAttribute('productId');
                const productName = link.getAttribute('productName');
                const productPrice = parseFloat(link.getAttribute('productPrice'));
                const productDiscount = parseFloat(link.getAttribute('productDiscount'));
                const productPicture = `${serverUrl}/` + link.getAttribute('productPicture');

                const product = { id: productId, name: productName, price: productPrice, discount: productDiscount, picture: productPicture };

                addToCart(product);
            });
        });
    } else {
        productsContainer.innerHTML = "<p>No hay productos disponibles en esta subcategoría.</p>";
    }
}


document.getElementById('enviarCalificacionBtn').addEventListener('click', function () {
    var selectedRating = document.querySelectorAll('#ratingStars .text-warning').length;
    var message = document.getElementById('message').value;
    var productId = document.querySelector('#product_id_modal_calificar').value

    if (selectedRating === 0) {
        alert('Por favor, selecciona una calificación.');
        return;
    }

    if (message.trim() === '') {
        alert('Por favor, ingresa un mensaje.');
        return;
    }

    var userSession = localStorage.getItem('userSession');

    if (!userSession) {
        alert('Debe Loguearse Primero');
        window.location.href = 'login.html'
    } else {
        console.log('vamo bien')
        this.style.display = 'none';
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer 35|FyrkaqTOljZvizC6gFTCxaUuxnVZOj43Fyz86S4x");

        var raw = JSON.stringify({
            "rating": selectedRating,
            "comment": message,
            "product_id": productId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        // document.getElementById('loadingSpinner').classList.add('d-none');
        fetch("http://127.0.0.1:8000/api/valorations/create", requestOptions)
            .then(response => response.text())
            .then(result => {
                result = JSON.parse(result)
                // if (result.success) {
                // console.log(result)
                document.querySelector('#modal-body-calificar').innerHTML = ` <input type="hidden" name="product_id" id="product_id_modal_calificar">
                <p>Selecciona tu calificación:</p>
                <!-- Modifica el HTML de las estrellas directamente en el modal -->
                <div id="ratingStars" class="rating-stars">
                    <i class="text-muted fa fa-star" data-rating="1" onmouseover="handleStarHover(this)"
                        onclick="handleStarClick(this)"></i>
                    <i class="text-muted fa fa-star" data-rating="2" onmouseover="handleStarHover(this)"
                        onclick="handleStarClick(this)"></i>
                    <i class="text-muted fa fa-star" data-rating="3" onmouseover="handleStarHover(this)"
                        onclick="handleStarClick(this)"></i>
                    <i class="text-muted fa fa-star" data-rating="4" onmouseover="handleStarHover(this)"
                        onclick="handleStarClick(this)"></i>
                    <i class="text-muted fa fa-star" data-rating="5" onmouseover="handleStarHover(this)"
                        onclick="handleStarClick(this)"></i>
                </div>
                <div class="mb-3">
                    <textarea class="form-control mt-1" id="message" name="message" placeholder="Mensaje" rows="8"
                        required></textarea>
                </div>`;
                alert(result.message)
                $('#ratingModal').modal('hide');
                // }
            })
            .catch(error => console.log('error', error));
    }
});


function addToCart(product) {
    console.log('last yes')
    const alterCountableDetail = { subtotal: 0, total: 0, totalDiscountAmmount: 0 };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountableDetails = JSON.parse(localStorage.getItem("cart_countable_details")) || {}

    if (cartCountableDetails.total == null || cartCountableDetails.subtotal == null || cartCountableDetails.totalDiscountAmmount == null) {
        cartCountableDetails = alterCountableDetail;
    }
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
        let subtotal = existingProduct.price * existingProduct.quantity;
        let discount = (((subtotal) * product.discount) / 100);
        let total = subtotal - discount;

        cartCountableDetails.subtotal -= existingProduct.subtotal;
        cartCountableDetails.totalDiscountAmmount -= existingProduct.discount;
        cartCountableDetails.total -= existingProduct.total;

        existingProduct.subtotal = subtotal;
        existingProduct.discountPercentaje = product.discount;
        existingProduct.discount = discount;
        existingProduct.total = total

        cartCountableDetails.subtotal += subtotal;
        cartCountableDetails.totalDiscountAmmount += discount;
        cartCountableDetails.total += total;

        // console.log('yes')
    } else {
        console.log('no yes')
        let subtotal = product.price * 1;
        let discount = (((subtotal) * product.discount) / 100);
        let total = subtotal - discount;
        cartCountableDetails.subtotal += subtotal;
        cartCountableDetails.totalDiscountAmmount += discount;
        cartCountableDetails.total += total;

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: subtotal,
            discountPercentaje: product.discount,
            discount: discount,
            total: total,
            picture: product.picture
        });


    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cart_countable_details", JSON.stringify(cartCountableDetails));

    const cartButton = document.getElementById('btn-view-cart');
    cartButton.classList.add('cart-added');

    setTimeout(() => {
        cartButton.classList.remove('cart-added');

    }, 100);


    updateCartView();
}

// document.getElementById('openRatingModalBtn').addEventListener('click', function () {
//     $('#ratingModal').modal('show');
// });

function updateCartView() {
}


// Elimina la generación dinámica de estrellas en JavaScript



// Resto del código permanece igual
