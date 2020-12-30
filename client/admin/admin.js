
function viewAdmin() {
    $('#admin-main').html($('#view-admin').html());
}
console.log("admin.js loaded");

function login(id, inputlist) {
    var values = [];
    for(i in inputlist) {
        values.push(document.getElementById(String((inputlist[i])))["value"]);
    }

    output = JSON.stringify({"username": values[0], "password": values[1]});

    console.log(output);

    $.ajax({
        url: '/admin/signin',
        type: 'POST',
        data: output,

        success: function(result) {
            console.log(result);
            sessionStorage.setItem('auth', JSON.stringify(result));         
            window.location.assign("/admin/successfullogin.html");
        }
    });

}

$(document).ready(function(){
    viewAdmin();
});
