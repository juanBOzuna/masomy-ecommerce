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

            // ... actualiza otros elementos del HTML según la estructura de tu respuesta API
        })
        .catch(error => console.log('error', error));
});