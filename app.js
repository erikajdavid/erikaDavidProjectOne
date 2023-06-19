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
      ![...addToCartBtnEl].some(button => button.contains(event.target))
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
    trashItem.id = `i${item.id}`; // Set the ID attributewith the item ID
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can' );
    trashItem.appendChild(trashIcon);
    productBtnContainer.append(trashItem);

  });
};

// Refactor click handlers for plus, minus, and remove buttons
function handleClick(event) {
  const id = event.target.id.slice(1); // Remove the "+" or "-" prefix from the button ID
  const item = inCartItems.find((item) => item.id === id);
  const productQty = event.target.parentElement.querySelector('.productQty');

  if (item) {
    if (event.target.classList.contains('plusBtn')) {
      item.quantity++;
      productQty.textContent = item.quantity;
    } else if (event.target.classList.contains('minusBtn')) {
      item.quantity--;
      productQty.textContent = item.quantity;
      if (item.quantity === 0) {
        event.stopPropagation();
        removeItemFromCart(id);
        if (inCartItems.length === 0) {
          emptyCartEl.style.display = "flex";
          fullCartEl.style.display = "none";
        }
        return;
      }
    } else if (event.target.classList.contains('trashItem')) {
      event.stopPropagation();
      removeItemFromCart(id);
      if (inCartItems.length === 0) {
        emptyCartEl.style.display = "flex";
        fullCartEl.style.display = "none";
      }
      return;
    }

    const childRef = ref(database, `items/${id}`);
    update(childRef, { quantity: item.quantity });

    calculateTotalItemsInCart(inCartItems);
    calculateSubTotal(inCartItems);
  }
}

// Create a function to remove an item from the cart
function removeItemFromCart(itemId) {
  const childRef = ref(database, `items/${itemId}`);
  const itemIndex = inCartItems.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    inCartItems.splice(itemIndex, 1); // Remove the item from the inCartItems array
    console.log(inCartItems);
  }

  update(childRef, { inCart: false, quantity: 0 });

  renderCartItems(inCartItems);
  calculateTotalItemsInCart(inCartItems);
  calculateSubTotal(inCartItems);
}

// Attach event listener for plus, minus, and remove buttons using event delegation
productsInCartEl.addEventListener('click', function (event) {
  if (event.target.classList.contains('plusBtn') || event.target.classList.contains('minusBtn') || event.target.classList.contains('trashItem')) {
    handleClick(event);
  }
});

function calculateTotalItemsInCart(inCartItems) {
  const totalItemsInCart = document.querySelector('.totalItemsInCart');
  const totalItems = document.createElement('p');
  totalItems.classList.add('totalItems');

  // Calculate the total quantity of items
  const totalQuantity = inCartItems.reduce(function(total, item) {
    return total + item.quantity;
  }, 0);

  totalItems.textContent = totalQuantity;

  // Update the total items display
  totalItemsInCart.innerHTML = '';
  totalItemsInCart.append(totalItems);

  if (totalQuantity === 0) {
    totalItemsInCart.style.display = "none";
  } else {
    totalItemsInCart.style.display = "block";
  }
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

function clearTheCart() {
  const clearAllEl = document.querySelector('.clearTheCart');
  clearAllEl.addEventListener('click', function() {
    if(inCartItems.length > 0) {
      emptyCartEl.style.display = "flex";
      fullCartEl.style.display = "none";

      for (let item in inCartItems) {
        const id = inCartItems[item].id;
        const childRef = ref(database, `items/${id}`);
        update(childRef, { inCart: false, quantity: 0}) 
      }

      inCartItems = []; // Clear the inCartItems array

      //update the total items to zero;
      const clearToZero = document.querySelector('.totalItems');
      clearToZero.textContent = 0;
      clearToZero.style.display = "none";
    }  
  })
}

clearTheCart();

/*
  //when we push a newItem to the inCartItems array, it takes on the following data structure. 
  //notice how each item object doesn't have a name of item1, item2 or item3 - unlike our JSON data in firebase where each object is given a name of item1, item2, item3, etc. 
  //each item object in the inCartItems array has index value instead. the first item object has an index value of 0. the second has an index value of 1. and the last has an index value of 2.  

  const inCartItems = [
    { name: "apple", id: "item1", quantity: 2 }, //this is an item object
    { name: "banana", id: "item2", quantity: 3 }, //this is an item object
    { name: "cherry", id: "item3", quantity: 1 } //this is an item object
  ];

  let existingItemIndex = inCartItems.findIndex((item) => item.id === itemId); 
  
  //item in this code refers to an item object in the inCartItems array. 
  //by writing item.id we are extracting the value inside the item object id. 
  //the item.id for apple is item1.
  //the item.id for banana is item2.
  //the item.id for cherry is item 3. 

  //the itemId we defined in our code is equal to the id we gave the add to cart buttons in the HTML. the first button is item1, the second is item2, etc. 

  //when we click on the button with the itemId of item1 for example, if it already exists in the inCartItems array, we just want to update the quantity by 1. 

  //in order for our computer to know that the item object already exists in the cart, we have to match the item.id with the button id (itemId we defined in our code). 
  */