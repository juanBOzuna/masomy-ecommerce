import { serverUrl } from './config.js';

var formatter = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });

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
            console.log(products)
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
                let price = product.discount > 0 ? `<span style="color:red !important; font-size:15px" > <del>${(formatter.format(product.price))}  </del> </span>  | <span style= "font-size:20px !important; font-weight:bold !important" > ${ formatter.format( product.price - ((product.price * product.discount) / 100))}  </span> ` : `${( formatter.format(product.price))}`;
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
                            <br>
                            <a href="#" class="h3 text-decoration-none text-dark" style= " color: green !important;" >${price}</a>
                            <br>
                            <a href="#" class="h3 text-decoration-none text-dark" style="font-size:15px !important" >${product.discount}% de descuento</a>
                            <br>
                            <br>
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