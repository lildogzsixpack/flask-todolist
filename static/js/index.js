$( document ).ready( function() {
    $( "#getstarted" ).click( function() {
        $( "#registerForm" ).toggle( 'slow' );
        $("#getstarted").toggle('slow')
    });
});
$( document ).ready( function() {
    $( "#upperRegister" ).click( function() {
        $( "#registerForm" ).toggle( 'slow' );
        $("#getstarted").toggle('slow')
    });
});
$( document ).ready( function() {
    $( "#upperLogin" ).click( function() {
        $( "#loginForm" ).toggle( 'slow' );
        $("#getstarted").toggle('slow')
    });
});



// register js
$('#registerForm').on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var formData = {};
    $.each(form.serializeArray(), function(i, field) {
        formData[field.name] = field.value;
    });

    if (formData.username.length < 3) {
        errorMessage("username must be at least 3 characters");
        return false;
    }
    else if (formData.password.length < 8) {
        errorMessage("Password must be at least 8 characters");
        return false;
    }

    else if (formData.password !== formData.passwordrepeat) {
        errorMessage("Passwords do not match");
        return false;
    }
    else if (formData.name.length < 3) {
        errorMessage("Name must be at least 3 characters");
        return false;
    }

    var request = $.ajax({
                        url: form.attr('action'),
                        method: form.attr('method'),
                        data: form.serialize(),
                        dataType: "json"
                    });
    request.done(function (response) {
        if (response['success']) {
            window.location.href = "/login#success";
        }
        else {
            errorMessage(response['reason']);
        }
    });
});
// register js ends here

// login js
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
// login js ends here