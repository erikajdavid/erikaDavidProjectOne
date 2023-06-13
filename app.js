// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3ns1VQvYSGOMuoyxUTUSWGNT5iR2TNzo",
  authDomain: "practice-project-app-608de.firebaseapp.com",
  projectId: "practice-project-app-608de",
  storageBucket: "practice-project-app-608de.appspot.com",
  messagingSenderId: "126461480563",
  appId: "1:126461480563:web:ebdcf28a19991bf790e406"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

const bodyEl = document.querySelector('body');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
bodyEl.appendChild(overlay);

const cartIconEl = document.querySelector('.cartIcon');
const cartAppEl = document.querySelector('.cartApp');
const closeCartEl = document.querySelector('.closeCart');
const continueShoppingEl = document.querySelector('.continueShopping');

//create a function to toggle the cart app

function toggleCart() {
    cartAppEl.classList.toggle('activated');
    overlay.classList.toggle('activated');
}

cartIconEl.addEventListener('click', toggleCart);
closeCartEl.addEventListener('click', toggleCart);
continueShoppingEl.addEventListener('click', toggleCart);

window.addEventListener('click', function(event) {
    if (
      cartAppEl.classList.contains('activated') &&
      !cartAppEl.contains(event.target) &&
      !cartIconEl.contains(event.target) &&
      ![...addToCartBtnEl].some(button => button.contains(event.target))
    ) {
      toggleCart();
    }
  });
  
const addToCartBtnEl = document.querySelectorAll('.addToCartBtn');
const emptyCartEl = document.querySelector('.emptyCart');
const fullCartEl = document.querySelector('.fullCart');

// Create an empty array to store the cart items
const inCartItems = [];

addToCartBtnEl.forEach((button) => {
  button.addEventListener('click', function(event) {

    toggleCart();   

    emptyCartEl.style.display = "none";
    fullCartEl.style.display = "block";

    const id = event.target.id.slice(1);
    const itemId = `item${id}`;

    const childRef = ref(database, `items/${itemId}`);
    get(childRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const itemData = snapshot.val();
          console.log(itemData);
          const currentQty = itemData.quantity || 0;
          const newQty = currentQty + 1;

          // Update the quantity of the item in the cart
          if (inCartItems[itemId]) {
            inCartItems[itemId].quantity = newQty;
          } else {
            // Add the item to the cartItems object
            inCartItems[itemId] = { ...itemData, quantity: newQty };
          }

          // Update the quantity in the database
          update(childRef, { inCart: true, quantity: newQty });

          // Render all the cart items
          renderCartItems(Object.values(inCartItems));
          calculateTotalItemsInCart(Object.values(inCartItems));
          calculateSubTotal(Object.values(inCartItems));

        } else {
          console.log(`Item ${itemId} does not exist in the database.`);
        }
      })
      .catch((error) => {
        console.log('Error retrieving data:', error);
      });
  });
});

const productsInCartEl = document.querySelector('.productsInCart');

