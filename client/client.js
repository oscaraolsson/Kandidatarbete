$(document).ready(function () {
  var queryString = document.URL;
  pos = queryString.search('//') + 2;
  queryString = queryString.slice(pos, queryString.length);
  url = queryString.slice(queryString.search('/') + 1, queryString.length);
  $('#tab-text').append(" "+ url);
  console.log(url);

  if (url == "omoss") {
    document.getElementById("main-client-container").innerHTML = "";
    $("#main-client-container").load("about_us/about_us.html");
  } else if (url == "webbshop" || url == "webshop" || url == "shop") {
    document.getElementById("main-client-container").innerHTML = "";
    $("#main-client-container").load("web_shop/web_shop.html");
  } else if (url == "nyheter") {
    document.getElementById("main-client-container").innerHTML = "";
    $("#main-client-container").load("news/news.html");
  } else if (url == "foreningar") {
    document.getElementById("tab-text").innerHTML = "LIUSTORE föreningar";
    $("#main-client-container").load("bulk_shop/bulk_shop.html");
  } else if (url=="hem" || url == ""){
    document.getElementById("main-client-container").innerHTML = "";
    $("#main-client-container").load("home_page/home_page.html");
  } else if (url=="cart"){
    $("#main-client-container").load("cart/cart.html");
  } else if (url=="lager"){
    $("#main-client-container").load("Admin_stock/stock.html");
  } else if (url=="orderHistory"){
    $("#main-client-container").load("orders/orders.html");
  }else {
    $("#main-client-container").load("pagenotfound/pagenotfound.html");
  }
  changeAmountInCart();
});

window.onscroll = function() {progressBar()};

function progressBar() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("progress-bar").style.width = scrolled + "%";
} 


function search(searchword) {
  $("#main-client-container").load("web_shop/web_shop.html");
  //lägg till väg till filtrering
}

function changeAmountInCart(){
  let cartAmount = parseInt(localStorage.getItem("cartAmount"));
  if (cartAmount){
    document.getElementsByClassName("cart-amount")[0].textContent = "(" + cartAmount + ")";
  }else{
    document.getElementsByClassName("cart-amount")[0].textContent = "(0)"; 
  }

}
function gosocial(link) {
  window.open(link, '_blank');
}

function searchFunction() {
  str = document.getElementById("searchinput").value;
  localStorage.setItem("searchterm", str);
  if (str === null|| str == ""|| !str.replace(/\s/g, '').length){
    window.localStorage.removeItem('searchterm');
  }
  window.location.href = "/webbshop";
}

var input = document.getElementById("searchinput");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("searchbutton").click();
  }
});
