
var amountOfProducts = 0;
var bigPictures = [];
var categories = [];
var selectedProduct = null; //the product which corresponds to the selected producttype, size and color (should be the one added to cart)
var selectedPT = null;
var selectedParams = { 'producttype': 0, 'color': 0, 'size': 0 };

//SORTING STUFF
function shopsort(sortby) {
    var $divs = $("div.p-float");
    var orderedDivs = null;
    var bigC = $("#productbigcontainer");

    if (sortby == "alpha") {
        orderedDivs = $divs.sort(function (a, b) {
            var ares = ($(a).find("#p-name").text());
            var bres = ($(b).find("#p-name").text());
            return (ares > bres) ? 1 : (ares < bres) ? -1 : 0;
        });
    }
    else if (sortby == "pricedown") {
        orderedDivs = $divs.sort(function (a, b) {
            var ares = parseInt($(a).find("#p-price").text());
            var bres = parseInt($(b).find("#p-price").text());
            return (ares > bres) ? -1 : (ares < bres) ? 1 : 0;
        });
    }
    else if (sortby == "priceup") {
        orderedDivs = $divs.sort(function (a, b) {
            var ares = parseInt($(a).find("#p-price").text());
            var bres = parseInt($(b).find("#p-price").text());
            return (ares > bres) ? 1 : (ares < bres) ? -1 : 0;
        });
    }

    $("#p-floatcontainer1").html(orderedDivs);
    $("#p-floatcontainer1").append(bigC);
    $(bigC).hide();
}
function shopfilter() {
    $(".p-desc").parent().hide();
    if ($('#productfilterall').is(":checked")) {
        $(".p-desc").parent().show();
    }
    else {
        for (i = 0; i < categories.length; i++) {
            if ($('#productfilter' + i).is(":checked")) {
                $(".p-desc." + categories[i]).parent().show();
            }
        }
    }
    if ($('#onlinerange').is(":checked")) {
        $(".p-desc.offline").parent().hide();
    }
    else if ($('#offlinerange').is(":checked")) {
        $(".p-desc.online").parent().hide();
    }
    $("#productbigcontainer").hide();
}
function selectAllFilters() {
    for (i = 0; i < categories.length; i++) {
        if ($('#productfilterall').is(":checked")) {
            $('#productfilter' + i).prop('checked', true);
        }
        else {
            $('#productfilter' + i).prop('checked', false);
        }
    }
}



var filterwrapperpos = $(".navbar-custom").offset().top + $(".navbar-custom").outerHeight(true);
$("#filterbuttonwrapper").css('top', filterwrapperpos - 20 + "px");
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
       
    var currentScrollPos = window.pageYOffset;
    filterwrapperpos = $(".navbar-custom").height();
    if($(window).width() <= 800 && prevScrollpos < currentScrollPos) {
        $("#filterbuttonwrapper").css('top', "-120px"); //offset enough so that div is outside of window
    } 
    else {
        $("#filterbuttonwrapper").css('top', filterwrapperpos + 10 + "px");
    }
    prevScrollpos = currentScrollPos;
}

function viewWebshop() {
    $("#productbigcontainer").hide();
    showProducts();
    $("#filterbuttonwrapper").show();

}

