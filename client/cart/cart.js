console.log("cart.js loaded");


function viewCart() {

  $("#the-cart").html($("#view-cart").html());
  
  displayCart ()
  showCartProducts();
}

function displayCart () {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".product");

  
  if (cartItems && productContainer) {
      productContainer.innerHTML = "";
      Object.values(cartItems).map(item => {
        productContainer.innerHTML += `

            <section id="cart"> 
              <div class="product">

                <header class="view-product">

                    <img src="../resources/images/${item.picture}" alt="">
                    
			        	</header>

			        	<div class="content">

                  <span>
                    <h1>${item.name}</h1>
                    <hr class="new1">
                  </span>  
                    
                    <div style="display: none" class="type small">${item.product.productID}</div>
                    <div style="display: none" class="type small">${item.product.productType}</div>
                    <div class="in-stock" style="display: none" class="type small">${item.product.inStock}</div>

                    <h3><b>Storlek:</b> ${item.size.sizeName}</h3>

				          	<h3><b>Färg:</b> ${item.color.name}</h3>

                    
                    
                </div>
                <footer class="content">
                  <span class="quantity-minus"><i class="fa fa-minus-square"></i></span>
				      	  <span class="quantity">${item.inCart}</span>
                  <span class="quantity-plus"><i class="fa fa-plus-square"></i></span>
                  <a class="remove">
                    <span class="delete"><i class="fa fa-trash"></i></h3>
                  </a>

                  <h2 class="total-price">
                    ${item.price * item.inCart} kr
                  </h2>

                  <h2 class="price">
                    ${item.price} kr
                  </h2>
                </footer>
              </div>
              
              
            </section>
            
          
        `;
      });

  }else{
    
    $("#the-cart").html("<h1>Du har inga produkter just nu!</h1>");

  }
  
  pictureButtons();
  nameButtons();
  removeButtons();
  quantityMinusButtons();
  quantityPlusButtons();

}

let productID;
let cartItems = localStorage.getItem("productsInCart");
let cartAmount = localStorage.getItem("cartAmount");

cartAmount = parseInt(cartAmount);
cartItems = JSON.parse(cartItems);

function pictureButtons(){
  let pictureButtons = document.querySelectorAll(".product header");
  let productType;
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  for (let i=0; i < pictureButtons.length; i++){
    pictureButtons[i].addEventListener("click", ()=> {
    productType = pictureButtons[i].parentElement.children[1].children[2].textContent.trim();
    sessionStorage.setItem("reloading", 1);
    sessionStorage.setItem("redirect", productType);
    window.location = "../webbshop";

  }); 
}
}

function nameButtons(){
  let nameButtons = document.querySelectorAll(".product h1");
  let productType;
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);

  for (let i=0; i < nameButtons.length; i++){
    nameButtons[i].addEventListener("click", ()=> {
    productType = nameButtons[i].parentElement.parentElement.children[2].textContent.trim();
    sessionStorage.setItem("reloading", 1);
    sessionStorage.setItem("redirect", productType);
    window.location = "../webbshop";

  }); 
}
}

function removeButtons(){
let removeButtons = document.querySelectorAll(".product a");


for (let i=0; i < removeButtons.length; i++){
  removeButtons[i].addEventListener("click", ()=> {
    quantity = parseInt(removeButtons[i].parentElement.parentElement.children[2].children[1].textContent.trim());
    productID = removeButtons[i].parentElement.parentElement.children[1].children[1].textContent.trim();

    cartAmount = cartAmount - cartItems[productID].inCart;
    cartItems[productID].inCart = 0;
    delete cartItems[productID];

    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
    localStorage.setItem("cartAmount", cartAmount);
    changeAmountInCart();
  }); 
}
}

function quantityMinusButtons(){
  let quantityMinusButtons = document.querySelectorAll(".product span.quantity-minus");
 
  for (let i=0; i < quantityMinusButtons.length; i++){
    quantityMinusButtons[i].addEventListener("click", ()=> {
      productID = quantityMinusButtons[i].parentElement.parentElement.children[1].children[1].textContent.trim();
      quantity = parseInt(quantityMinusButtons[i].parentElement.parentElement.children[2].children[1].textContent.trim()) - 1;

      if (quantity > 0){

      cartAmount = cartAmount - cartItems[productID].inCart + quantity;
      cartItems[productID].inCart = quantity;
      
      
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      localStorage.setItem("cartAmount", cartAmount);
      }

      changeAmountInCart();
    });
  }

}

