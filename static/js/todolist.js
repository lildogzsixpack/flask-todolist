$('#taskForm').on('submit', function (e) {
    e.preventDefault();

    var form = $(this);
    var formData = {};
    $.each(form.serializeArray(), function(i, field) {
        formData[field.name] = field.value;
    });

    var request = $.ajax({
                        url: form.attr('action'),
                        method: form.attr('method'),
                        data: form.serialize(),
                        dataType: "json"});
});