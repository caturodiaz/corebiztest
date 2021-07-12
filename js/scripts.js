
let inputValues = {
    name: '',
    email: ''
}

let products = []

let cart = []


// Getting API data

async function getData() {

    let response = await fetch('https://corebiz-test.herokuapp.com/api/v1/products');

    let data = await response.json()

    products = [...data]

    return data;

}

function addToCart(id) {
    const productToCart = products.find(product => product.productId === parseInt(id));
    cart.push(productToCart)
    renderCart(cart)
}

function deleteFromCart(id) {
    const deleteFromCart = cart.filter(product => product.productId !== parseInt(id))

    cart = deleteFromCart
}

function renderCart(array) {
    const cartContainer = document.querySelector('.shopping-cart');
    if (!array || array.length === 0 ) {
        cartContainer.innerHTML = '<h2 class="no-items">No hay productos</h2>'
        return
    }

    cartContainer.innerHTML = `<table id="cart-list">
    <thead>
        <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th></th>
        </tr>
    </thead>
    <tbody></tbody>

</table>`;

    let html = ''

    array.forEach(product => {
        html +=  `
        <tr>
            <td><img src="${product.imageUrl}" alt="product image"></td>        
            <td>${product.productName}</td>        
            <td>${product.price}</td>        
            <td>0</td>
            <td><button onclick="deleteFromCart('${product.productId}')" class="delete-product">X</button></td>  
        </tr>`
    })

    const cartListTbody = document.querySelector('#cart-list tbody');
    
    cartListTbody.innerHTML = '';

    cartListTbody.innerHTML = html;
}

function renderProducts(array) { 
    const productContainer = document.querySelector('.products-slider');


    productContainer.innerHTML = `
    <h2 class="products-title">Más vendidos</h2>
        <div class="swiper-container">
            <!-- Additional required wrapper -->
                <div class="swiper-wrapper">
            <!-- Slides -->
        
    ...
                </div>
            <!-- If we need pagination -->
                <div class="swiper-pagination"></div>

        <!-- If we need navigation buttons -->
    
         </div>`;

    const sliderContainer = document.querySelector('.swiper-wrapper')
    let html = '';

    array.forEach(product => {
        html += `<div id="#product-details-${product.productId}" class="product-details swiper-slide">
        <div class="product-img"><img loading=lazy src="${product.imageUrl}" alt="product image"></div>
        <p class="product-title">${product.productName}</p>
        <div class="star-rating">
            <i class="fas fa-star star-icon"></i>
            <i class="far fa-star star-icon"></i>
            <i class="far fa-star star-icon"></i>
            <i class="far fa-star star-icon"></i>
            <i class="far fa-star star-icon"></i>
        </div>
        <p class="previous-price">${product.listPrice ? product.listPrice : product.price}</p>
        <p class="discount">${product.price}</p>
        <p>o en 9 cuotas de R $ 28.87</p>
        <button class="buy-btn" onclick="addToCart('${product.productId}')">Comprar</button>
        </div>` 
    })

    sliderContainer.innerHTML = html;

    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: true,
        autoplay: true,
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // And if we need scrollbar
        scrollbar: {
          el: '.swiper-scrollbar',
        },
        breakpoints: {
             0: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            500: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            900: {
                slidesPerView: 4,
                spaceBetween: 20
            }
        }
      });
      //Hovering to show Buy Button
    $('.product-details').hover(
        function () {
            $(this).children('.buy-btn').addClass('active');
        },
        function () {
            $(this).children('.buy-btn').removeClass('active');
        }
    );

    
}

function handleInput(e) {
    inputValues = {
        ...inputValues, [e.target.name] : e.target.value
    }

}


function handleSubmit(e) {
    e.preventDefault();

    if ( inputValues.name.trim() === '' || inputValues.email.trim() === '') {
        document.querySelector('.news-error').style.display = 'block'

        return
    }

    document.querySelector('.news-error').style.display = 'none';

    const request = $.ajax ({
        url : 'https://corebiz-test.herokuapp.com/api/v1/newsletter',
        method: 'post',
        data: inputValues,
        dataType: 'json'
    })

    request.done(function(response){
        console.log(response)
    });

    request.fail(function(error){
        console.log('Hubo un error', error)
    });
}


window.onload = () => {

    renderCart(cart)
    const shoppingCart = document.querySelector('.shopping-cart');
    const cartContainer = document.querySelector('#cart-list tbody');
  

    getData()
    .then(data => renderProducts(data))

    
    const inputs = document.querySelectorAll('.input');
    const form = document.querySelector('.news-form');
        
    inputs.forEach( input => input.addEventListener('input', handleInput))

    form.addEventListener('submit', handleSubmit)

    $('.shopping-menu').click(function(e){
        e.preventDefault();
        $('.shopping-cart').slideToggle(100);
    });
}


