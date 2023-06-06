//REFERENCE USED FORR MOBILE NAV: https://www.youtube.com/watch?v=OFKBep95lb4&t=316s

//HAMBURGER MENU AND MOBIL NAV
//CART APP TOGGLE
//BACKGROUND COLOR MUTED WHEN CART APP IS ACTIVE
//CART APP CLOSE ON WINDOW CLICK

const body = document.body;
const overlay = document.createElement('div');
overlay.classList.add('overlay');
body.appendChild(overlay);

const hamburgerMenu = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobileNav');

hamburgerMenu.addEventListener('click', function(){
    hamburgerMenu.classList.toggle('activated');
    mobileMenu.classList.toggle('activated');
    overlay.classList.toggle('activated');
});

const mobileLinks = document.querySelectorAll('.mobileNav a')

mobileLinks.forEach((link) => {
    link.addEventListener('click', function() {
      overlay.classList.remove('activated')
      mobileMenu.classList.remove('activated');
    })
});

const cart = document.querySelector('.cart');
const reviewCart = document.querySelector('.reviewCart');

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


//POPUP MODAL

//target modal and save in a variable
const popupModal = document.querySelector('.modalOverlay');
popupModal.style.display = 'none';

const modalAfterSubmit = document.querySelector('.modalContainerAfterSubmit');

//want to load a function 3 seconds after webpage is loaded. 
function loadModal() {
  popupModal.classList.add('modalOverlay');
  popupModal.style.display = 'block';
  modalAfterSubmit.style.display = 'none';
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
  popupModal.style.display = 'none';
}

const closeModal2 = document.querySelector('.closeModal2');
closeModal2.addEventListener('click', closeModal2Window);

function closeModal2Window() {
  popupModal.classList.remove('modalOverlay');
  modalAfterSubmit.style.display = 'none';
}

const shopNowModal = document.querySelector('.shopNowModalBtn');
shopNowModal.addEventListener('click', closeModal2Window);


//target form and save in variable
const form = document.querySelector('form');
//add event listener
form.addEventListener('submit', (event) => {
  event.preventDefault();
  validateModalEmail();
})

//function to validate email in modal

function validateModalEmail() {
  const modalEmail = document.getElementById('modalEmail').value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const errorMessage = document.getElementById('modalErrorMsg');

  if (!emailRegex.test(modalEmail)) {
    errorMessage.textContent = `Please enter a valid email`;
    errorMessage.style.color = "red";
    modalEmail.style.color = "red"
    return false;
  } else {
    submitEmailInModal();
    return true;
  }
}

//function to submit 
function submitEmailInModal() {
  const popupModal = document.querySelector('.modalContainer');  
  //display thank you message
  modalAfterSubmit.style.display = 'block'; 
  //remove previous modal popup content 
  popupModal.classList.remove('modalContainer');
  popupModal.style.display = 'none';
}

//FOR NOW THE CODE BELOW ONLY WORKS FOR THE CART IN HOME PAGE, NOT THE CONTACT PAGE. YOU CAN EXIT THE CART BY CLICKING ON THE SHOPPING BAG ICON OR ANYWHERE OUTSIDE THE CART.
//close the cart when continueShopping is clicked on. 
//target continueShopping and save in variable

const continueShoppingEl = document.querySelector('.continueShopping')
//add event listener
continueShoppingEl.addEventListener('click', function(){
  //remove overlay and make cart review dissapear
  reviewCart.classList.remove('activated');
  overlay.classList.remove('activated');
})

//FOR NOW THE CODE BELOW ONLY WORKS FOR THE CART IN HOME PAGE, NOT THE CONTACT PAGE. YOU CAN EXIT THE CART BY CLICKING ON THE SHOPPING BAG ICON OR ANYWHERE OUTSIDE THE CART.

const closeCartEl = document.querySelector('.closeCart')
//add event listener
closeCartEl.addEventListener('click', function() {
  //remove overlay and make cart review dissapear
  reviewCart.classList.remove('activated');
  overlay.classList.remove('activated');
})


//REFERENCE USED FOR CART BASICS: https://www.youtube.com/watch?v=UcrypywtAm0&t=2013s


//RENDER SHOP PRODUCTS ON PRODUCT PAGE WITH INNERHTML
//ADDING TO THE PAGE DYNAMICALLY

const productsEl = document.querySelector('.productGallery');

function renderProducts() {
  products.forEach((product) => {
    productsEl.innerHTML += `
    <li>
      <div class="imageContainer">
        <img src="${product.imgSrc}" alt="${product.name}">
      </div>
      <button class="plus" onclick="addToCart(${product.id})">
        <img src="./assets/icons/cart.svg">
      </button>
      <div class="infoContainer">
        <div class="textContainer">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="price">${product.price} each</p>
        </div>
      </div>
    </li>
    `;
  });
}

renderProducts(); //call the function to display the shop items


//CART ARRAY FOR SAVING ALL THE ITEMS BEING ADDED TO THE CART
let myCart = []

//ADD TO CART FROM SHOPPING PRODUCT PAGE
function addToCart(id) {
    if (myCart.some((item) => item.id === id)) {
    changeNumberOfUnits("plus", id); // this line right here updates the total cart number when the quantities of the products already in the cart are being modified. 
   
    } else {
      const item = products.find((product) => product.id === id);
  
      // update product quantity
      item.quantity -= 1;
  
      myCart.push({
        ...item, ///... is a spread operator to copy all properties of the item object
        numberOfUnits: 1,
      });
    }

    updateCart();
    trashIt();
  }

//function to open up cart when item is added to it from the shop
const plusBtnEl = document.querySelectorAll('.plus');

