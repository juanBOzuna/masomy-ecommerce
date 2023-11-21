import { serverUrl } from './config.js';

var formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP',minimumFractionDigits: 0  });

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('DOMContentLoaded', function () {
        const productContainer = document.getElementById('productContainer');

        // productContainer.addEventListener('click', function (event) {
        //     const target = event.target.closest('.product-card');
        //     if (target) {
        //         const productId = target.dataset.productId;
        //         window.location.href = `shop-single.html?product_id=${productId}`;
        //     }
        // });
    });

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };


    fetch(`${serverUrl}/api/products/find/top_rated`, requestOptions)
        .then(response => response.json())
        .then(products => {

            const productContainer = document.getElementById('productContainer');

            products.forEach(product => {
                var texthtml = '';
                // console.log()

                if (product.valorations.length != 0) {
                    for (let index = 0; index < 5; index++) {
                        if (index < product.valorations[0].total_rating) {
                            texthtml += '<i class="text-warning fa fa-star"></i>';
                        } else {
                            texthtml += '<i class="text-muted fa fa-star"></i>';
                        }
                    }
                } else {
                    for (let index = 0; index < 5; index++) {
                        texthtml += '<i class="text-muted fa fa-star"></i>';
                    }
                }

                var totalReviews = product.valorations.length != 0 ? product.valorations[0].total_reviews : 0;
                const productCard = `
                <div class="col-12 col-md-4 mb-4 product-card" data-product-id="${product.id}">
                    <div class="card h-100">
                        <a href="shop-single.html?product_id=${product.id}">
                            <img src="${serverUrl}/${product.picture}" class="card-img-top" alt="${product.name}">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li>
                                    ${texthtml}
                                </li>
                                <li class="text-muted text-right font-weight-bold text-success">${formatter.format(product.price)}</li>
                            </ul>
                            <a href="#" class="h2 text-decoration-none text-dark">${product.name}</a>
                            <p class="card-text">${product.description}</p>
                            <p class="text-muted">Valoraciones (${totalReviews})</p>
                        </div>
                    </div>
                </div>
            `;

                productContainer.innerHTML += productCard;
            });
        })
        .catch(error => console.log('error', error));

    const generateStars = (rating) => {
        var texthtml = '';
        for (let index = 0; index < 5; index++) {
            if (index < rating) {
                texthtml += '<i class="text-warning fa fa-star"></i>';
            } else {
                texthtml += '<i class="text-muted fa fa-star"></i>';
            }
        }
        console.log(texthtml)
        return texthtml;
    };















});