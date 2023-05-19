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


//popup modal

//target modal and save in a variable
const popupModal = document.querySelector('.modalOverlay');
popupModal.style.display = 'none';

//want to load a function 3 seconds after webpage is loaded. 
function loadModal() {
  popupModal.classList.add('modalOverlay');
  popupModal.style.display = 'block';
}

//load after 3 seconds
function checkElapsedTime() {
  timeElapsed += 1000;
  if (timeElapsed >= 5000) {
    clearInterval(timerId);
    loadModal();
  }
}

let timeElapsed = 0;
let timerId = setInterval(checkElapsedTime, 1000);

//when user clicks on x, modal and modal overlay disappear

//target x and save in a variable
const closeModal = document.querySelector('.closeModal');
//add event listener
closeModal.addEventListener('click', closeModalWindow);

function closeModalWindow() {
  popupModal.classList.remove('modalOverlay');
  popupModal.style.display = 'none'; //without this line, only the overlay is removed.
}

//target form and save in variable
const form = document.querySelector('form');
//add event listener
form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitEmailInModal();
})

//function to submit 
function submitEmailInModal() {
  popupModal.classList.remove('modalContainer');
  popupModal.style.display = 'none'; //without this line, only the overlay is removed.
}

//close the cart when continueShopping is clicked on. 

//target continueShopping and save in variable

const continueShoppingEl = document.querySelector('.continueShopping')
//add event listener
continueShoppingEl.addEventListener('click', function(){
  //remove overlay and make cart review dissapear
  reviewCart.classList.remove('activated');
  overlay.classList.remove('activated');
})











  




























