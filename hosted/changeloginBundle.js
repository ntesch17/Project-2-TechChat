const handleChangeLogin = e => {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("RAWR! Username or password is empty.");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#changeloginForm").attr("action"), $("#changeloginForm").serialize(), redirect);
  return false;
};

const changeLoginWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "changeLoginForm",
    name: "changeLoginForm",
    onSubmit: handleChangeLogin,
    action: "/change",
    method: "POST",
    className: "changeLoginForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
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
    value: "sign Up"
  }));
};

const createChangeLoginWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement("changeLoginWindow", {
    csrf: csrf
  }), document.querySelector("#content"));
};

const setup = csrf => {
  const changeButton = document.querySelector("#changeButton");
  changeButton.addEventListener("click", e => {
    e.preventDefault();
    createChangeLoginWindow(csrf);
    return false;
  });
  createChangeLoginWindow(csrf); //default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
const handleError = message => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

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
