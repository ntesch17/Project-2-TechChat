let csrfToken; //Handles user interactions with the note form.

const handleNote = e => {
  e.preventDefault();
  $("#alertMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#noteResponse").val() == '') {
    handleError("Chat fields are required.");
    return false;
  }

  sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function () {
    loadNoteFromServer();
  });
  return false;
}; //note form for users to enter notes to their private account.


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
}; //Creates the note list to store notes to be viewed by the user that entered the note.


const NoteList = function (props) {
  if (props.note.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "noteList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyNote"
    }, "No Notes Yet!"));
  } //Creates the note node of a user note.


  const noteNodes = props.note.map(function (note) {
    const handleDelete = e => {
      let xhr = new XMLHttpRequest();
      xhr.open('DELETE', `/deleteNote?_id=${note._id}&_csrf=${csrfToken}`);
      xhr.send();
    }; //Content viewable on note page.


    return /*#__PURE__*/React.createElement("div", {
      key: note._id,
      className: "note"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/chatIcon.png",
      alt: "Chat Icon",
      className: "chatIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "noteResponse"
    }, " Note: ", note.note, " "), /*#__PURE__*/React.createElement("input", {
      id: "submitDelete",
      className: "makeDeleteSubmit",
      type: "submit",
      value: "Delete Note",
      onClick: handleDelete
    }));
  }); //note list to display nodes.

  return /*#__PURE__*/React.createElement("div", {
    className: "noteList"
  }, noteNodes);
}; //Loads the incoming notes from the server.


const loadNoteFromServer = () => {
  sendAjax('GET', '/getNote', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(NoteList, {
      note: data.note
    }), document.querySelector("#note"));
  });
}; //Sets up the react render calls.


const setup = function (csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(NoteForm, {
    csrf: csrf
  }), document.querySelector('#makeNote'));
  ReactDOM.render( /*#__PURE__*/React.createElement(NoteList, {
    note: []
  }), document.querySelector('#note'));
  loadNoteFromServer();
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
