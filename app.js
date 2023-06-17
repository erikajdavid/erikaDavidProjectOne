// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase, ref, get, update, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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
//const dbRef = ref(database);

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

//event parameter is passed in the eventlistener function. 
window.addEventListener('click', function(event) {
    if (
      cartAppEl.classList.contains('activated') &&
      !cartAppEl.contains(event.target) &&
      !cartIconEl.contains(event.target) &&
      //when we use querySelectorAll, we create a nodelist, which is a collection of nodes on the DOM. a nodelist is not the same as an array. to convert a nodelist to array we use the syntax [...nodelist]. if we just put [nodelist], this does creates an array but only contains one element, the nodelist itself. we want to convert the nodelsit to array so that we can use array methods, in this case, the some() method. 
      //inside the (), this takes each button and checks if it contains the event.target(the click)
      ![...addToCartBtnEl].some(button => button.contains(event.target))
      //this line says for every
    ) {
      toggleCart();
    }
  });

let inCartItems = [];
  
const addToCartBtnEl = document.querySelectorAll('.addToCartBtn');
const emptyCartEl = document.querySelector('.emptyCart');
const fullCartEl = document.querySelector('.fullCart');

addToCartBtnEl.forEach((button) => {
  button.addEventListener('click', function (event) {
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
          const currentQty = itemData.quantity || 0;
          const newQty = currentQty + 1;

          let existingItemIndex = inCartItems.findIndex((item) => item.id === itemId);

          if (existingItemIndex !== -1) {
            inCartItems[existingItemIndex].quantity++; // Increment the quantity of the existing item
          } else {
            const newItem = { ...itemData, quantity: newQty, id: itemId };
            inCartItems.push(newItem);
            console.log(inCartItems);
          }

          update(childRef, { inCart: true, quantity: newQty });
          renderCartItems(inCartItems);
          calculateTotalItemsInCart(inCartItems);
          calculateSubTotal(inCartItems);
        } else {
          console.log(`Item ${itemId} does not exist in the database.`);
        }
      })
      .catch((error) => {
        console.log('Error retrieving data:', error);
      });
  });
});



const productsInCartEl = document.querySelector('.productsInCart')

function renderCartItems(cartItemsArray) {
  productsInCartEl.innerHTML = '';

  cartItemsArray.forEach((item) => {
    /*const productInCartContainer = document.createElement('li');
      productInCartContainer.classList.add('productInCartContainer');
      productInCartContainer.innerHTML = `
        <img class="productImage" src="${item.imgSrc}" alt="${item.name}">
        <div class="productInfoContainer">
          <div class="productTextContainer">
            <p class="productName">${item.name}</p>
            <p class="productPrice">${item.price}</p>
          </div>
          <div class="productBtnContainer">
            <div class="qtyContainer">
              <button class="minusBtn" id="-${item.id}">-</button>
              <p class="productQty">${item.quantity}</p>
              <button class="plusBtn" id="+${item.id}">+</button>
            </div>
            <p class="trashIcon" id="$i{item.id}">Remove</p>
          </div>
        </div>
      `;
      productsInCartEl.appendChild(productInCartContainer);
    });
  }*/
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

    const trashItem = document.createElement('p');
    trashItem.classList.add('trashItem');
    trashItem.textContent = "Remove ";
    trashItem.id = `i${item.id}`; // Set the ID attribute with the item ID

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can');

    trashItem.appendChild(trashIcon);

    productBtnContainer.append(trashItem);

  });
};

// Plus button click handler
function plusButtonClick(event) {
  const id = event.target.id.slice(1); // Remove the "+" prefix from the button ID
  // Find the item in the cartItems array
  const item = inCartItems.find((item) => item.id === id);

  if (item) {
    item.quantity++;
    // Update the displayed quantity
    const productQty = event.target.parentElement.querySelector('.productQty');
    productQty.textContent = item.quantity;

    const childRef = ref(database, `items/${id}`);
    // Update the quantity in the database
    update(childRef, { quantity: item.quantity });

    calculateTotalItemsInCart(inCartItems);
    calculateSubTotal(inCartItems);
  }
}

// Minus button click handler
function minusButtonClick(event) {
  const id = event.target.id.slice(1); // Extract item ID from the button's ID attribute
  const childRef = ref(database, `items/${id}`);

  // Find the item in the cartItems array
  const item = inCartItems.find((item) => item.id === id);

  if (item && item.quantity > 0) {
    item.quantity--; // Decrement the quantity
    const productQty = event.target.parentElement.querySelector('.productQty');
    productQty.textContent = item.quantity; // Update the displayed quantity

    // Update the quantity in the database
    update(childRef, { quantity: item.quantity });

    calculateTotalItemsInCart(inCartItems);
    calculateSubTotal(inCartItems);

    // Check if the quantity is 0
    if (item.quantity === 0) {
      // Remove the item from the inCartItems array
      const itemIndex = inCartItems.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        inCartItems.splice(itemIndex, 1);
        // Update the quantity in the database
      }

      update(childRef, { inCart: false, quantity: item.quantity });

      

      calculateTotalItemsInCart(inCartItems);
      calculateSubTotal(inCartItems);
      event.stopPropagation();

      // Remove the container from the DOM
      const productInCartContainer = event.target.closest('.productInCartContainer');
      productInCartContainer.remove();
    }
  }
}

function trashIconClick(event) {
  const id = event.target.id.slice(1);
  const childRef = ref(database, `items/${id}`);

  const productInCartContainer = event.target.closest('.productInCartContainer');
  productInCartContainer.remove();

  update(childRef, { inCart: false, quantity: 0 });

  // Remove the item from inCartItems
  const itemIndex = inCartItems.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    inCartItems.splice(itemIndex, 1);
  }

  // Update the total items count
  calculateTotalItemsInCart(inCartItems);
  calculateSubTotal(inCartItems);

  event.stopPropagation(); // Prevent event propagation
}

// Event delegation for plus, minus, and trash icon buttons
productsInCartEl.addEventListener('click', function(event) {
  if (event.target.classList.contains('plusBtn')) {
    plusButtonClick(event);
  } else if (event.target.classList.contains('minusBtn')) {
    minusButtonClick(event);
  } else if (event.target.classList.contains('trashIcon')) {
    trashIconClick(event);
  }
});

function calculateTotalItemsInCart(inCartItems) {
  const totalItemsInCart = document.querySelector('.totalItemsInCart');
  const totalItems = document.createElement('p');
  totalItems.classList.add('totalItems');

  // Calculate the total quantity of items
  const totalQuantity = inCartItems.reduce((total, item) => total + item.quantity, 0);

  totalItems.textContent = totalQuantity;

  // Update the total items display
  totalItemsInCart.innerHTML = '';
  totalItemsInCart.append(totalItems);
} 

const subTotalEl = document.querySelector('.subTotal');

function calculateSubTotal(inCartItems) {
  if (inCartItems.length === 0) {
    subTotalEl.textContent = '0.00'; // Set subtotal to 0 when cart is empty
  } else {
    const subTotal = inCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    subTotalEl.textContent = subTotal.toFixed(2);
  }
};
