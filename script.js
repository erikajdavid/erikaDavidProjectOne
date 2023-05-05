const hamburgerMenu = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobileNav');

hamburgerMenu.addEventListener('click', function(){
    hamburgerMenu.classList.toggle('activated');
    mobileMenu.classList.toggle('activated');
});

const addedToCart = document.querySelector('.cartItemNumber');
let defaultNumber = 0;
function updateCartNumber() {
    defaultNumber = defaultNumber + 1; //otherwise, defaultNumber++ only
    console.log(defaultNumber); //inside function because you want this value console logged each time. 
    addedToCart.textContent = defaultNumber;
}

//updateCartNumber(); //no argument (in this case number) is passed because no parameters were set. 

//document.querySelector('.addToCartBtn').addEventListener('click', updateCartNumber);

const addToCartButton = document.querySelectorAll('.addToCartBtn');
addToCartButton.forEach(function(button) {
    button.addEventListener('click', function() {
        console.log(updateCartNumber());
    });
});








