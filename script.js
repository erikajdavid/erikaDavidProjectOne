//hamburger menu and mobile navigation

const hamburgerMenu = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobileNav');

hamburgerMenu.addEventListener('click', function(){
    hamburgerMenu.classList.toggle('activated');
    mobileMenu.classList.toggle('activated');
});

//drop down menu for cart

const cart = document.querySelector('.cart');
const reviewCart = document.querySelector('.reviewCart')
cart.addEventListener('click', function() {
    cart.classList.toggle('activated');
    reviewCart.classList.toggle('activated');
});

//reset cart number to 0 

const resetToZero = document.querySelector('.trashCan');
resetToZero.addEventListener('click', function(){
  resetCartNumber();
});


function resetCartNumber() {
  const confirmation = confirm('Your cart will reset to 0. Continue?');
  if (confirmation) {
    cartCount.textContent = 0;
    const quantityElements = document.querySelectorAll('.quantity');
    quantityElements.forEach(function(element) {
      element.textContent = 0;
    });
    defaultNumber = 0; // reset defaultNumber to 0
    reviewCart.classList.remove('activated'); // hide reviewCart
  } else {
    // do nothing
    reviewCart.classList.remove('activated'); // hide reviewCart

  }
}

// Get cart count element and default count
const cartCount = document.querySelector('.cartItemNumber');
let defaultNumber = 0;

// Increment cart count and update display
function increaseCartNumber() {
  defaultNumber++;
  cartCount.textContent = defaultNumber;
}

// Add click event listeners to plus buttons
const cartIncrement = document.querySelectorAll('.plus');
cartIncrement.forEach(function(element) {
  element.addEventListener('click', function() {
    increaseCartNumber();
    const quantityElement = element.previousElementSibling;
    quantityElement.textContent = Number(quantityElement.textContent) + 1;
  });
});

// Decrement cart count and update display
function decreaseCartNumber() {
  defaultNumber--;
  if (defaultNumber < 0) {
    defaultNumber = 0;
  }
  cartCount.textContent = defaultNumber;
}

// Add click event listeners to minus buttons
const cartDecrement = document.querySelectorAll('.minus');
cartDecrement.forEach(function(element) {
  element.addEventListener('click', function() {
    const quantityElement = element.nextElementSibling;
    const currentQuantity = Number(quantityElement.textContent);
    if (currentQuantity > 0) {
      decreaseCartNumber();
      quantityElement.textContent = currentQuantity - 1;
    }
  });
});


  




























