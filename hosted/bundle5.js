let csrfToken;

const MemeList = function (props) {
  if (props.search.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "memesList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyMeme"
    }, "No Friends Yet"));
  }

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
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "memesList"
  }, memeNodes, ",");
};

const loadMemesFromServer = () => {
  console.log('here');
  sendAjax('GET', '/getFileAllIds', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(MemeList, {
      search: data.search
    }), document.querySelector("#meme"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(MemeList, {
    search: []
  }), document.querySelector('#meme'));
  setInterval(() => {
    loadMemesFromServer();
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
