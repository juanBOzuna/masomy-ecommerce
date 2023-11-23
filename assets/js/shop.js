import { serverUrl } from "./config.js";
document.addEventListener("DOMContentLoaded", function () {
  fetch(`${serverUrl}/api/categories`)
    .then((response) => response.json())
    .then((categories) => {
      renderAccordion(categories);
      addSubcategoryClickEvent();
    })
    .catch((error) => console.error("Error al obtener categorías:", error));

  function renderAccordion(categories) {
    const accordion = document.getElementById("accordion");

    if (categories.length > 0 && categories[0].subcategories.length > 0) {
      const firstCategory = categories[0];
      const firstSubcategory = firstCategory.subcategories[0];

      fetch(`${serverUrl}/api/products/subcategorie/${firstSubcategory.id}`)
        .then((response) => response.json())
        .then((products) => {
          renderAccordionItems(categories);

          renderProducts(products);

          addSubcategoryClickEvent();
        })
        .catch((error) => console.error("Error al obtener productos:", error));
    } else {
      const productsContainer = document.getElementById("productsContainer");
      productsContainer.innerHTML = "";
      renderAccordionItems(categories);
    }
  }
});

function renderAccordionItems(categories) {
  categories.forEach((category) => {
    const categoryID = `category-${category.id}`;

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
  return subcategories
    .map(
      (subcategory) => `
        <li>
            <a href="#" data-subcategoryId="${subcategory.id}" class="href-sub-categories">
                ${subcategory.name}
            </a>
        </li>
    `
    )
    .join("");
}

function addSubcategoryClickEvent() {
  const subcategoryLinks = document.querySelectorAll(".href-sub-categories");
  subcategoryLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const subcategoryId = link.dataset.subcategoryid;

      fetch(`${serverUrl}/api/products/subcategorie/${subcategoryId}`)
        .then((response) => response.json())
        .then((products) => {
          renderProducts(products);
        })
        .catch((error) => console.error("Error al obtener productos:", error));
    });
  });
}

function renderProducts(products) {
  console.log("ye");
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  if (Array.isArray(products)) {
    products.forEach((product) => {
      // const productElement = document.createElement('div');
      var htmlProductActual = `
            <div class="col-md-4">
                <div class="card mb-4 product-wap rounded-0">
                    <!-- Estructura del producto (ajusta según tu diseño) -->
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${serverUrl}/${
        product.picture
      }" alt="${product.name}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a class="btn btn-success text-white mt-2" TARGET="_BLANK"  href="shop-single.html?product_id=${
                                  product.id
                                }"  ><i class="far fa-eye"></i></a></li>
                                <li id="add-to-cart" productPicture="${
                                  product.picture
                                }" productId="${product.id}" productName="${
        product.name
      }" productPrice="${
        product.price
      }"  ><a class="btn btn-success text-white mt-2"><i  class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html" class="h3 text-decoration-none">${
                          product.name
                        }</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li>${product.description}</li>
                            <li class="pt-2">
                                <!-- Puedes agregar más detalles aquí -->
                            </li>
                        </ul>
                        <ul class="list-unstyled d-flex justify-content-center mb-1">
                            <li>
                            </li>
                        </ul>
                        <p class="text-center mb-0">$${product.price.toFixed(
                          2
                        )}</p>
                    </div>
                </div>
            </div>
            `;
      productsContainer.innerHTML += htmlProductActual;
    });

    const addToCartLinks = document.querySelectorAll("#add-to-cart");
    addToCartLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        const productId = link.getAttribute("productId");
        const productName = link.getAttribute("productName");
        const productPrice = parseFloat(link.getAttribute("productPrice"));
        // console.log(productPrice);
        const productPicture =
          `${serverUrl}/` + link.getAttribute("productPicture");

        const product = {
          id: productId,
          name: productName,
          price: productPrice,
          picture: productPicture,
        };

        // console.log(product)

        addToCart(product);
      });
    });
  } else {
    productsContainer.innerHTML =
      "<p>No hay productos disponibles en esta subcategoría.</p>";
  }
}

function addToCart(product) {
  console.log("last yes");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
    console.log("yes");
  } else {
    // console.log(product)
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      picture: product.picture,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  const cartButton = document.getElementById("btn-view-cart");
  cartButton.classList.add("cart-added");

  setTimeout(() => {
    cartButton.classList.remove("cart-added");
  }, 100);

  updateCartView();
}

function updateCartView() {}
