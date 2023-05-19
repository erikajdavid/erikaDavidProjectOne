//SELECT ELEMENTS
const productsEl = document.querySelector('.productGallery');
const cartItemsEl = document.querySelector('.orderItems');
const totalItemsEl = document.querySelector('.totalItems');
const subTotalPriceEl = document.querySelector('.subTotalPrice')
const itemsInCartEl = document.querySelector('.cartItemNumber');
const totalTaxPriceEl = document.querySelector('.totalTaxPrice');
const finalTotalPriceEl = document.querySelector('.finalTotalPrice');


//RENDER SHOP PRODUCTS ON PRODUCT PAGE WITH INNERHTML
//ADDING TO THE PAGE DYNAMICALLY
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

//RENDER CART ITEMS WITH INNERHTML
//ADDING TO THE PAGE DYNAMICALLY
function renderCartItems() {
    cartItemsEl.innerHTML = ""; //clear cart element
    myCart.forEach((item) => {
        cartItemsEl.innerHTML += `
        <li class="cartItemInfo">
            <div class="cartItemProduct">
                <img src="${item.imgSrc}" alt="${item.name}">
                <p class="productName">${item.name}</p>
                <p class="productPrice">${item.price}</p>
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
      let numberOfUnits = item.numberOfUnits
      if(item.id === id) {
          if(action === "minus" && numberOfUnits > 0){ // this line is to prevent the number from going below 0
              numberOfUnits--;
            } else if (action === "plus"){
              numberOfUnits++;
            }
      }
      return { // need to return to see the array because of the map method
          ...item, //this restructures the item
          numberOfUnits,
      };
      
  });
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


//UPDATE THE CART
function updateCart() {
    renderCartItems(); //this renders the products to the cart 
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