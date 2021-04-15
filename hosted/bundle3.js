const FriendsList = function (props) {
  if (props.chat.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "friendsList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyFriendsList"
    }, "No Domos Yet"));
  }

  const friendNodes = props.chat.map(function (chat) {
    return /*#__PURE__*/React.createElement("div", {
      key: chat._id,
      className: "chat"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "friendName"
    }, " Friend: ", chat.friends, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "friendsList"
  }, friendNodes, ",");
};

const loadFriendsFromServer = () => {
  console.log('here');
  sendAjax('GET', '/friends', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(FriendList, {
      chat: data.chat
    }), document.querySelector("#friends"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FriendsList, {
    chat: []
  }), document.querySelector('#friends'));
  setInterval(() => {
    loadFriendsFromServer();
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