function renderCartItems(cartItemsArray) {
  productsInCartEl.innerHTML = '';

  cartItemsArray.forEach((item) => {
    const productInCartContainer = document.createElement('li');
    productInCartContainer.classList.add('productInCartContainer');
    productsInCartEl.append(productInCartContainer);

    const img = document.createElement('img');
    img.classList.add('productImage');
    img.src = item.imgSrc;
    productInCartContainer.append(img);

    const productInfoContainer = document.createElement('div');
    productInfoContainer.classList.add('productInfoContainer');
    productInCartContainer.append(productInfoContainer);

    const productTextContainer = document.createElement('div');
    productTextContainer.classList.add('productTextContainer');
    productInfoContainer.append(productTextContainer);

    const productName = document.createElement('p');
    productName.classList.add('productName');
    productName.textContent = item.name;

    productTextContainer.append(productName);

    const productPrice = document.createElement('p');
    productPrice.classList.add('productPrice');
    productPrice.textContent = item.price;

    productTextContainer.append(productPrice);

    const productBtnContainer = document.createElement('div');
    productBtnContainer.classList.add('productBtnContainer');
    productInfoContainer.append(productBtnContainer);

    const qtyContainer = document.createElement('div');
    qtyContainer.classList.add('qtyContainer');
    productBtnContainer.append(qtyContainer);

    const minusBtn = document.createElement('button');
    minusBtn.classList.add('minusBtn');
    minusBtn.textContent = '-';
    minusBtn.id = `-${item.id}`; // Use item ID in the button's ID attribute

    qtyContainer.append(minusBtn);

    const productQty = document.createElement('p');
    productQty.classList.add('productQty');
    productQty.textContent = item.quantity; // Update the quantity

    qtyContainer.append(productQty);

    const plusBtn = document.createElement('button');
    plusBtn.classList.add('plusBtn');
    plusBtn.textContent = '+';
    plusBtn.id = `+${item.id}`; // Use item ID in the button's ID attribute

    qtyContainer.append(plusBtn);

    const trashIcon = document.createElement('p');
    trashIcon.classList.add('trashIcon');
    trashIcon.textContent = 'Remove';
    trashIcon.id = `i${item.id}`; // Set the ID attribute with the item ID

    productBtnContainer.append(trashIcon);

    // Event listener for minus button
    minusBtn.addEventListener('click', function (event) {
      const id = event.target.id.slice(2);
      //console.log(item); // Extract item ID from the button's ID attribute
      const itemId = `item${id}`;
      const childRef = ref(database, `items/${itemId}`);

      if (item.quantity > 1) {
        item.quantity--; // Decrement the quantity
        productQty.textContent = item.quantity; // Update the displayed quantity
        calculateSubTotal(cartItemsArray);
        // Update the quantity in the database
        update(childRef, { quantity: item.quantity });
      } else {
        productQty.textContent = 0;
        productInCartContainer.remove();
        update(childRef, { inCart: false, quantity: 0 });
        delete inCartItems[itemId];
      }
      calculateTotalItemsInCart(Object.values(inCartItems));
      calculateSubTotal(Object.values(inCartItems));

      event.stopPropagation(); // Prevent event propagation
    });

     // Event listener for minus button
     plusBtn.addEventListener('click', function (event) {
      const id = event.target.id.slice(2); // Extract item ID from the button's ID attribute
      const itemId = `item${id}`;

      const childRef = ref(database, `items/${itemId}`);

        item.quantity++; // Decrement the quantity
        productQty.textContent = item.quantity; // Update the displayed quantity

        // Update the quantity in the database
        update(childRef, { quantity: item.quantity });

        calculateTotalItemsInCart(Object.values(inCartItems));
        calculateSubTotal(Object.values(inCartItems));
    });

    trashIcon.addEventListener('click', function(event) {
      const id = event.target.id.slice(2);
      const itemId = `item${id}`;
      const childRef = ref(database, `items/${itemId}`);
    
      productInCartContainer.remove();
      update(childRef, { inCart: false, quantity: 0 });
    
      // Remove the item from inCartItems
      delete inCartItems[itemId];
    
      // Update the total items count
      calculateTotalItemsInCart(Object.values(inCartItems));
      calculateSubTotal(Object.values(inCartItems));

      event.stopPropagation(); // Prevent event propagation
    });
  });
};

function calculateTotalItemsInCart(cartItemsArray) {
  const totalItemsInCart = document.querySelector('.totalItemsInCart');
  const totalItems = document.createElement('p');
  totalItems.classList.add('totalItems');

  // Calculate the total quantity of items
  const totalQuantity = cartItemsArray.reduce((total, item) => total + item.quantity, 0);

  totalItems.textContent = totalQuantity;

  // Update the total items display
  totalItemsInCart.innerHTML = '';
  totalItemsInCart.append(totalItems);
} 

const subTotalEl = document.querySelector('.subTotal');

function calculateSubTotal(cartItemsArray) {
  if (cartItemsArray.length === 0) {
    subTotalEl.textContent = '0.00'; // Set subtotal to 0 when cart is empty
  } else {
    const subTotal = cartItemsArray.reduce((total, item) => total + (item.price * item.quantity), 0);
    subTotalEl.textContent = subTotal.toFixed(2);
  }
};

/*function clearTheCart() {
    emptyCartEl.style.display = "flex";
    fullCartEl.style.display = "none";
    subTotalEl.textContent = '0.00';
    productsInCartEl.classList.remove('productsInCart');

    //must update firebase to reflect all items in object like so: inCart: true, quantities: 0;
};

const clearCartEl = document.querySelector('.clearTheCart');
clearCartEl.addEventListener('click', clearTheCart);*/










