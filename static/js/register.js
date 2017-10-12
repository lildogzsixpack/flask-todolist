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