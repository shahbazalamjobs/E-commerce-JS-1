const productsContainer = document.getElementById('products');
const categoriesContainer = document.querySelector('.categories');
const navbar = document.getElementById('navbar');

const iconRightArrow = `<i class="fa-solid fa-arrow-right-long"></i>`;

// ---------------- navbar ------------------

(async function () {
    if (navbar) {
        const navbarResponse = await fetch('navbar.html');
        const navbarData = await navbarResponse.text();
        navbar.innerHTML = navbarData;
    }
})();


// -------- Individual product details  -----------

(async function () {
    const singleProdContainer = document.getElementById('product-container');

    if (singleProdContainer) {
        const prodResponse = await fetch('product-details.html');
        const prodData = await prodResponse.text();
        singleProdContainer.innerHTML = prodData;
    }
})()

// ---------------- fetch data ------------

async function fetchData() {
    try {
        const res = await fetch("https://fakestoreapi.com/products/")

        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.error('Error while fetching data', error);
        throw error;
    }
}

const itemsPerPage = 8;
let currentPage = 1;

// ----------- Use fetch data ---------

(async function () {

    const data = await fetchData();

    if (categoriesContainer) {
        const categoryCards = generateCategoryCards(data);
        categoriesContainer.innerHTML = categoryCards;
    }

    if (productsContainer) {
        generateProductCards(data, currentPage);
    }

    displayPagination(data);
})()


// ---------- Generate products  ---------
function generateProductCards(data, pageNumber) {

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = data.slice(startIndex, endIndex);

    productsContainer.innerHTML = ""; // Clear previous products

    // Loop through products and create product cards
    pageProducts.forEach(product => {
        const productCard = `
        <div class="card">
            <div class="card-image">
                <img src="${product.image}" alt="Product Image">
            </div>
            <div class="card-details">
                <p class="card-title"> ${product.title.slice(0, 25)}... </p>
                <p class="card-price"> ${product.price} $ </p>                        
            </div> 
            <div class="card-button"> 
                <button class="card-button-cart"> <a href=""> Cart </a> </button> 
                <button class="card-button-check" onClick="${() => handleCheck(product)}"> 
                    <a href="product-details.html">Check ${iconRightArrow}</a>
                </button>
            </div>
        </div>
    `;
        productsContainer.innerHTML += productCard;
    });
}


// Function to display pagination buttons
function displayPagination(data) {
    console.log(data);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";


    // Previous button
    const prevButton = document.createElement("button");
    prevButton.innerText = "Prev";
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            generateProductCards(data, currentPage);
        }
    });
    pagination.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.addEventListener("click", () => {
            currentPage = i;
            generateProductCards(data, currentPage);
        });
        pagination.appendChild(button);
    }

    // Next button
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            generateProductCards(data, currentPage);
        }
    });
    pagination.appendChild(nextButton);

}


// ---------- category card details ---------

function generateCategoryCards(products) {
    const uniqueCategories = [];
    const uniqueProducts = [];

    products.forEach(product => {
        if (!uniqueCategories.includes(product.category)) {
            uniqueCategories.push(product.category);
            uniqueProducts.push(product);
        }
    });

    return uniqueProducts.map(product => `
        <div class="category-card">
            <div>
                <img class="card-img" src="${product.image}" alt="${product.title}" />        
            </div>
            <div class="title">
                <h2> ${product.category.toUpperCase()} </h2>
            </div>
        </div>
    `).join("");
}



function toggleNavbar() {
    const responsiveNav = document.getElementsByClassName('nav-responsive');
    for (let i = 0; i < responsiveNav.length; i++) {
        responsiveNav[i].classList.toggle('toggle-nav');
    }
}






function handleCheck(product) {
    console.log('Hello', product);
}