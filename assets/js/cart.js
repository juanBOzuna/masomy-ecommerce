// cart.js
document.addEventListener('DOMContentLoaded', function () {

    

    let cartProducts = JSON.parse(localStorage.getItem('cart')) || [];

    const cartContainer = document.getElementById('cart-container');
    let emptyCartMessage = document.getElementById('empty-cart-message');
    renderProducts();


    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('col-lg-4', 'mb-4');
        card.innerHTML = `
            <div class="card h-100">
                <img src="${product.picture}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Precio: $${product.price}</p>
                    <p class="card-text">Cantidad: ${product.quantity}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger btn-remove">Eliminar</button>
                    <button class="btn btn-success btn-add">Agregar</button>
                    <button class="btn btn-warning btn-subtract">Quitar</button>
                </div>
            </div>
        `;

        const addButton = card.querySelector('.btn-add');
        addButton.addEventListener('click', function () {
            product.quantity++;
            updateLocalStorage();
            updateCardQuantity(card, product.quantity);
        });

        const subtractButton = card.querySelector('.btn-subtract');
        subtractButton.addEventListener('click', function () {
            if (product.quantity > 0) {
                product.quantity--;
                updateLocalStorage();
                updateCardQuantity(card, product.quantity);

                if (product.quantity === 0) {
                    cartProducts = cartProducts.filter(p => p !== product);
                    updateLocalStorage();
                    cartContainer.removeChild(card);
                }

                renderProducts();
            }
        });

        const removeButton = card.querySelector('.btn-remove');
        removeButton.addEventListener('click', function () {
            cartProducts = cartProducts.filter(p => p !== product);
            updateLocalStorage();
            cartContainer.removeChild(card);

            renderProducts();
        });

        return card;
    }

    function updateCardQuantity(card, quantity) {
        const quantityElement = card.querySelector('.card-text:last-child');
        quantityElement.innerText = `Cantidad: ${quantity}`;
    }

    function updateLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cartProducts));
    }

    function renderProducts() {
        cartContainer.innerHTML = ' <p id="empty-cart-message" class="text-center">El carrito está vacío</p>';
        emptyCartMessage = document.getElementById('empty-cart-message');
        if (cartProducts.length != 0) {
            console.log(cartProducts.length)
            cartProducts.forEach(product => {
                const productCard = createProductCard(product);
                cartContainer.appendChild(productCard);
            });
            emptyCartMessage.style.display = "none";
            document.querySelector("#btn-realizar-pago").style.display = "block";
        } else {
            document.querySelector("#btn-realizar-pago").style.display = "none";
            emptyCartMessage.style.display = 'block';
        }
    }

    window.addEventListener('focus', function () {
        cartProducts = JSON.parse(localStorage.getItem('cart')) || [];
        renderProducts()
    });


});



