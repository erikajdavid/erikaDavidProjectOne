
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
  const dbRef = ref(database, 'items');

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

let productQty = 0;

addToCartBtnEl.forEach((button) => {
  button.addEventListener('click', function(event) {
    toggleCart();

    //function to render products to cart
    productQty++;

    //if item exist in cart, keep incremeting the qty

    emptyCartStuff.style.display = "none";
    notEmptyCartStuff.style.display = "block";

    updateDb(event); //this is to update the firebase
  });
});

onValue(dbRef, (data) => {
  const firebaseData = [];

  if(data.exists()) {
    const payload = data.val();

    for (let item in payload) {
      firebaseData.push(payload[item]);
    }

    const inCartItems = firebaseData.filter(item => {
    return item.inCart === true;
    });

    renderCartItems(inCartItems);

  } else {
    console.log('No data to report.');
  }
});

const updateDb = (event) => {
  if (event.target.tagName === 'BUTTON') {
    const id = event.target.id.slice(1);
    const itemId = `item${id}`;

    const childRef = ref(database, `items/${itemId}`);
    update(childRef, { inCart: true, quantity: productQty });
  }
}

const productsInCartEl = document.querySelector('.productsInCart');

function renderCartItems(inCartItems) {
  productsInCartEl.innerHTML = '';
  
  inCartItems.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('productInCartContainer');
    
    const p = document.createElement('p');
    p.classList.add('productName');
    p.textContent = item.name;

    productsInCartEl.append(li);
    li.append(p);
  });
}










//#Project Proposal

//MVP
//Add all product data in JSON format to Firebase
//Display the number of items in the cart
//Allows users to view what has been added to their cart. -Remove an item from the cart. -See the total price of all items.

//Wireframe
//In PDF

//Pseudocode

//HTML/CSS

//Cart item number counter
//Insert div with position absolute, with the cart icon as the relative reference. 
//This div will contain the number of items inside the user's cart.

//Cart Icon
// We want to be able to access this icon to open or close the cart app wherever we are on the page. To do this, we have to set the header nav bar to position fixed. 

//Cart
//Insert div for the cart.
//Give the cart a width in px (maybe between 300-400px) so that the width stays the same when the page is resized. 
    //for mobile use, adjust the width accordingly. 
//The cart is only on display when the cart icon is clicked. It exists, but it out of view. 
    //Create a transition here to slide the cart into view. 
//When the cart is empty, display "Your cart is empty" message and continue shopping link only. 
//When the cart is full, remove "Your cart is empty" and continue shopping link. 
    //Have a section (a ul) to render the products (li) to the cart, and another section to display the total price and a checkout btn. 
    //The products that are rendered to the cart are being added dynamically, which means they are not hardcoded into the HTML. We need to set up our JSON file with the product information and we need a section (ul) in the cart to append the products (li) to. 
//Make sure to add a close icon to the cart app. When clicked, it will remove the cart app from the view. 

//When the cart is full
//Display a total price element and a checkout btn. 

//JS Functionality

//Open/exit cart

//Clicking on the cart icon is what will display the cart app on the page. 
//Target the cart icon and save it in a variable. 
//Target the cart app and save it in a variable. 
//Add an event listener to the cart icon. 
//On click, it should execute a function that will display(maybe toggle) the cart app into view. 
//The empty cart should only display the close icon, "your cart is empty" message and continue shopping link. 
//To exit the cart, the user can toggle the cart icon, or the close icon, continue shopping link or click anywhere outside the cart (window)
	//target all these elements and save in a variable.
	//attach event listeners
	//on click, execute function that will close the cart. 
	//Experiment with toggle, or variable.style.display = "none" or variable.classList.remove('.classname').

//Adding/removing product to/from the cart
//We have to give the add to cart button functionality. 
//By clicking on this button, it makes the cart come into view. 
//Target the add to cart button and save it in a variable. 
//We have to use the forEach method because we want all add to cart buttons to have the same functionality. 
//Attach an eventlistener to the button. 
//On click, it should execute function to make the cart come into view. 
//When an item is added to the cart, 
	//append/render the products dynamically into an empty cart array with the JSON we imported in firebase.
	//display the product's initial quantity in cart to 1 
	//in firebase, in the imported JSON, we want to update the properties inCart and quantity: 
		//inCart: false to inCart: true 
		//quantity: 0 to quantity: 1 
	//the quantity should also reflect in the cart item number counter. 
	//target the counter and save in a variable. 
	//Because the cart is no longer empty, remove "your cart is empty" message and continue shopping link. 
	//Display the total price and the checkout button.

//When the items render to the cart, there should be +/- buttons to adjust the quantity of the products. 
//These buttons needs to be targeted and save in their own variables. 
//Attach event listener. 
//On click, they need to perform a function to add/subtract
//The quantity element also needs to be targeted and saved in a variable. We want this to display the new quantity here when +/- buttons are used. 
//Firebase should be listening. 
	// probably need to use onValue and update functions. 
	//quantity needs to be updated.
//when the + button is clicked on, we want to increase the quantity by one and display the new quantity. 
//this should also reflect in the cart item counter. 
//when the - button is clicked on, we want to decrease the quantity by one and display the new quantity. 
//this should also reflect in the cart item counter. 
//If the quantity > 0, we want to set the new quantity to 0 because a user cannot purchase a negative quantity of products. 
//When the quantity is equal to 0, we want to remove the product from the cart array. 
//when the user click on the trash can icon, we want to remove the product from the array. 
//this should also reflect in the cart item counter. 
//firebase needs to be updated to reflect that the product is not in the cart and the quantity of that product is 0. 
//when the user removes all of the products from the cart, //display the "your cart is empty" and the continue shopping link.

//If user clicks on add to cart button for product that already exist in the cart, we don't want to create a new li item for that. we want to add the quantity to the existing item and its quantity in the cart. 
//this also needs to reflect in firebase and the cart item counter.






