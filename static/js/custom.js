function errorMessage(text) {
    var statusBox = $("#status-box");
    statusBox.addClass('alert alert-danger alert-dismissable fade in');
    statusBox.html('<a class="close" data-hide="alert">&times;</a>');
    $("[data-hide]").on("click", function(){
        $(this).parent().hide();
    });
    statusBox.append(text);
    statusBox.show();
}