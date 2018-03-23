$('#changepasswordForm').on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var formData = {};
    $.each(form.serializeArray(), function(i, field) {
        formData[field.name] = field.value;
    });

    if (formData.newpassword.length < 8) {
        errorMessage("Password must be at least 8 characters");
        $('#newpassword').addClass('has-error');
    }
    else if (formData.password === formData.newpassword) {
        errorMessage("Your old password and your new password must be different")
        $('#password').addClass('has-error');
    }
    else if (formData.newpassword !== formData.repeatnewpassword) {
        errorMessage("New password does not match");
        $('#repeatnewpassword').addClass('has-error');
    }

    var request = $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: form.serialize(), // password=12345678&newpassword=yolo1234567&newpasswordrepeat=yolo1234567
        dataType: "json"
    });

    request.done(function (response) {
        if (response['success']) {
            var statusBox = $('#status-box');
            statusBox.removeClass('alert-danger');
            statusBox.addClass('alert alert-success');
            statusBox.html("Password changed successfully!");
            statusBox.css("visibility", 'visible');
        }
        else {
            errorMessage(response['reason']);
        }
    });
});
