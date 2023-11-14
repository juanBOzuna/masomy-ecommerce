document.addEventListener("DOMContentLoaded", function () {
    // Realiza la solicitud a la API de categorías
    fetch("http://127.0.0.1:8000/api/categories")
        .then(response => response.json())
        .then(categories => {
            // Renderiza las categorías en el acordeón y obtiene productos de la primera subcategoría
            renderAccordion(categories);
            addSubcategoryClickEvent();
        })
        .catch(error => console.error('Error al obtener categorías:', error));
});

function renderAccordion(categories) {
    const accordion = document.getElementById('accordion');

    // Verifica si hay al menos una categoría y una subcategoría
    if (categories.length > 0 && categories[0].subcategories.length > 0) {
        const firstCategory = categories[0];
        const firstSubcategory = firstCategory.subcategories[0];

        // Realiza la solicitud a la API de productos de la primera subcategoría
        fetch(`http://127.0.0.1:8000/api/products/subcategorie/${firstSubcategory.id}`)
            .then(response => response.json())
            .then(products => {
                // Renderiza las categorías en el acordeón
                renderAccordionItems(categories);

                // Renderiza los productos en la sección de productos
                renderProducts(products);

                // Agrega un evento de clic a los enlaces de subcategorías
                addSubcategoryClickEvent();
            })
            .catch(error => console.error('Error al obtener productos:', error));
    } else {
        // Si no hay categorías o subcategorías, solo renderiza las categorías en el acordeón
        const productsContainer = document.getElementById('productsContainer');
        productsContainer.innerHTML = "";
        renderAccordionItems(categories);
    }
}

function renderAccordionItems(categories) {
    categories.forEach(category => {
        // Genera un ID único para cada categoría y su contenido colapsable
        const categoryID = `category-${category.id}`;

        // Agrega la estructura HTML del acordeón para cada categoría
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
    // Agrega un evento de clic a los enlaces de subcategorías con la clase "href-sub-categories"
    const subcategoryLinks = document.querySelectorAll('.href-sub-categories');
    subcategoryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Obtiene la ID de la subcategoría desde el enlace
            // console.log(link.dataset.subcategoryid)
            const subcategoryId = link.dataset.subcategoryid;

            // Realiza la solicitud a la API de productos de la subcategoría seleccionada
            fetch(`http://127.0.0.1:8000/api/products/subcategorie/${subcategoryId}`)
                .then(response => response.json())
                .then(products => {
                    // Renderiza los nuevos productos en la sección principal
                    renderProducts(products);
                })
                .catch(error => console.error('Error al obtener productos:', error));
        });
    });
}

function renderProducts(products) {
    console.log('ye');
    // Renderiza los productos en la sección principal (ajusta según tu estructura HTML)
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = "";

    // Verifica si products es un array antes de intentar iterar sobre él
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
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>
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
    } else {
        // Manejar el caso donde no hay productos disponibles
        productsContainer.innerHTML = "<p>No hay productos disponibles en esta subcategoría.</p>";
    }
}
