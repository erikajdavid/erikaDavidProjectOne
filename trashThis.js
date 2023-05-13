// select elements

const productEl = document.querySelector(".productGallery");
const cartItemsEl = document.querySelector(".orderItems");
const subTotalEl = document.querySelector('.subTotal');
const theCart = document.querySelector('.cartItemNumber');
const taxEl = document.querySelector('.tax');
const finalTotalEl = document.querySelector('.finalTotal');

// create product elements
function createProductElements(product) {
    const li = document.createElement("li");
    const imageContainer = document.createElement("div");
    const image = document.createElement("img");
    const infoContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    const name = document.createElement("h3");
    const description = document.createElement("p");
    const price = document.createElement("p");
    const shopButtons = document.createElement("div");
    const minus = document.createElement("button");
    const quantity = document.createElement("p");
    const plus = document.createElement("button");
  
    // set class names
    li.className = "product";
    imageContainer.className = "imageContainer";
    infoContainer.className = "infoContainer";
    textContainer.className = "textContainer";
    name.className = "name";
    description.className = "description";
    price.className = "price";
    shopButtons.className = "shopButtons";
    minus.className = "minus";
    quantity.className = "quantity";
    plus.className = "plus";
  
    // set attributes and text content
    image.src = product.imgSrc;
    image.alt = product.name;
    name.textContent = product.name;
    description.textContent = product.description;
    price.textContent = product.price + " each";
    minus.textContent = "-";
    quantity.textContent = "0";
    plus.textContent = "+";
  
    // add event listeners
    minus.addEventListener("click", () => changeNumberOfUnits("minus", product.id));
    plus.addEventListener("click", () => addToCart(product.id));
  
    // append child elements
    imageContainer.appendChild(image);
    textContainer.appendChild(name);
    textContainer.appendChild(description);
    textContainer.appendChild(price);
    shopButtons.appendChild(minus);
    shopButtons.appendChild(quantity);
    shopButtons.appendChild(plus);
    infoContainer.appendChild(textContainer);
    infoContainer.appendChild(shopButtons);
    li.appendChild(imageContainer);
    li.appendChild(infoContainer);
  
    return li;
  }
  
  //render products
  function renderProducts() {
    const fragment = document.createDocumentFragment();
    product.forEach((product) => {
      fragment.appendChild(createProductElements(product));
    });
    productEl.appendChild(fragment);
  }
  
  renderProducts();

// cart array

let myCart = [];

//this changes the value in the shop quantity and the cart icon, but without it, the products don't render in the cart. 

function addToCart(id) {
    if (myCart.some((item) => item.id === id)) {
      changeNumberOfUnits("plus", id);
    } else {
      const item = product.find((product) => product.id === id);
  
      // update product quantity
      item.quantity -= 1;
  
      myCart.push({
        ...item, ///... is a spread operator to copy all properties of the item object
        numberOfUnits: 1,
      });
    }
    updateCart();
    removeItemFromCart();

  }

//updates cart with the products and the subtotal

function updateCart() {
    renderCartItems();
    renderSubTotal();
    renderTax();
    renderFinalTotal();
};

//calculate and render subtotal in app

function renderSubTotal(){
    let totalPrice = 0, totalItems = 0;

    myCart.forEach(item => {
        totalPrice += item.price * item.numberOfUnits,
        totalItems += item.numberOfUnits
    });

    subTotalEl.innerHTML = `
        Sub-Total (${totalItems} items): $${totalPrice.toFixed(2)}
        `;
    
    theCart.innerHTML = totalItems;
};

//calculate and render tax in app

function renderTax() {
  let taxRate = 0.13;
  let totalPrice = 0;
  let totalTax = 0; // Initialize totalTax to 0

  myCart.forEach(item => {
    totalPrice += item.price * item.numberOfUnits;
  });

  totalTax += totalPrice * taxRate;
  
  taxEl.innerHTML = `
    Total tax (HST 13%): $${totalTax.toFixed(2)}
  `;
};

//calculate final total

function renderFinalTotal() {
  let taxRate = 0.13;
  let totalPrice = 0;
  let totalTax = 0;
  let finalTotal = 0;

  myCart.forEach(item => {
    totalPrice += item.price * item.numberOfUnits;
  });

  totalTax = totalPrice * taxRate;
  finalTotal = totalPrice + totalTax;

  finalTotalEl.innerHTML = `
    Final total: $${finalTotal.toFixed(2)}
  `;
  finalTotalEl.style.borderTop = "1px solid black";
}

