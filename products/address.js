let autocomplete;

function initAutocomplete() {

  const input = document.getElementById("addressInput");

  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["address"],
    componentRestrictions: { country: "us" }
  });

}

window.onload = initAutocomplete;

function saveAddress() {

  const address = document.getElementById("addressInput").value;

  if (!address) {
    alert("Please select address");
    return;
  }

  localStorage.setItem("deliveryAddress", address);

  window.location.href = "payment.html";

}

function loadSavedAddress() {

  const savedAddress = localStorage.getItem("deliveryAddress");

  if (savedAddress) {
    document.getElementById("addressInput").value = savedAddress;
  }
}

window.onload = function() {
  initAutocomplete();
  loadSavedAddress();
}
autocomplete.addListener("place_changed", function(){

 const place = autocomplete.getPlace();

 const lat = place.geometry.location.lat();
 const lng = place.geometry.location.lng();

 localStorage.setItem("lat", lat);
 localStorage.setItem("lng", lng);

});

function renderCheckoutPage() {

  document.body.innerHTML = `

    <div class="checkout-page">

      <h2>Select Delivery Location</h2>

      <div style="width:40%;height:450px;justify-content:center;">
        <iframe
          width="40%"
          height="450"
          style="border:0"
          loading="lazy"
          allowfullscreen
          src="https://www.google.com/maps?q=12.9716,77.5946&z=15&output=embed">
        </iframe>
      </div>

      <button onclick="renderPaymentPage()" style="margin-top:20px;padding:10px 20px;">
        Continue to Payment
      </button>

    </div>

  `;
}