$(document).ready(function () {
    $("#productbigcontainer").hide();
    viewWebshop();
    checkReload();
});
function closeBig() {
    $("#productbigcontainer").hide();
}
function showProducts() {
    var floatindex = 0;
    let searchterm = localStorage.getItem("searchterm");
    if (searchterm === null || searchterm == "") {
        urlname = "/products";
    } else {
        urlname = "/products/search/" + searchterm
        window.localStorage.removeItem('searchterm');
    }

    $.ajax({
        url: urlname,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            var products = [];
            for (i = 0; i < data.length; i++) {
                products.push({
                    'id': data[i].ID, 'name': data[i].name, 'price': data[i].price, 'url': '../resources/images/' + data[i].image,
                    'canOrder': data[i].canOrder, 'colors': data[i].color, 'sizes': data[i].size, 'categories': data[i].categories
                });
            }         
            amountOfProducts = products.length;
                if (urlname == "/products/search/" + searchterm) {
                    $('#searchterm-div').append("<h2>Din sökning på: \""+searchterm+"\" gav " +amountOfProducts+ " resultat</h2>");
                    $('#filterbuttonwrapper').append("<button class='filterbutton' onclick='window.location.href=\"/webbshop\"'>rensa sökning</button></div>");   
                }
                for (i = 1; i <= products.length; i++) {
                    var product = products[i - 1];
                    $("#p-float" + product['id']).remove();
                    var str = "<div id='p-float" + product['id'] + "' class='p-float'><div class='p-float-in' id='product" + product['id'] + "' onclick='showProductType(" + product['id'] + ")'>"
                    str += "<div class='smallimagecontainer' id='smallimagecontainer"+i+"'><img class='p-img' id='p-img"+i+"' src=" + product["url"] + "> </div> <div class='p-name' id='p-name'>" + product["name"] + "</div>" +
                        "<div class='p-price' id='p-price'>" + product["price"] + " kr</div> <div id='p-desc' class='p-desc ";

                    for (o = 0; o < product.categories.length; o++) {
                        str += product.categories[o].categoryName + " ";
                        categories.push(product.categories[o].categoryName);
                    }
                    if (product['canOrder']) {
                        str += "online'> Produkten går att beställa online </div>"
                    }
                    else {
                        str += "offline'> Går endast att köpa i butik </div>"
                    }
                    str += "</div></div>"
                    $("#p-floatcontainer1").append(str);
                    for (o = 0; o < product['colors'].length; o++) {
                        var colorbutton = "<button id='smallcolorbutton" + i + "_" + o + "'class='big-colorbutton disabled'></button>";
                        document.getElementById("product" + product['id']).innerHTML += colorbutton;
                        $("#smallcolorbutton" + i + "_" + o).css("background-color", product['colors'][o].hexcode);
                    }
                }
                
                
                $("#dropdownfilter").append("<a> Välj kategorier</a>");
                $("#dropdownfilter").append("<a><input onclick='selectAllFilters()' type='checkbox' id='productfilterall' name='filterall' checked>" +
                    "<label for='productfilter" + i + "'>Alla kategorier</label></a>");
                categories = [...new Set(categories)];
                categories = categories.sort();
                for (i = 0; i < categories.length; i++) {
                    var str = "<a><input type='checkbox' id='productfilter" + i + "' name='filter" + i + "' checked>" +
                        "<label for='productfilter" + i + "'>" + categories[i] + "</label></a>";
                    $("#dropdownfilter").append(str);
                }
                $("#dropdownfilter").append("<hr>");
                $("#dropdownfilter").append("<a id='dofilterbutton' onclick=shopfilter()>Filtrera</a>");
        }
    });
}

function addToCart() {
    var product = selectedProduct;

    var amount = parseInt(document.getElementById("big-p-amountinput").value);

    var description = document.getElementById("big-p-desc").textContent;

    let cartAmount = localStorage.getItem("cartAmount");

    let cartItems = localStorage.getItem("productsInCart");

    cartItems = JSON.parse(cartItems);

    var inStock = document.getElementById("big-p-stock").textContent.match(/\d/g);;

    inStock = parseInt(inStock.join(""));

    cartAmount = parseInt(cartAmount);

    if ((product.size.sizeName) == "NA") {
        product.size.sizeName = "ONE SIZE";
    }
        if (product != null){
    
            if(cartItems != null){

                if (cartItems[product.product.productID] == undefined){
                    cartItems = {
                        ...cartItems,
                        [product.product.productID]: product
                     }   
            
                    if (product.inCart == null){
                        product.inCart = 0;
                    }
                    if (amount <= inStock){
            
                        product.inCart = amount;
                        product.desc = description;

                        localStorage.setItem("cartAmount", cartAmount + amount);
                        localStorage.setItem("productsInCart", JSON.stringify(cartItems));

                    }else{
                        alert(" Antalet produkter du valde överskrider lagersaldot!");
                    }

                }else{

                    if (amount + cartItems[product.product.productID].inCart <= inStock){

                        localStorage.setItem("cartAmount", cartAmount + amount);

                        cartItems[product.product.productID].inCart += amount;

                        localStorage.setItem("productsInCart", JSON.stringify(cartItems));

                    }else{

                        alert(" Antalet produkter du valde överskrider lagersaldot!");

                    }
       
                }   
        
            }else{

                if (amount <= inStock){

                    product.inCart = amount;
                    product.desc = description;
                    cartItems = { 
                        [product.product.productID]: product
                    }

                    localStorage.setItem("cartAmount", amount);
                    localStorage.setItem("productsInCart", JSON.stringify(cartItems));

                }else{
                    alert(" Antalet produkter du valde överskrider lagersaldot!");
                }    
            }   

            

            changeAmountInCart();
        }
    $("#big-p-add").text("✓ Tillagd i varukorgen!");
    if($(window).width() <= 800) {
        if ($('#gotocart').length == 0) {
            $('#filterbuttonwrapper').append("<button id='gotocart' class='filterbutton' onclick='window.location.href=\"/cart\"'>till varukorgen</button></div>"); 
        }
        filterwrapperpos = $(".navbar-custom").height();
        $("#filterbuttonwrapper").css('top', filterwrapperpos + 10 + "px");
    }
    $('.cart-amount').addClass('blink').one('webkitAnimationEnd...', function(){
        $(this).removeClass('blink');
        $("#big-p-add").text("Lägg i varukorgen");
    });
}


