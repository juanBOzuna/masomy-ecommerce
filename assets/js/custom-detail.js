import { serverUrl } from './config.js';
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product_id');

    if (!productId) {
        console.error('Product ID not found in the URL');
        return;
    }

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`${serverUrl}/api/products/${productId}`, requestOptions)
        .then(response => response.json())
        .then(product => {

            document.getElementById('product_id').value = productId;
            document.getElementById('product_name').value = product.name;
            document.getElementById('product_price').value = product.price;
            document.getElementById('product_picture').value = `${serverUrl}/`+product.picture;
            document.getElementById('product-detail').src = `${serverUrl}/` + product.picture;
            document.querySelector('.h2').innerText = product.name;
            document.querySelector('#product_description').innerText = product.description;
            document.querySelector('.h3').innerText = `$${product.price.toFixed(2)}`;


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


            addToCartForm.addEventListener('submit', function (event) {
                event.preventDefault();


                const productId = document.getElementById('product_id').value;
                const productName = document.getElementById('product_name').value;
                const productprice = document.getElementById('product_price').value;
                const productPicture = document.getElementById('product_picture').value;
                const quantity = parseInt(document.getElementById('var-value').innerText, 10);


                const product = {
                    id: productId,
                    name: productName,
                    price:productprice,
                    quantity: quantity,
                    picture: productPicture

                };


                addToCart(product);



            });


        })
        .catch(error => console.log('error', error));




});


function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {

        existingProduct.quantity += 1;
    } else {

        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, picture: product.picture });
    }

    localStorage.setItem("cart", JSON.stringify(cart));


    const cartButton = document.getElementById('btn-view-cart');
    cartButton.classList.add('cart-added');

    setTimeout(() => {
        cartButton.classList.remove('cart-added');

    }, 500);


    updateCartView();
}

// Agrega un evento de clic al enlace "add-to-cart"


// Función para actualizar la visualización del carrito (puedes personalizar según tus necesidades)
function updateCartView() {
}