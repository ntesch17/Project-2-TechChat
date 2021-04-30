let csrfToken; //Handles user interactions with the chat form.

const handlePrivateChat = e => {
  e.preventDefault();
  $("#alertMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#privateChatResponse").val() == '') {
    handleError("Chat fields are required.");
    return false;
  }

  sendAjax('POST', $("#privateChatForm").attr("action"), $("#privateChatForm").serialize(), function () {
    loadPrivateChatFromServer();
  });
  return false;
}; //Chat form for users to enter responses to each other.


const PrivateChatForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "privateChatForm",
    onSubmit: handlePrivateChat,
    name: "privateChatForm",
    action: "/privateChat",
    method: "POST",
    className: "privateChatForm"
  }, /*#__PURE__*/React.createElement("label", {
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
}; //Creates the chat list to store reponses to be viewed.


const PrivateChatList = function (props) {
  if (props.chat.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "privateChatList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPrivateChat"
    }, "No Responses Yet!"));
  } //Creates the chat node of a user response.


  const privateChatNodes = props.chat.map(function (chat) {
    //Deletes the response from the database.
    const handleDelete = e => {
      let xhr = new XMLHttpRequest();
      xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
      xhr.send();
    }; //Adds a friend to the user signed in.


    const handleFriend = e => {
      e.preventDefault();
      let xhr = new XMLHttpRequest();
      xhr.open('POST', `/addFriend?username=${chat.username}`);
      xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
      xhr.send();
    }; //Content viewable on chat page.


    return /*#__PURE__*/React.createElement("div", {
      key: chat._id,
      className: "chat"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/chatIcon.png",
      alt: "Chat Icon",
      className: "chatIcon"
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
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      id: "submitFriend",
      className: "makeFriendSubmit",
      type: "submit",
      value: "Add Friend!",
      onClick: handleFriend
    }));
  }); //Chat list to display nodes.

  return /*#__PURE__*/React.createElement("div", {
    className: "privateChatList"
  }, privateChatNodes);
}; //Loads the incoming reponses from the server.


const loadPrivateChatFromServer = () => {
  sendAjax('GET', '/getPremium', null, result => {
    sendAjax('GET', '/getPrivateChat', null, data => {
      ReactDOM.render( /*#__PURE__*/React.createElement(PrivateChatList, {
        chat: data.chat,
        subscribed: result.subscribed
      }), document.querySelector("#privateChat"));
    });
  });
}; //Sets up the react render calls.


const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PrivateChatForm, {
    csrf: csrf
  }), document.querySelector('#makePrivateChat'));
  ReactDOM.render( /*#__PURE__*/React.createElement(PrivateChatList, {
    chat: []
  }), document.querySelector('#privateChat'));
  loadPrivateChatFromServer();
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
