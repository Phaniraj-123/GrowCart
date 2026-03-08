

// add button
// cart count
// let cartCount = 0;
// const cartCountEl = document.getElementById("counting");

// document.querySelectorAll(".cart-control").forEach(btn => {

//   btn.addEventListener("click", function () {
  

//     let count = 1; // initial quantity

//     // Create wrapper
//     const wrapper = document.createElement("div");
//     wrapper.className = "qty-wrapper";
//     wrapper.innerHTML = `
//       <button class="qty-btn minus">-</button>
//       <span class="qty">${count}</span>
//       <button class="qty-btn plus">+</button>
//     `;

//     // Replace button with wrapper
//     this.replaceWith(wrapper);

//     cartCount++;
//     cartCountEl.innerText = cartCount;

//     const plusBtn = wrapper.querySelector(".plus");
//     const minusBtn = wrapper.querySelector(".minus");
//     const qtyEl = wrapper.querySelector(".qty");

//     plusBtn.addEventListener("click", (e) => {
//       e.stopPropagation(); //prevents triggering product preview
//       count++;
//       cartCount++;
//       qtyEl.innerText = count;
//       cartCountEl.innerText = cartCount;
      
//     });

//     minusBtn.addEventListener("click", (e) => {
//       e.stopPropagation(); //prevents triggering product preview
//       if (count > 0) {
//         count--;
//         cartCount--;
//         qtyEl.innerText = count;
//         cartCountEl.innerText = cartCount;
        
//       }

//       if (count === 0) {
//         wrapper.replaceWith(btn); // restore Add button
//       }
//     });
//   });

// });
// render cart count on page load








// cart accessibility
document.getElementById("cartCount").onclick = () => {
    document.getElementById("cart-sidebar").classList.toggle("active");
};
document.querySelector(".closeCart").onclick = () => {
    document.getElementById("cart-sidebar").classList.remove("active");
};




// cart=["10101S1"];

// function addToCart(productId) {
//   let cart = JSON.parse(localStorage.getItem("cart")) || [];

//   // check if product already exists
//   const existing = cart.find(item => item.id === productId);

//   if (existing) {
//     existing.qty += 1;
//   } else {
//     cart.push({ id: productId, qty: 1 });
//   }

//   localStorage.setItem("cart", JSON.stringify(cart));
// //   alert("Product added to Cart!");
//   updateCartCount();
// }