//renders the products in the app
function renderCartItems() {
    while (cartItemsEl.firstChild) {
        cartItemsEl.removeChild(cartItemsEl.firstChild);
    } // clear cart element

    myCart.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('cartItemInfo');

        const productDiv = document.createElement('div');
        productDiv.classList.add('cartItemProduct');
        li.appendChild(productDiv);

        const img = document.createElement('img');
        img.src = item.imgSrc;
        img.alt = item.name;
        productDiv.appendChild(img);

        const nameP = document.createElement('p');
        nameP.classList.add('productName');
        nameP.textContent = item.name;
        productDiv.appendChild(nameP);

        const priceP = document.createElement('p');
        priceP.classList.add('productPrice');
        priceP.textContent = (item.price *  item.numberOfUnits).toFixed(2);
        productDiv.appendChild(priceP);

        const controlsDiv = document.createElement('div');
        controlsDiv.classList.add('cartItemControls');
        li.appendChild(controlsDiv);

        const removeDiv = document.createElement('div');
        removeDiv.classList.add('cartItemRemove');
        removeDiv.onclick = () => removeItemFromCart(item.id);
        controlsDiv.appendChild(removeDiv);

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trashCan');
        removeDiv.appendChild(trashIcon);

        const removeP = document.createElement('p');
        removeP.textContent = 'Remove';
        removeDiv.appendChild(removeP);

        const quantityDiv = document.createElement('div');
        quantityDiv.classList.add('cartItemQuantity');
        controlsDiv.appendChild(quantityDiv);

        const minusBtn = document.createElement('button');
        minusBtn.classList.add('minusBtn');
        minusBtn.onclick = () => changeNumberOfUnits('minus', item.id);
        minusBtn.textContent = '-';
        quantityDiv.appendChild(minusBtn);

        const quantityP = document.createElement('p');
        quantityDiv.classList.add('cartQuantity');
        quantityP.textContent = item.numberOfUnits;
        quantityDiv.appendChild(quantityP);

        const plusBtn = document.createElement('button');
        plusBtn.classList.add('plusBtn');
        plusBtn.onclick = () => changeNumberOfUnits('plus', item.id);
        plusBtn.textContent = '+';
        quantityDiv.appendChild(plusBtn);

        cartItemsEl.appendChild(li);
    });
};


//this changes the number of units for an item in the cart app. 

function changeNumberOfUnits(action, id) {
    myCart = myCart.map((item) => {

        let numberOfUnits = item.numberOfUnits
        if(item.id === id) {
            if(action === "minus" && numberOfUnits > 1){
                numberOfUnits--;
              } else if (action === "plus"){
                numberOfUnits++;
              }
        }
        return {
            ...item,
            numberOfUnits,
        };
    });
    updateCart();
}

//this removes the item completely from teh cart app by pressing on the trashCan. 

function removeItemFromCart(id) {
    myCart = myCart.filter((item) => {
      if (item.id === id) {
        // update product quantity
        const productIndex = product.findIndex((product) => product.id === id);
        product[productIndex].quantity += item.numberOfUnits;
  
        return false;
      }
      return true;
    });
  
    updateCart();
  } 

//

//add/remove quantity from shop product

//Get cart count element and default count
let defaultNumber = 0;

// this increases the quantity in the shop product. 
function increaseShopNumber() {
  defaultNumber++;
  theCart.textContent = defaultNumber;
}

// Add click event listeners to plus buttons
const shopIncrement = document.querySelectorAll('.plus');
shopIncrement.forEach(function(element) {
  element.addEventListener('click', function() {
    increaseShopNumber();
    const quantityElement = element.previousElementSibling; //this target the quantity, element before plus button
    quantityElement.textContent = Number(quantityElement.textContent) + 1;
  });
});

// this decreases the quanity in the shop product. 
function decreaseShopNumber() {
  defaultNumber--;
  if (defaultNumber < 0) {
    defaultNumber = 0;
  }
  theCart.textContent = defaultNumber;
}

// Add click event listeners to minus buttons
const shopDecrement = document.querySelectorAll('.minus');
shopDecrement.forEach(function(element) {
  element.addEventListener('click', function() {
    const quantityElement = element.nextElementSibling; // this targets the quantity, element next to the minus button
    const currentQuantity = Number(quantityElement.textContent); //number is a built in JS feature than converts the value to a number.
    if (currentQuantity > 0) {
      decreaseShopNumber();
      quantityElement.textContent = currentQuantity - 1;
    }
  });
});

