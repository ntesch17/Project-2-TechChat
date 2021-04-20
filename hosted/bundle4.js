// <!-- Post form. Note that the encoding type is set to 'multipart/form-data'. You cannot
//     upload files using the standard form-urlencoded encoding type. Also note that because we
//     are using the default html form action, we have named out file sampleFile. This will become
//     relevant in our src/controllers/files.js when trying to access the file on the server. -->
//     <form ref='uploadForm' 
//       id='uploadForm' 
//       action='/upload' 
//       method='post' 
//       encType="multipart/form-data">
//         <input type="file" name="sampleFile" />
//         <input type='submit' value='Upload!' />
//     </form> 
//     <!-- Get form. Just a standard GET request getting made with a query parameter of ?filename -->
//     <form ref='retrieveForm' 
//       id='retrieveForm' 
//       action='/retrieve' 
//       method='get'>
//       <label for='fileName'>Retrieve File By Name: </label>
//       <input name='fileName' type='text' />
//       <input type='submit' value='Download!' />
//     </form>
let csrfToken;

const handleUpload = e => {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#upload").val() == '') {
    handleError("RAWR! File fields are required.");
    return false;
  }

  sendAjax('POST', $("#uploadForm").attr("action"), $("#uploadForm").serialize(), function () {
    loadFilesFromServer();
  });
  return false;
}; // const handleRetrieve = (e) => {
//     e.preventDefault();
//     $("#domoMessage").animate({width:'hide'}, 350);
//     if($("#chatResponse").val() == ''){
//         handleError("RAWR! Chat fields are required.");
//         return false;
//     }
//     sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function() {
//         loadChatFromServer();
//     });
//     return false;
// };


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
    className: "uploadForm",
    type: "submit",
    value: "Upload!"
  }));
}; // const retrieveForm = (props) =>{
//     return (
//         <form id="retrieveForm" name="retrieveForm"
//         onSubmit={handleRetrieve}
//         action="/search"
//         method="GET"
//         className="retrieveForm"
//         >
//              <label htmlFor='fileName'>Retrieve File By Name: </label>
//              <input id='retrieve' name='fileName' type='text'  placeholder="Enter a file by name."/>
//             <input type="hidden" name="_csrf" value={props.csrf} />
//             <input className="retrieveForm" type='submit' value='Download!' />
//         </form>
//     );
// };


const FileList = function (props) {
  if (props.search.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fileList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyfile"
    }, "No Files Yet!"));
  }

  const fileNodes = props.search.map(function (search) {
    return /*#__PURE__*/React.createElement("div", {
      key: search._id,
      className: "search"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "fileList"
  }, fileNodes);
};

const loadFilesFromServer = () => {
  sendAjax('GET', '/retrieve', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(FileList, {
      search: data.search
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
