import { serverUrl } from './config.js';
var formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
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
            document.getElementById('product_discount').value = product.discount;
            document.getElementById('product_picture').value = `${serverUrl}/` + product.picture;
            document.getElementById('product-detail').src = `${serverUrl}/` + product.picture;
            document.querySelector('.h2').innerText = product.name;
            document.querySelector('#product_description').innerText = product.description;
            let price = product.discount > 0 ? `<span style="color:red !important; font-size:15px" > <del>${(formatter.format(product.price))}  </del> </span>  | <span style= "font-size:20px !important; font-weight:bold !important; color:green" > ${formatter.format(product.price - ((product.price * product.discount) / 100))}  </span> ` : `<span style="color:green" >${(formatter.format(product.price))}</span>`;
            // alert(price);
            document.querySelector('#product_price').innerHTML = `${price}`;


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

            const averageRatingElement = document.getElementById('average-rating');
            const userRatingsContainer = document.getElementById('user-ratings');

            averageRatingElement.innerText = `Calificación total: ${product.average_rating} estrellas`;

            product.valorations.forEach(rating => {
                const ratingCard = createRatingCard(rating);
                userRatingsContainer.appendChild(ratingCard);
            });

            addToCartForm.addEventListener('submit', function (event) {
                event.preventDefault();


                const productId = document.getElementById('product_id').value;
                const productName = document.getElementById('product_name').value;
                const productprice = document.getElementById('product_price').value;
                const productDiscount = document.getElementById('product_discount').value;
                const productPicture = document.getElementById('product_picture').value;
                const quantity = parseInt(document.getElementById('var-value').innerText, 10);


                const product = {
                    id: productId,
                    name: productName,
                    price: productprice,
                    discount: productDiscount,
                    quantity: quantity,
                    picture: productPicture

                };


                addToCart(product);



            });


        })
        .catch(error => console.log('error', error));
});

function createRatingCard(rating) {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${rating.user.name}</h5>
            <div class="d-flex justify-content-between">
                <div>
                    ${generateStarIcons(rating.rating)}
                </div>
                <p class="card-text">${rating.comment}</p>
            </div>
        </div>
    `;

    return card;
}

function generateStarIcons(rating) {
    const starIcons = '<i class="fa fa-star"></i>'.repeat(rating);
    return starIcons;
}


function addToCart(product) {

    const alterCountableDetail = { subtotal: 0, total: 0, totalDiscountAmmount: 0 };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountableDetails = JSON.parse(localStorage.getItem("cart_countable_details")) || {}

    if (cartCountableDetails.total == null || cartCountableDetails.subtotal == null || cartCountableDetails.totalDiscountAmmount == null) {
        cartCountableDetails = alterCountableDetail;
    }

    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {

        // existingProduct.quantity += 1;
        // existingProduct.subtotal = existingProduct.price * existingProduct.quantity;
        // existingProduct.discountPercentaje = parseFloat(product.discount);
        // existingProduct.discount = (((product.price * existingProduct.quantity) * product.discount) / 100);
        // existingProduct.total = (product.price * existingProduct.quantity) - (((product.price * existingProduct.quantity) * product.discount) / 100)

        existingProduct.quantity += 1;
        let subtotal = product.price * existingProduct.quantity;
        let discount = (((subtotal) * product.discount) / 100);
        let total = subtotal - discount;

        cartCountableDetails.subtotal -= existingProduct.subtotal;
        cartCountableDetails.totalDiscountAmmount -= existingProduct.discount;
        cartCountableDetails.total -= existingProduct.total;

        existingProduct.subtotal = subtotal;
        existingProduct.discountPercentaje = parseFloat(product.discount);
        existingProduct.discount = discount;
        existingProduct.total = total
        cartCountableDetails.subtotal += subtotal;
        cartCountableDetails.totalDiscountAmmount += discount;
        cartCountableDetails.total += total;
    } else {

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
            discountPercentaje: parseFloat(product.discount),
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

    }, 500);


    updateCartView();
}

// Agrega un evento de clic al enlace "add-to-cart"


// Función para actualizar la visualización del carrito (puedes personalizar según tus necesidades)
function updateCartView() {
}