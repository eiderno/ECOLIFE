let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

updateCartDisplay();

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', addToCart);
});

function addToCart(event) {
    const button = event.target;
    const productId = button.dataset.id;
    const productName = button.dataset.name;
    const productPrice = parseFloat(button.dataset.price);
    const productImage = button.parentElement.querySelector('img').src;

   const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
         cart.push({id: productId, name: productName, price: productPrice, quantity: 1, image: productImage});
    }


    updateCartDisplay();
    saveCart();
}
function openCart() {
    cartModal.style.display = 'flex';
    renderCartItems();
    updateCartTotal();
}

function closeCart() {
    cartModal.style.display = 'none';
}
function updateCartDisplay() {
     let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
     cartCount.textContent = totalItems;
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
         <div class="cart-item-info">
             <img src="" alt="${item.name}">
              <div class="cart-item-details">
                   <p><strong>${item.name}</strong></p>
               <p>Цена: ${item.price} ₽</p>
            </div>
         </div>
           <div class="cart-item-controls">
               <button class="decrease-quantity" data-id="${item.id}">-</button>
               <span class="quantity">${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
             <button class="remove-item" data-id="${item.id}">Удалить</button>

        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });
    // Добавляем слушатели событий для кнопок +/- и удаления
      document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });

}
 function increaseQuantity(event) {
    const productId = event.target.dataset.id;
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCartDisplay();
        renderCartItems();
        updateCartTotal();
        saveCart();
    }
}
function decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
           updateCartDisplay();
         renderCartItems();
        updateCartTotal();
        saveCart();
    }
}
function removeItem(event) {
    const productId = event.target.dataset.id;
    cart = cart.filter(item => item.id !== productId);
       updateCartDisplay();
        renderCartItems();
    updateCartTotal();
    saveCart();
}
function updateCartTotal() {
    let totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} ₽`;
}
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}