var stripe = Stripe('pk_test_h6STxVuAARqR5Co1hj9spBek00nbShVX2P');
let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
var itemsToPurchase = [];

document.querySelector("button").disabled = true;

function logSubmit(event) {
document.querySelector(".sr-info").classList.add("hidden");
document.querySelector(".sr-main").classList.remove("hidden");
for (i of Object.keys(cartItems)) {
  itemsToPurchase.push({
    id : cartItems[i].product.productType,
    quantity : cartItems[i].inCart,
    email : document.getElementById("email").value
  })
}
fetch("/create-payment-intent", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(itemsToPurchase)
})
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return setupElements(data);
  })
  .then(function({ stripe, card, clientSecret }) {
    document.querySelector("button").disabled = false;

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      pay(stripe, card, clientSecret);
    });
  });
return false;
};
var setupElements = function(data) {
  stripe = Stripe(data.publishableKey);
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", {hidePostalCode: true,  style: style });
  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
  };
};


var pay = function(stripe, card, clientSecret) {
  changeLoadingState(true);

  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        showError(result.error.message);
      } else {
        changeOrderStatus();
        window.localStorage.clear();
        orderComplete(clientSecret);
      }
    });
};

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {
    document.querySelector(".sr-main").classList.add("hidden");
    document.querySelector(".sr-result").classList.remove("hidden");
  });
};

var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
function changeOrderStatus() {
  let productString = "";
  Object.values(cartItems).map(item => {
    productString = (productString +item.product.productID + "," +
       item.name + "," + item.color.name + "," + item.size.sizeName + "," + item.price + ",in cart: "+item.inCart+",");
  });
  $.ajax({
    url: '../order',
    type: 'POST',
    datatype: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      "product": productString,
      "name": document.getElementById("fname").value,
      "email": document.getElementById("email").value,
      "phone": document.getElementById("telephone").value,
      "ZIPcode": document.getElementById("zip").value,
      "city": document.getElementById("city").value,
      "address": document.getElementById("adr").value,
      "apartmentnumber": document.getElementById("apartnmb").value
    }),
    success() {
    }
  });
}