let csrfToken; //Creates the meme list to hold all user uploads.

const MemeList = function (props) {
  if (props.search.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "memesList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyMeme"
    }, "No Memes Yet"));
  } //Creates the meme node of the image added by a user.


  const memeNodes = props.search.map(function (file) {
    let fileRequestURL = `/retrieve?_id=${file._id}`;
    return /*#__PURE__*/React.createElement("div", {
      key: file._id,
      className: "meme"
    }, /*#__PURE__*/React.createElement("img", {
      src: fileRequestURL,
      alt: "image",
      className: "image"
    }));
  }); //meme list to display nodes.

  return /*#__PURE__*/React.createElement("div", {
    className: "memesList"
  }, memeNodes, ",");
}; //Loads the incoming images from the server.


const loadMemesFromServer = () => {
  sendAjax('GET', '/getFileAllIds', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(MemeList, {
      search: data.search
    }), document.querySelector("#meme"));
  });
}; //Sets up the react render calls.


const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(MemeList, {
    search: []
  }), document.querySelector('#meme'));
  setInterval(() => {
    loadMemesFromServer();
  }, 100);
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
