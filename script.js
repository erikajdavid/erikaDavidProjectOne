//HAMBURGER MENU AND MOBIL NAV
//CART APP TOGGLE
//BACKGROUND COLOR MUTED WHEN CART APP IS ACTIVE
//CART APP CLOSE ON WINDOW CLICK

const hamburgerMenu = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobileNav');
const cart = document.querySelector('.cart');
const reviewCart = document.querySelector('.reviewCart');

const body = document.body;
const overlay = document.createElement('div');
overlay.classList.add('overlay');
body.appendChild(overlay);

hamburgerMenu.addEventListener('click', function(){
    hamburgerMenu.classList.toggle('activated');
    mobileMenu.classList.toggle('activated');
    overlay.classList.toggle('activated');
});

cart.addEventListener('click', function() {
  cart.classList.toggle('activated');
  reviewCart.classList.toggle('activated');
  overlay.classList.toggle('activated');
});

overlay.addEventListener('click', function() {
  if (cart.classList.contains('activated')) {
    cart.classList.remove('activated');
    reviewCart.classList.remove('activated');
    overlay.classList.remove('activated');
  }
});


  




























