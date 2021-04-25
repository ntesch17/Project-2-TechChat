//Handles errors encountered on the application
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#alertMessage").animate({width: 'toggle'},350);
};

//Redirects to given routes when needed.
const redirect = (response) => {
    $("#alertMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

//SendAjax function to send requests to server.
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};