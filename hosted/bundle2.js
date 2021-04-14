const handleNote = e => {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#noteResponse").val() == '') {
    handleError("RAWR! Chat fields are required.");
    return false;
  }

  sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function () {
    loadChatFromServer();
  });
  return false;
};

const NoteForm = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "noteForm",
    onSubmit: handleNote,
    name: "noteForm",
    action: "/note",
    method: "POST",
    className: "noteForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "note"
  }, "Enter a Note: "), /*#__PURE__*/React.createElement("input", {
    id: "noteResponse",
    type: "text",
    name: "note",
    placeholder: "Note Here"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "submits",
    className: "makeNoteSubmit",
    type: "submit",
    value: "Make Chat"
  }));
};

const NoteList = function (props) {
  if (props.note.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "noteList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyNote"
    }, "No Notes Yet!"));
  }

  const noteNodes = props.note.map(function (note) {
    return /*#__PURE__*/React.createElement("div", {
      key: note._id,
      className: "note"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "noteResponse"
    }, " Note: ", note.note, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "noteList"
  }, noteNodes);
};

const loadNoteFromServer = () => {
  sendAjax('GET', '/getNote', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(NoteList, {
      note: data.note
    }), document.querySelector("#note"));
  });
};

const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(NoteForm, {
    csrf: csrf
  }), document.querySelector('#makeNote'));
  ReactDOM.render( /*#__PURE__*/React.createElement(NoteList, {
    note: []
  }), document.querySelector('#note'));
  setInterval(() => {
    loadNoteFromServer();
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
