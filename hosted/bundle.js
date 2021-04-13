const handleChat = e => {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#chatResponse").val() == '' || $("#chatName").val() == '') {
    handleError("RAWR! Chat fields are required.");
    return false;
  }

  $("#submits").submit(function (e) {
    $("#username").hide();
    $("#chatUser").hide();
  });
  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    $("#username").hide();
    $("#chatUser").hide();
    loadChatFromServer();
  });
  return false;
};

const ChatForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "chatForm",
    onSubmit: handleChat,
    name: "chatForm",
    action: "/chat",
    method: "POST",
    className: "chatForm"
  }, /*#__PURE__*/React.createElement("label", {
    id: "username",
    htmlFor: "username"
  }, "Enter a username: "), /*#__PURE__*/React.createElement("input", {
    id: "chatUser",
    type: "text",
    name: "username",
    placeholder: "Enter Username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "response"
  }, "Enter a response: "), /*#__PURE__*/React.createElement("input", {
    id: "chatResponse",
    type: "text",
    name: "response",
    placeholder: "Enter Response"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "submits",
    className: "makeChatSubmit",
    type: "submit",
    value: "Make Chat"
  }));
};

const ChatList = function (props) {
  if (props.chat.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "chatList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyChat"
    }, "No Responses Yet!"));
  }

  const chatNodes = props.chat.map(function (chat) {
    return /*#__PURE__*/React.createElement("div", {
      key: chat._id,
      className: "chat"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "chatUser"
    }, " User: ", chat.username, " "), /*#__PURE__*/React.createElement("h3", {
      className: "chatResponse"
    }, " Response: ", chat.response, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "chatList"
  }, chatNodes);
};

const loadChatFromServer = () => {
  sendAjax('GET', '/getChat', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
      chat: data.chat
    }), document.querySelector("#chat"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatForm, {
    csrf: csrf
  }), document.querySelector('#makeChat'));
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
    chat: []
  }), document.querySelector('#chat'));
  setInterval(() => {
    loadChatFromServer();
  }, 100);
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
