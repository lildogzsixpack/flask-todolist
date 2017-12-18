$(document).ready(function () {
    var register_param = window.location.hash;
    var statusBox = $("#status-box");

    if (register_param === '#success') {
        statusBox.removeClass('alert alert-danger alert-dismissable fade in');
        statusBox.addClass('alert alert-success');
        statusBox.html("Congratulations! You have registered! Login with your credentials to continue.");
        statusBox.show();
    }
})

$("#loginForm").on('submit', function(e) {
    e.preventDefault();

    var form = $(this);
    var formData = {};
    $.each(form.serializeArray(),function(i,field) {
        formData[field.name] = field.value.trim();
    });

    if (formData.username == "" || formData.username == null || formData.password == "" || formData.password == null){
        errorMessage("Please enter your Username and your Password");
        return;
    }

   var request = $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: form.serialize(),
                    datatype: "json"
                });

    request.done(function(response) {
        if (response['success']) {
            window.location.href = "/todolist";
        }
        else {
            errorMessage(response['reason']);
        }
    });

});
