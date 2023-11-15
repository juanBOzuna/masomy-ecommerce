document.addEventListener('DOMContentLoaded', function () {
    // Obtén el parámetro del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    // Si no hay un ID de producto en la URL, puedes manejar este caso según tus necesidades
    if (!productId) {
        console.error('Product ID not found in the URL');
        return;
    }

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`http://127.0.0.1:8000/api/products/${productId}`, requestOptions)
        .then(response => response.json())
        .then(product => {
            // Actualiza el contenido de la página con la información del producto
            document.getElementById('product_id').value = productId;
            document.getElementById('product_name').value = product.name;
            document.getElementById('product_picture').value = product.picture;
            document.getElementById('product-detail').src = "http://localhost/masomy/public/" + product.picture;
            document.querySelector('.h2').innerText = product.name;
            document.querySelector('#product_description').innerText = product.description;
            document.querySelector('.h3').innerText = `$${product.price.toFixed(2)}`;

            // Agrega las estrellas
            const starsContainer = document.querySelector('.contain-stars');
            starsContainer.innerHTML = "";
            const rating = product.average_rating;
            const fullStars = Math.floor(rating);
            const halfStar = rating - fullStars >= 0.5 ? 1 : 0;

            for (let index = 0; index < 5; index++) {
                if (index < fullStars) {
                    starsContainer.innerHTML += '<i class="fa fa-star text-warning"></i>';
                } else if (index === fullStars && halfStar) {
                    starsContainer.innerHTML += '<i class="fa fa-star-half-o text-warning"></i>';
                } else {
                    starsContainer.innerHTML += '<i class="fa fa-star text-secondary"></i>';
                }
            }

            starsContainer.innerHTML += ' <span class="list-inline-item text-dark">Rating ' + rating + ' | ' + product.total_reviews + ' Calificaciones</span>';


            const addToCartForm = document.querySelector('#form-add-to-cart');

            // Agrega un evento de envío al formulario
            addToCartForm.addEventListener('submit', function (event) {
                event.preventDefault();

                // Obtiene los valores necesarios del formulario
                const productId = document.getElementById('product_id').value;
                const productName = document.getElementById('product_name').value;
                const productPicture = document.getElementById('product_picture').value;
                const quantity = parseInt(document.getElementById('var-value').innerText, 10);

                // Crea un objeto que representa el producto
                const product = {
                    id: productId,
                    name: productName,
                    quantity: quantity,
                    picture: productPicture
                    // Puedes agregar más propiedades según sea necesario
                };

                // Llama a la función addToCart para agregar el producto al carrito
                addToCart(product);

                // Puedes redirigir al usuario a otra página o realizar otras acciones después de agregar al carrito
                // window.location.href = 'ruta_a_tu_pagina_de_carrito.html';
            });

            // ... actualiza otros elementos del HTML según la estructura de tu respuesta API
        })
        .catch(error => console.log('error', error));




});


function addToCart(product) {
    // Obtiene el carrito actual del Local Storage o inicializa un nuevo array si no existe
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Verifica si el producto ya está en el carrito
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        // Si el producto ya está en el carrito, incrementa la cantidad
        existingProduct.quantity += 1;
    } else {
        // Si el producto no está en el carrito, agrégalo con una cantidad de 1
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, picture: product.picture });
    }

    // Guarda el carrito actualizado en el Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Puedes agregar una alerta o mensaje para notificar al usuario que el producto se ha añadido al carrito
    // alert("Producto añadido al carrito");

    const cartButton = document.getElementById('btn-view-cart');
    cartButton.classList.add('cart-added');

    // Puedes quitar la clase después de un tiempo para que el efecto no se repita
    setTimeout(() => {
        cartButton.classList.remove('cart-added');

    }, 500);


    // Actualiza la visualización del carrito (opcional)
    updateCartView();
}

// Agrega un evento de clic al enlace "add-to-cart"


// Función para actualizar la visualización del carrito (puedes personalizar según tus necesidades)
function updateCartView() {
    // Aquí puedes agregar lógica para actualizar la visualización del carrito en tu interfaz de usuario
    // Por ejemplo, mostrar el número de productos en el carrito o redirigir al usuario a la página del carrito.
}