function appearCart() {
  plusBtnEl.forEach((plus) => {
    plus.addEventListener('click', function(){
        cart.classList.toggle('activated');
        reviewCart.classList.toggle('activated');
        overlay.classList.toggle('activated');
      })
    })

  overlay.addEventListener('click', function() {
    if (cart.classList.contains('activated')) {
      cart.classList.remove('activated');
      reviewCart.classList.remove('activated');
      overlay.classList.remove('activated');
    }
  })
};

appearCart();

//RENDER CART ITEMS WITH INNERHTML
//ADDING TO THE PAGE DYNAMICALLY
const cartItemsEl = document.querySelector('.orderItems');

function renderCartItems() {
    cartItemsEl.innerHTML = ""; //clear cart element
    myCart.forEach((item) => {
        cartItemsEl.innerHTML += `
        <li class="cartItemInfo">
            <div class="cartItemProduct">
                <img src="${item.imgSrc}" alt="${item.name}">
                <p class="productName">${item.name}</p>
                <p class="productPrice">${item.price}/unit</p>
            </div>
            <div class="cartItemControls">
                <div class="cartItemRemove" onclick="trashIt(${item.id})">
                    <i class="fa-solid fa-trash-can trashCan"></i>
                    <p>Remove</p>
                </div>
                <div class="cartItemQuantity">
                    <button class="minusBtn" onclick="changeNumberOfUnits('minus', ${item.id})">-</button>
                    <p>${item.numberOfUnits}</p>
                    <button class="plusBtn" onclick="changeNumberOfUnits('plus', ${item.id})">+</button>
                </div>
            </div>
        </li>
        `
    });
};

renderCartItems();


//THIS CHANGES THE NUMBER OF UNITS FOR AN ITEM IN THE CART APP
function changeNumberOfUnits(action, id) {
  myCart = myCart.map((item) => { //you're making a new array in the cart with this
    let numberOfUnits = item.numberOfUnits;
    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 0) { // this line is to prevent the number from going below 0
        numberOfUnits--;
      } else if (action === "plus") {
        numberOfUnits++;
      }
      // Additional condition to remove item if numberOfUnits is zero
      if (numberOfUnits === 0) {
        return null;
      }
    }
    return { // need to return to see the array because of the map method
      ...item, //this restructures the item
      numberOfUnits,
    };
  });

  // Remove null items (items with numberOfUnits === 0)
  myCart = myCart.filter(item => item !== null);

  updateCart();
}


//THIS GIVES THE TRASH CAN IN THE APP FUNCTIONALITY
function trashIt(id) {
  myCart = myCart.filter((item) => item.id !== id);

  const shopQuantities = document.querySelectorAll('.quantity');
  let totalQuantity = 0;

  myCart.forEach((item) => {
    totalQuantity += item.numberOfUnits;
  });

  shopQuantities.forEach((quantity) => {
    quantity.innerHTML = totalQuantity;
  });

  updateCart();
}


//CALCULATE THE SUBTOTAL IN APP
const subTotalPriceEl = document.querySelector('.subTotalPrice')
const itemsInCartEl = document.querySelector('.cartItemNumber');
const totalItemsEl = document.querySelector('.totalItems');

function renderSubTotal(){
    let totalPrice = 0, totalItems = 0;

    myCart.forEach(item => {
        totalPrice += item.price * item.numberOfUnits,
        totalItems += item.numberOfUnits
    });

    totalItemsEl.textContent = totalItems;
    subTotalPriceEl.textContent = totalPrice.toFixed(2);
    
    itemsInCartEl.innerHTML = totalItems; // this is what is responsible for displaying the number of items in cart in the cart icon in top nav
};


//CALCULATE TAX IN APP
const totalTaxPriceEl = document.querySelector('.totalTaxPrice');

function renderTax() {
  const taxRate = 0.13;
  let totalPrice = 0;
  let totalTax = 0; // Initialize totalTax to 0

  myCart.forEach(item => {
    totalPrice += item.price * item.numberOfUnits;
  });

  totalTax += totalPrice * taxRate;
  
  totalTaxPriceEl.textContent = totalTax.toFixed(2);
};


//CALCULATE FINAL TAX IN APP
const finalTotalPriceEl = document.querySelector('.finalTotalPrice');

function renderFinalTotal() {
  const taxRate = 0.13;
  let totalPrice = 0;
  let totalTax = 0;
  let finalTotal = 0;

  myCart.forEach(item => {
    totalPrice += item.price * item.numberOfUnits;
  });

  totalTax = totalPrice * taxRate;
  finalTotal = totalPrice + totalTax;

  finalTotalPriceEl.textContent = (finalTotal).toFixed(2);
}

const cartMessagesEl = document.querySelector('.cartMessages')
//UPDATE THE CART
function updateCart() {
    renderCartItems(); //this renders the products to the cart 
    if (myCart.length === 0) {
      //if there are items in the cart, display these elements
      cartMessagesEl.style.display = 'block';
      cartMessagesEl.style.display = 'block';
    } else {
      //if there are no items in the cart, display these elements
      cartMessagesEl.style.display = 'none';
      cartMessagesEl.style.display = 'none';
    }
    renderSubTotal(); //this renders sub-total in app
    renderTax(); //this renders tax in app
    renderFinalTotal(); //this renders final total in app
};

//CODE REMOVED TO SIMPLIFY PROJECT
/*
  //REMOVE ITEM FROM CART FROM SHOPPING PRODUCT PAGE
  function removeFromCart(id) {
    if (myCart.some((item) => item.id === id)) {
    changeNumberOfUnits("minus", id); // this line right here updates the total cart number when the quantities of the products already in the cart are being modified. 
    } else {
        const index = myCart.findIndex((item) => item.id === id);
        if (index !== -1) {
          myCart.splice(index, 1);
        }
        
      };
    updateCart();
    trashIt();
  };
*/

