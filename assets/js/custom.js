document.addEventListener('DOMContentLoaded', function () {
    // Hacer la solicitud a la API
    // fetch('http://127.0.0.1:8000/api/products/find/top_rated')
    //     .then(response => response.json())
    //     .then(products => {
    //         // Renderizar los productos en el contenedor
    //         const productContainer = document.getElementById('productContainer');

    //         products.forEach(product => {
    //             const productCard = `
    //                 <div class="col-12 col-md-4 mb-4">
    //                     <div class="card h-100">
    //                         <a href="shop-single.html">
    //                             <img src="${product.picture}" class="card-img-top" alt="${product.name}">
    //                         </a>
    //                         <div class="card-body">
    //                             <ul class="list-unstyled d-flex justify-content-between">
    //                                 <li>
    //                                     <i class="text-warning fa fa-star"></i>
    //                                     <i class="text-warning fa fa-star"></i>
    //                                     <i class="text-warning fa fa-star"></i>
    //                                     <i class="text-muted fa fa-star"></i>
    //                                     <i class="text-muted fa fa-star"></i>
    //                                 </li>
    //                                 <li class="text-muted text-right">$${product.price.toFixed(2)}</li>
    //                             </ul>
    //                             <a href="shop-single.html" class="h2 text-decoration-none text-dark">${product.name}</a>
    //                             <p class="card-text">${product.description}</p>
    //                             <p class="text-muted">Reviews (24)</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             `;

    //             productContainer.innerHTML += productCard;
    //         });
    //     })
    //     .catch(error => console.error('Error fetching products:', error));

    //     var requestOptions = {
    //         method: 'GET',
    //         redirect: 'follow'
    //     };

    //     fetch("http://127.0.0.1:8000/api/products/find/top_rated", requestOptions)
    //         .then(response => response.text())
    //         .then(productsR => {
    //             // Renderizar los productos en el contenedor
    //             var products = JSON.parse(productsR)
    //             const productContainer = document.getElementById('productContainer');

    //             products.forEach(product => {
    //                 const productCard = `
    //                     <div class="col-12 col-md-4 mb-4">
    //                         <div class="card h-100">
    //                             <a href="shop-single.html">
    //                                 <img src="${product.picture}" class="card-img-top" alt="${product.name}">
    //                             </a>
    //                             <div class="card-body">
    //                                 <ul class="list-unstyled d-flex justify-content-between">
    //                                     <li>
    //                                         <i class="text-warning fa fa-star"></i>
    //                                         <i class="text-warning fa fa-star"></i>
    //                                         <i class="text-warning fa fa-star"></i>
    //                                         <i class="text-muted fa fa-star"></i>
    //                                         <i class="text-muted fa fa-star"></i>
    //                                     </li>
    //                                     <li class="text-muted text-right">$${product.price.toFixed(2)}</li>
    //                                 </ul>
    //                                 <a href="shop-single.html" class="h2 text-decoration-none text-dark">${product.name}</a>
    //                                 <p class="card-text">${product.description}</p>
    //                                 <p class="text-muted">Reviews (24)</p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 `;

    //                 productContainer.innerHTML += productCard;
    //             });
    //         })
    //         .catch(error => console.log('error', error));



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

    
    fetch("http://127.0.0.1:8000/api/products/find/top_rated", requestOptions)
        .then(response => response.json())
        .then(products => {

            const productContainer = document.getElementById('productContainer');

            products.forEach(product => {
                var texthtml = '';
                for (let index = 0; index < 5; index++) {
                    if (index < product.valorations[0].total_rating) {
                        texthtml += '<i class="text-warning fa fa-star"></i>';
                    } else {
                        texthtml += '<i class="text-muted fa fa-star"></i>';
                    }
                }

                const productCard = `
                <div class="col-12 col-md-4 mb-4 product-card" data-product-id="${product.id}">
                    <div class="card h-100">
                        <a href="shop-single.html?product_id=${product.id}">
                            <img src="http://localhost/masomy/public/${product.picture}" class="card-img-top" alt="${product.name}">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li>
                                    ${texthtml}
                                </li>
                                <li class="text-muted text-right">$${product.price.toFixed(0)}</li>
                            </ul>
                            <a href="#" class="h2 text-decoration-none text-dark">${product.name}</a>
                            <p class="card-text">${product.description}</p>
                            <p class="text-muted">Reviews (${product.valorations[0].total_reviews})</p>
                        </div>
                    </div>
                </div>
            `;

                productContainer.innerHTML += productCard;
            });
        })
        .catch(error => console.log('error', error));

    // const generateStars = (rating) => {
    //     const fullStars = Math.floor(rating);
    //     const halfStar = rating - fullStars >= 0.5 ? 1 : 0;

    //     const stars = Array.from({ length: fullStars }, () => 'fa fa-star');
    //     if (halfStar) {
    //         stars.push('fa fa-star-half-o');
    //     }

    //     const remainingStars = Array.from({ length: 5 - stars.length }, () => 'fa fa-star-o');

    //     // Agrega la clase "text-muted" a la última estrella gris
    //     if (stars.length + remainingStars.length < 5) {
    //         remainingStars[0] += ' text-muted';
    //     }

    //     const allStars = [...stars, ...remainingStars];

    //     return allStars.map(starClass => `<i class="text-warning ${starClass}"></i>`).join('');
    // };

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