function quantityPlusButtons(){
  let quantityPlusButtons = document.querySelectorAll(".product span.quantity-plus");
 
  
  for (let i=0; i < quantityPlusButtons.length; i++){
    quantityPlusButtons[i].addEventListener("click", ()=> {
      productID = quantityPlusButtons[i].parentElement.parentElement.children[1].children[1].textContent.trim();
      quantity = parseInt(quantityPlusButtons[i].parentElement.parentElement.children[2].children[1].textContent.trim()) + 1;
      
      if (quantity <= cartItems[productID].product.inStock){

      cartAmount = cartAmount - cartItems[productID].inCart + quantity;
      cartItems[productID].inCart = quantity;
      
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
      
      localStorage.setItem("cartAmount", cartAmount);

      changeAmountInCart();
      }else{
        alert("Du kan inte beställa fler än " + (quantity-1) + " examplar av den här produkten");
      }
    });
  }

}
$(document).ready(function(){
  $("#page-footer").hide();
});


  function showCartProducts() {
 
    var check = false;
  					
    function changeValue(x) {
      var quantity = parseFloat(x.parent().children(".quantity").html());
      var price = parseFloat(x.parent().children(".price").html());
      var eq = Math.round(price * quantity);
      
      x.parent().children(".total-price").html( eq + " kr" );
      
      changeTotal();			
    }
    
    function changeTotal() {
      
      var price = 0;
      
      $(".total-price").each(function(index){
        price += parseFloat($(".total-price").eq(index).html());
      });
      
      var tax = Math.round (price - (price/1.25));
      var shipping = parseFloat($(".shipping span").html());
      var fullPrice = price + shipping;
      
      if(price == 0) {
        fullPrice = 0;
      }
      
      $(".subtotal span").html(price);
      $(".tax span").html(tax);
      $(".total span").html(fullPrice);
    }
    
    $(document).ready(function(){
        let cartItems = localStorage.getItem("productsInCart");
        cartItems = JSON.parse(cartItems);
        let productContainer = document.querySelector(".product");

        $(".remove").click(function(){

          var x = $(this);
          x.parent().parent().addClass("removed");
          window.setTimeout(
            function(){
              x.parent().parent().slideUp('fast', function() { 
                x.parent().parent().remove(); 
               
                if(($(".product").length -1) == 0) {
                  if(check) {
                    window.location = "../checkout/checkout.html";
                  } else {
                    $("#the-cart").html("<h1>Du har inga produkter i varukorgen!</h1>");
                  }
                }
                changeTotal(); 
              });
            }, 200);
        });
      
      $(".quantity-plus").click(function(){

        inCart = parseInt($(this).parent().children(".quantity").html());
        inStock = parseInt($(this).parent().parent().children("div.content").children(".in-stock").html());
        if(inCart < inStock){
        $(this).parent().children(".quantity").html(inCart + 1);
        
        $(this).parent().children(".total-price").addClass("plused");
        
        var x = $(this);
        window.setTimeout(function(){x.parent().children(".total-price").removeClass("plused"); changeValue(x);}, 200);
        }
      });
      
      $(".quantity-minus").click(function(){
        
        child = $(this).parent().children(".quantity");
        
        if(parseInt(child.html()) > 1) {
          child.html(parseInt(child.html()) - 1);
        }
        
        $(this).parent().children(".total-price").addClass("minused");
        
        var x = $(this);
        window.setTimeout(function(){x.parent().children(".total-price").removeClass("minused"); changeValue(x);}, 200);
      });
      
      window.setTimeout(function(){$(".is-open").removeClass("is-open")}, 1200);
      
      $(".button").click(function(){
        check = true;
        $(".remove").click();
      });
    });   
    changeTotal();
  }
  
  $(document).ready(function(){
    viewCart();
});