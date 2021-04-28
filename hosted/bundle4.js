let csrfToken;

const handleGif = e => {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#gifSearch").val() == '' || $("#gifLimit").val() == '') {
    handleError("RAWR! All fields are required.");
    return false;
  }

  sendAjax('POST', $("#gifForm").attr("action"), $("#gifForm").serialize(), function () {
    loadGifFromServer();
  });
  return false;
};

const GifForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "gifForm",
    onSubmit: handleGif,
    name: "gifForm",
    action: "/search",
    method: "POST",
    className: "gifForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "search"
  }, "Enter a Search Term: "), /*#__PURE__*/React.createElement("input", {
    id: "gifSearch",
    type: "text",
    name: "search",
    placeholder: "Enter Search Term"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "limit"
  }, "Enter a Search Term: "), /*#__PURE__*/React.createElement("input", {
    id: "gifLimit",
    type: "text",
    name: "limit",
    placeholder: "Enter Limit to search"
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

const GifList = function (props) {
  if (props.search.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "searchList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySearch"
    }, "No Responses Yet!"));
  }

  const GifNodes = props.chat.map(function (chat) {
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
    }, " Response: ", chat.response, " "), /*#__PURE__*/React.createElement("input", {
      id: "submitDelete",
      className: "makeDeleteSubmit",
      type: "submit",
      value: "Delete Response",
      onClick: handleDelete
    }), /*#__PURE__*/React.createElement("input", {
      id: "submits",
      className: "makeFriendSubmit",
      type: "submit",
      value: "Add Friend!",
      onClick: handleFriend
    }));
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
