let csrfToken; //Handles user interactions with the chat form.

const handleChat = e => {
  e.preventDefault();
  $("#alertMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#chatResponse").val() == '') {
    handleError("Chat fields are required.");
    return false;
  }

  sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function () {
    //document.querySelector('#advertisments').remove()
    loadChatFromServer();
  });
  return false;
}; //Chat form for users to enter responses to each other.


const ChatForm = props => {
  //Adds a friend to the user signed in.
  const handleSubsribe = e => {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `/makePremium?subscribed=true`);

    xhr.onload = () => {
      if (xhr.response) {
        let obj = JSON.parse(xhr.response);

        if (obj.redirect) {
          window.location = obj.redirect;
        }
      }
    };

    xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
    xhr.send();
  };

  return /*#__PURE__*/React.createElement("form", {
    id: "chatForm",
    onSubmit: handleChat,
    name: "chatForm",
    action: "/chat",
    method: "POST",
    className: "chatForm"
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
  }), props.subscribed ? document.getElementById('submitsP').disabled = 'true' : /*#__PURE__*/React.createElement("input", {
    id: "submitsP",
    className: "makeSubscribeSubmit",
    type: "submit",
    value: "Subscribe to Premium (No Ads)",
    onClick: handleSubsribe
  }));
}; //Creates the chat list to store reponses to be viewed.


const ChatList = function (props) {
  if (props.chat.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "chatList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyChat"
    }, "No Responses Yet!"));
  } //Creates the chat node of a user response.


  const chatNodes = props.chat.map(function (chat) {
    //Deletes the response from the database.
    const handleDelete = e => {
      let xhr = new XMLHttpRequest();
      xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
      xhr.send();
    }; //Adds a friend to the user signed in.


    const handleFriend = e => {
      e.preventDefault();
      let xhr = new XMLHttpRequest(); //document.querySelector('#advertisments').remove()

      xhr.open('POST', `/addFriend?username=${chat.username}`);
      xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
      xhr.send();
    }; // //Creates a private chat with user selected
    // const handlePrivate = (e) => {
    //     e.preventDefault();
    //      let xhr = new XMLHttpRequest();
    //      xhr.open('POST', `/privateChat?_id=${chat._id}&username=${chat.username}`);
    //      xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
    //      xhr.send();
    //  }
    //Content viewable on chat page.


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
    className: "chatList"
  }, chatNodes);
}; //Loads the incoming reponses from the server.


const loadChatFromServer = () => {
  sendAjax('GET', '/getPremium', null, result => {
    sendAjax('GET', '/getChat', null, data => {
      ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
        chat: data.chat,
        subscribed: result.subscribed
      }), document.querySelector("#chat"));
    });
  });
}; //Sets up the react render calls.


const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatForm, {
    csrf: csrf
  }), document.querySelector('#makeChat'));
  ReactDOM.render( /*#__PURE__*/React.createElement(ChatList, {
    chat: []
  }), document.querySelector('#chat'));
  loadChatFromServer();
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
