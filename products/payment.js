function renderPaymentPage() {

  document.body.innerHTML = `

    <div class="payment-page" style="justify-content:center;align-items:center;display:flex;flex-direction:column;padding:20px;">

      <h2>Select Payment Method</h2>

      <div class="payment-options" style="display:flex;flex-direction:column;margin-top:20px; gap:15px; background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;width:400px;">

        <label class="payment-method" style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">
          <input type="radio" name="payment" value="card">
          Pay with Card
        </label>

        <label class="payment-method" style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">
          <input type="radio" name="payment" value="paypal">
          Pay with PayPal
        </label>

        <label class="payment-method" style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">
          <input type="radio" name="payment" value="stripe">
          Pay with stripe
        </label>

        <label class="payment-method" style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">
          <input type="radio" name="payment" value="cod">
          Pay on Delivery
        </label>

      </div>

      <div id="card-details" style="display:none;margin-top:20px;" >

        <input type="text" placeholder="Card Number" class="payment-input" maxlength="19" required style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">
        <input type="text" placeholder="Expiry Date" class="payment-input" required style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">
        <input type="text" placeholder="CVV" class="payment-input" required style="background:#f9f9f9; padding:20px; border-radius:8px; border:1px solid pink;">

      </div>

      <button onclick="placeOrder()" style="margin-top:20px; background-color:green; padding:10px; color:white; border-radius:7px; height:40px; width:150px;">
        Place Order
      </button>

    </div>

  `;

  setupPaymentListeners();
}

function setupPaymentListeners() {

  const radios = document.querySelectorAll('input[name="payment"]');

  radios.forEach(radio => {

    radio.addEventListener("change", function() {

      const cardSection = document.getElementById("card-details");

      if (this.value === "card") {
        cardSection.style.display = "block";
      } else {
        cardSection.style.display = "none";
      }

    });

  });

}

function placeOrder(){

  const selected = document.querySelector('input[name="payment"]:checked');

  if(!selected){
    alert("Please select a payment method");
    return;
  }

  alert("Order placed successfully!");

}