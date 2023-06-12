
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

  // Initialize Firebase

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const dbRef = ref(database);

  const body = document.body;
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  body.appendChild(overlay);

//click on cart icon to open the cart app
    //target the cart icon and save in a variable. 
    const cartIconEl = document.querySelector('.cartIcon');
    //target the cart app and save it in a variable.
    const cartAppEl = document.querySelector('.cartApp');

//create a function to toggle the cart app

function toggleCart() {
    //we want code block to toggle the cart. 
    cartAppEl.classList.toggle('activated');
    overlay.classList.toggle('activated');
}

    //addEventListener to the cart icon
    //we want to add the event listener to the element that will trigger an action. 
    cartIconEl.addEventListener('click', function() {
        //code block to open the cart.
        //display cart app
        toggleCart(); //calling the function, a function will not run if you don't call it. 
    })

//click on close icon to close the cart app
    //target the close icon and save it in a variable.
    const closeCartEl = document.querySelector('.closeCart');
    //addEventListener to the close icon
    closeCartEl.addEventListener('click', function(){ //first argument is an event. in this case the event is a click. 
        //code block to remove cart from the display. 
        //cartAppEl.classList.toggle('activated');
        //cartAppEl.style.display = "none"; if we use this, the cart will not reappear when the cart icon is clicked. 
        toggleCart();
    });

//click on the continue shopping link 
    //target the continue shopping link and save it in variable. 
    const continueShoppingEl = document.querySelector('.continueShopping');
    //addEventlistner
        //on click you want to run a function to close the cart app. 
    continueShoppingEl.addEventListener('click', function() {
        //remove the cart from the display. 
        toggleCart();
    });

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
    
//doesn't need to be save in a variable because window is built into JS. 
//addEventlistener
//on click run a function to close the cart

const addToCartBtnEl = document.querySelectorAll('.addToCartBtn');
const emptyCartStuff = document.querySelector('.emptyCartStuff');
const notEmptyCartStuff = document.querySelector('.notEmptyCartStuff');

// Create an empty object to store the cart items
const inCartItems = {};

addToCartBtnEl.forEach((button) => {
  button.addEventListener('click', function(event) {
    toggleCart();

    emptyCartStuff.style.display = "none";
    notEmptyCartStuff.style.display = "block";

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
          console.log(inCartItems);
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

    productBtnContainer.append(trashIcon);

    // Event listener for minus button
    minusBtn.addEventListener('click', function (event) {
      const id = event.target.id.slice(2);
      //console.log(item); // Extract item ID from the button's ID attribute
      const itemId = `item${id}`;
      console.log(itemId);
      const childRef = ref(database, `items/${itemId}`);

      if (item.quantity > 0) {
        item.quantity--; // Decrement the quantity
        productQty.textContent = item.quantity; // Update the displayed quantity
        // Update the quantity in the database
        update(childRef, { quantity: item.quantity });
      } else if (item.quantity === 0) {
        productQty.textContent = 0;
        productInCartContainer.remove('productInCartContainer');
        update (childRef, { inCart: false, quantity: 0 });
      }
    });

     // Event listener for minus button
     plusBtn.addEventListener('click', function (event) {
      const id = event.target.id.slice(2); // Extract item ID from the button's ID attribute
      console.log(id);
      const itemId = `item${id}`;
      console.log(itemId);

      const childRef = ref(database, `items/${itemId}`);

        item.quantity++; // Decrement the quantity
        productQty.textContent = item.quantity; // Update the displayed quantity

        // Update the quantity in the database
        update(childRef, { quantity: item.quantity });
    });
  });
}

//if product qty = 0, remove it from the cart
  //currently there is a bug where inCart: true, quantity: 0, and one more click to remove the container makes it inCart: false, quantity: 0

//need function remove item from cart
//need function clear the cart
//need function to increment total items in cart
//need function to calculate subTotal







