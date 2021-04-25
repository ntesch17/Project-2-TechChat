let csrfToken; //Creates the friend list to store the user id of the user pressed to be added as a friend.

const FriendsList = function (props) {
  if (props.friend.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "friendsList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyFriendsList"
    }, "No Friends Yet"));
  } //Creates the friend node of the user added as a friend.


  const friendNodes = props.friend.map(function (friend) {
    return /*#__PURE__*/React.createElement("div", {
      key: friend,
      className: "friend"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/chatIcon.png",
      alt: "Chat Icon",
      className: "chatIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "friendName"
    }, " Friend: ", friend, " "));
  }); //friends list to display nodes.

  return /*#__PURE__*/React.createElement("div", {
    className: "friendsList"
  }, friendNodes, ",");
}; //Loads the incoming friends from the server.


const loadFriendsFromServer = () => {
  sendAjax('GET', '/getFriendsList', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(FriendsList, {
      friend: data.friend
    }), document.querySelector("#friends"));
  });
}; //Sets up the react render calls.


const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FriendsList, {
    friend: []
  }), document.querySelector('#friends'));
  loadFriendsFromServer();
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
