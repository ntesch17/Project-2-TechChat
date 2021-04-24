let csrfToken;

const handleUpload = e => {
  e.preventDefault();
  $("#alertMessage").animate({
    width: 'hide'
  }, 350);
  let formData = new FormData();
  formData.append("sampleFile", document.getElementById("upload").files[0]);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', $("#uploadForm").attr("action"));
  xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

  xhr.onload = () => loadFilesFromServer();

  xhr.send(formData);
  return false;
};

const UploadForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "uploadForm",
    onSubmit: handleUpload,
    name: "uploadForm",
    action: "/upload",
    method: "POST",
    encType: "multipart/form-data",
    className: "uploadForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "image"
  }, "Enter a image to upload: "), /*#__PURE__*/React.createElement("input", {
    id: "upload",
    type: "file",
    name: "sampleFile",
    placeholder: "Enter a file here"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "submits",
    className: "makeUploadSubmit",
    type: "submit",
    value: "Upload!"
  }));
};

const FileList = function (props) {
  if (props.search.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fileList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyfile"
    }, "No Files Yet!"));
  }

  const fileNodes = props.search.map(function (file) {
    let fileRequestURL = `/retrieve?_id=${file._id}`; // const handleMeme = (e) => {
    //     e.preventDefault();
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('POST', `/retrieve?_id=${file._id}`);
    //     xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
    //     xhr.send();
    // }

    return /*#__PURE__*/React.createElement("div", {
      key: file._id,
      className: "search"
    }, /*#__PURE__*/React.createElement("img", {
      src: fileRequestURL,
      alt: "image",
      className: "image"
    }), /*#__PURE__*/React.createElement("input", {
      id: "submitMeme",
      className: "makeMeme",
      type: "submit",
      value: "Send to Meme Chat!"
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "fileList"
  }, fileNodes);
};

const loadFilesFromServer = () => {
  sendAjax('GET', '/getFileIds', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
      search: data
    }), document.querySelector("#search"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UploadForm, {
    csrf: csrf
  }), document.querySelector('#makeSearch'));
  ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
    search: []
  }), document.querySelector('#search'));
  loadFilesFromServer();
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
