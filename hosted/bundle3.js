let csrfToken;

const FriendsList = function (props) {
  if (props.friend.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "friendsList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyFriendsList"
    }, "No Friends Yet"));
  }

  const friendNodes = props.friend.map(function (friend) {
    return /*#__PURE__*/React.createElement("div", {
      key: friend,
      className: "friend"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "friendName"
    }, " Friend: ", friend, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "friendsList"
  }, friendNodes, ",");
};

const loadFriendsFromServer = () => {
  console.log('here');
  sendAjax('GET', '/getFriendsList', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(FriendsList, {
      friend: data.friend
    }), document.querySelector("#friends"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(FriendsList, {
    friend: []
  }), document.querySelector('#friends')); //console.log(friend);

  loadFriendsFromServer();
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
  $("#alertMessage").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("#alertMessage").animate({
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
