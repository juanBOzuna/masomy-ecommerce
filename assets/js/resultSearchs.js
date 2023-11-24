import { serverUrl } from "./config.js";
document.addEventListener('DOMContentLoaded', function () {
    const currentUrl = new URL(window.location.href);

    // Obtener el parámetro 'q'
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q') ?? '6000';
    const searchQuery = qParam;
    const searchResultsContainer = document.getElementById('search-results-container');

    // alert(searchResultsContainer)

    // Función para cargar y mostrar resultados
    function loadResults(page = 1) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search_query: searchQuery,
                page: page,
            }),
        };

        // const apiUrl = ;

        fetch(`${serverUrl}/api/performsearch`, requestOptions)
            .then(response => response.json())
            .then(data => {
                // Limpiar el contenedor antes de agregar nuevos resultados
                searchResultsContainer.innerHTML = '';

                if (data.data.length == 0) {
                    const resultElement = document.createElement('div');
                    resultElement.innerHTML = `
                    <div id="payment-reference-container" class="container py-3 text-center">
                    <p id="payment-reference-text" style="font-weight: bold; font-size: =20px; ">No se encontraron resultados...</p>
                </div>
                        `;
                    searchResultsContainer.appendChild(resultElement);
                }

                data.data.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('col-lg-4', 'mb-4');
                    resultElement.innerHTML = `
                            <div class="card h-100">
                                <img src="${serverUrl}/${result.picture}" class="card-img-top" alt="${result.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${result.name}</h5>
                                    <p class="card-text">${result.description}</p>
                                    <p class="card-text">Precio: $${result.price}</p>
                                    <button class="btn btn-success addToCart" productPicture="${result.picture}" productId="${result.id}" productName="${result.name}" productPrice="${result.price}" >Añadir al carrito</button>
                                
                                </div>
                            </div>
                        `;
                    searchResultsContainer.appendChild(resultElement);


                });


                const addToCartButtons = document.querySelectorAll('.addToCart');
                console.log(addToCartButtons)

                addToCartButtons.forEach(buttonAdd => {
                    buttonAdd.addEventListener('click', function (event) {
                        event.preventDefault();

                        const productId = buttonAdd.getAttribute('productId');
                        const productName = buttonAdd.getAttribute('productName');
                        const productPrice = parseFloat(buttonAdd.getAttribute('productPrice'));
                        const productPicture = `${serverUrl}/` + buttonAdd.getAttribute('productPicture');

                        const product = { id: productId, name: productName, price: productPrice, picture: productPicture };
                        // console.log(product)
                        addToCart(product);
                    });
                });
                // Actualizar los botones de paginación
                updatePagination(data.total_pages, data.current_page);
            })
            .catch(error => console.error('Error:', error));



    }


    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
            console.log('yes')
        } else {
            console.log('no yes')
            cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, picture: product.picture });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        const cartButton = document.getElementById('btn-view-cart');
        cartButton.classList.add('cart-added');

        setTimeout(() => {
            cartButton.classList.remove('cart-added');

        }, 100);
    }



    function updatePagination(totalPages, currentPage) {
        const paginationContainer = document.querySelector('.pagination');

        paginationContainer.innerHTML = '';

        const prevButton = createPaginationButton('Anterior', currentPage - 1);
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, i);
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = createPaginationButton('Siguiente', currentPage + 1);
        paginationContainer.appendChild(nextButton);
    }

    // Función para crear botones de paginación de manera dinámica
    function createPaginationButton(text, page) {
        const button = document.createElement('li');
        button.classList.add('page-item');
        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#';
        link.textContent = text;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            loadResults(page);
        });
        button.appendChild(link);
        return button;
    }


    // Cargar resultados iniciales (página 1)
    loadResults();
});