function increaseAmount() {
    document.getElementById("big-p-amountinput").value = parseInt(document.getElementById("big-p-amountinput").value) + 1;
}
function decreaseAmount() {
    var currentAmount = parseInt(document.getElementById("big-p-amountinput").value);
    if (currentAmount > 1) {
        document.getElementById("big-p-amountinput").value = currentAmount - 1;
    }
}

function changeBigPicture(i, colorid) {
    $("#big-p-img").attr("src", "../resources/images/" + bigPictures[i]);
    changeSelectedColor(colorid);
}

function selectProduct(params) {
    $.ajax({
        url: '/products/' + params['producttype'] + '/' + params['color'] + '_' + params['size'],
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            selectedProduct = data;
            //Set the selected combinations of button to "selected-mode" (make darker or something)
            $("#big-p-stock").text("I lager: " + data.product.inStock);
            var str = "Färg: " + data.color.name;
            if (data.size.sizeName != 'NA') {
                str += ", Storlek: " + data.size.sizeName;
            }
            $("#big-p-combination").text(str);
        }
    });
}
function changeSelectedColor(color) {
    selectedParams['color'] = color;
    selectProduct(selectedParams);
}
function changeSelectedSize(size) {
    selectedParams['size'] = size;
    selectProduct(selectedParams);
}

function showProductType(id) {

    $.ajax({
        url: '/products/' + id,
        dataType: 'json',
        type: 'GET',
        success: function (producttype) {
            var thisy = $("#p-float" + id).position().top;
            var next = $("#p-float" + id).attr('id');
            for (i = 1; i < 4; i++) {
                if ($("#" + next).next().length == 0) {
                    break;
                }
                if ($("#" + next).next().position().top != thisy) {
                    break;
                }
                next = $("#" + next).next().attr('id');
            }
            $("#" + next).after($("#productbigcontainer"));
            $("#big-p-img").attr("src", "../resources/images/" + producttype.pictures[0]);

            $("#big-p-name").text(producttype.name);
            $("#big-p-price").text(producttype.price + " kr");
            if (producttype.canOrder) {
                $("#amountaddinnercontainer").show();
                $("#big-p-add").css("opacity", 1);
                $("#big-p-add").css("pointer-events", "auto");
                $("#big-p-add").text("Lägg i varukorgen");
                $("#big-p-wheretobuy").text("");
            }
            else {
                $("#amountaddinnercontainer").hide();
                $("#big-p-add").css("opacity", 0.7);
                $("#big-p-add").css("pointer-events", "none");
                $("#big-p-add").text("Köp i butik")
                $("#big-p-wheretobuy").text("Ej tillgänglig för onlineköp");
            }
            $("#big-p-desc").text(producttype.description);
           
            $("#big-p-color").empty()
            $("#big-p-size").empty()
            
            bigPictures = [];
            for (i = 0; i < producttype.colors.length; i++) {
                bigPictures.push(producttype.pictures[i]);
                butt = "<button onclick='changeBigPicture(" + i + ",selectedPT.colors[" + i + "].colorID)' id='colorbutton" + i + "'class='big-colorbutton'></button>";
                $("#big-p-color").append(butt);
                $("#colorbutton" + i).css("background-color", producttype.colors[i].hexcode);
            }
            if (producttype.sizes[0].sizeName != 'NA') {
                for (i = 0; i < producttype.sizes.length; i++) {
                    butt = "<button onclick='changeSelectedSize(selectedPT.sizes[" + i + "].sizeID)' id='sizebutton" + i + "'class='big-sizebutton'>" + producttype.sizes[i].sizeName + "</button>";
                    $("#big-p-size").append(butt);
                }
            }

            
            selectedParams['producttype'] = producttype.id;
            selectedParams['color'] = producttype.colors[0].colorID;
            selectedParams['size'] = producttype.sizes[0].sizeID;
            selectProduct(selectedParams);
            selectedPT = producttype;
            
            $("#productbigcontainer").show();

            var html = $("html", "body");
            var position = $("#productbigcontainer").position().top;
            if ($(window).width() >= 800) {
                position -= $("#productbigcontainer").height() / 2;
            }
            $('html, body').animate({ scrollTop: position }, 400);
        }
    });

}

function checkReload() {

    let reloading = sessionStorage.getItem("reloading");
    reloading = parseInt(reloading);
    if(reloading == 1) {
    let redirect = sessionStorage.getItem("redirect");
    redirect = parseInt(redirect);
    sessionStorage.setItem("reloading", 0);
    showProductType(redirect);

    }
}
