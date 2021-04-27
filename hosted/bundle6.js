let csrfToken; //Handles user interactions with the premium form.

const handlePremium = e => {
  e.preventDefault();
  $("#alertMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#email").val() == '') {
    handleError("Chat fields are required.");
    return false;
  }

  $("#submits").submit(function (e) {});
  sendAjax('POST', $("#premiumForm").attr("action"), $("#premiumForm").serialize(), function () {
    $("#email").hide();
    $("#submits").hide();
    loadPremiumFromServer();
  });
  return false;
}; //Premium form for users to enter email to subscribe.


const PremiumForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "premiumForm",
    onSubmit: handlePremium,
    name: "premiumForm",
    action: "/premium",
    method: "POST",
    className: "premiumForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email"
  }, "Enter your email: "), /*#__PURE__*/React.createElement("input", {
    id: "email",
    type: "text",
    name: "email",
    placeholder: "Enter a email"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "submits",
    className: "makeChatSubmit",
    type: "submit",
    value: "Submit to Subscribe"
  }));
}; //Creates the premium list to store email of subcribtion.


const PremiumList = function (props) {
  if (props.premium.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "premiumList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPremium"
    }, "Enter email to subcribe!"));
  } //Creates the premium node of a user email.


  const premiumNodes = props.premium.map(function (premium) {
    // //Deletes the response from the database.
    // const handleDelete = (e) => {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
    //     xhr.send();
    // }
    // //Adds a friend to the user signed in.
    // const handleFriend = (e) => {
    //    e.preventDefault();
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('POST', `/addFriend?username=${chat.username}`);
    //     xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
    //     xhr.send();
    // }
    //Content viewable on chat page.
    return /*#__PURE__*/React.createElement("div", {
      key: premium._id,
      className: "premium"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/chatIcon.png",
      alt: "Chat Icon",
      className: "chatIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "chatUser"
    }, " Subscribed Email: ", premium.email, " "));
  }); //Premium list to display nodes.

  return /*#__PURE__*/React.createElement("div", {
    className: "premiumList"
  }, premiumNodes);
}; //Loads the incoming reponses from the server.


const loadPremiumFromServer = () => {
  sendAjax('GET', '/getPremium', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(PremiumList, {
      premium: data.premium
    }), document.querySelector("#premium"));
  });
}; //Sets up the react render calls.


const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PremiumForm, {
    csrf: csrf
  }), document.querySelector('#makePremium'));
  ReactDOM.render( /*#__PURE__*/React.createElement(PremiumList, {
    premium: []
  }), document.querySelector('#premium'));
  loadPremiumFromServer();
}; //Gains a csrf token per user interaction.


const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    csrfToken = result.csrfToken;
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
