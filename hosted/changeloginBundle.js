//Handles user interactions with the change loggin form.
const handleChangeLogin = e => {
  e.preventDefault();
  $("#alertessage").animate({
    width: 'hide'
  }, 350);

  if ($("#oldPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields required.");
    return false;
  }

  sendAjax('POST', $("#changeLoginForm").attr("action"), $("#changeLoginForm").serialize(), redirect);
  return false;
}; //change loggin form for users to change the password to the account already created.


const ChangeLoginWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "changeLoginForm",
    name: "changeLoginForm",
    onSubmit: handleChangeLogin,
    action: "/change",
    method: "POST",
    className: "changeLoginForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    name: "oldPass",
    placeholder: "Old Password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass2"
  }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "password",
    name: "newPass2",
    placeholder: "Retype New Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
}; //Creates the change loggin window


const createChangeLoginWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeLoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

const setup = csrf => {
  createChangeLoginWindow(csrf); //default view
}; //Gains a csrf token per user interaction.


const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
//Handles errors encountered on the application
const handleError = message => {
  $("#errorMessage").text(message);
  $("#alertMessage").animate({
    width: 'toggle'
  }, 350);
}; //Redirects to given routes when needed.


const redirect = response => {
  $("#alertMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //SendAjax function to send requests to server.


const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
