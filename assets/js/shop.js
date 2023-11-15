document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:8000/api/categories")
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

            fetch(`http://127.0.0.1:8000/api/products/subcategorie/${firstSubcategory.id}`)
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

            fetch(`http://127.0.0.1:8000/api/products/subcategorie/${subcategoryId}`)
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
            const productElement = document.createElement('div');
            productElement.innerHTML = `
            <div class="col-md-4">
                <div class="card mb-4 product-wap rounded-0">
                    <!-- Estructura del producto (ajusta según tu diseño) -->
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="http://localhost/masomy/public/${product.picture}" alt="${product.name}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" TARGET="_BLANK"  href="shop-single.html?product_id=${product.id}"  ><i class="far fa-eye"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2"><i productPicture="${product.picture}" productId="${product.id}" productName="${product.name}" productPrice="${product.price}" id="add-to-cart"  class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html" class="h3 text-decoration-none">${product.name}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li>${product.stock}</li>
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
            productsContainer.appendChild(productElement);
        });

        const addToCartLinks = document.querySelectorAll('#add-to-cart');
        addToCartLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                const productId = link.getAttribute('productId');
                const productName = link.getAttribute('productName');
                const productPrice = parseFloat(link.getAttribute('productPrice'));
                const productPicture = "http://localhost/masomy/public/" + link.getAttribute('productPicture');

                const product = { id: productId, name: productName, price: productPrice, picture: productPicture };

                addToCart(product);
            });
        });
    } else {
        productsContainer.innerHTML = "<p>No hay productos disponibles en esta subcategoría.</p>";
    }
}


function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, picture: product.picture });
    }

    localStorage.setItem("cart", JSON.stringify(cart));


    updateCartView();
}

// Agrega un evento de clic al enlace "add-to-cart"


// Función para actualizar la visualización del carrito (puedes personalizar según tus necesidades)
function updateCartView() {
}