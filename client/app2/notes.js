let csrfToken;

//Handles user interactions with the note form.
const handleNote = (e) => {
    e.preventDefault();

    $("#alertMessage").animate({width:'hide'}, 350);

    if($("#noteResponse").val() == ''){
        handleError("Note fields are required.");
        return false;
    }

    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function() {
        loadNoteFromServer();
    });

    return false;
};

//note form for users to enter notes to their private account.
const NoteForm = (props) =>{
    return (
        <form id="noteForm" 
        onSubmit={handleNote}
        name="noteForm"
        action="/note"
        method="POST"
        className="noteForm"
        >
            <label htmlFor="note">Enter a Note: </label>
            <input id="noteResponse" type="text" name="note" placeholder="Note Here"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeNoteSubmit" type="submit" value="Make Chat" />

        </form>
    );
};

//Creates the note list to store notes to be viewed by the user that entered the note.
const NoteList = function(props){
    if(props.note.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No Notes Yet!</h3>
            </div>
        );
    }

    //Creates the note node of a user note.
    const noteNodes = props.note.map(function(note) {

        //Handles deleting a note on user account.
        const handleDelete = (e) => {
            let xhr = new XMLHttpRequest();

            xhr.open('DELETE', `/deleteNote?_id=${note._id}&_csrf=${csrfToken}`);
            
            xhr.onload = () => { 
                if(xhr.response) {
                    let obj = JSON.parse(xhr.response);
                    if(obj.redirect) {
                        window.alert("Note Deleted!");
                        window.location = obj.redirect;
                    }
                }
            }
            
            xhr.send();
        }

        //Content viewable on note page.
        return (
            <div key={note._id} className="note">
                <img src="/assets/img/chatIcon.png" alt="Chat Icon" className="chatIcon" />
                <h3 className="noteResponse"> Note: {note.note} </h3>
                <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Note" onClick={handleDelete}/>
            </div>
        );
    });
    
    //note list to display nodes.
    return (
        <div className="noteList">
            {noteNodes}
        </div>
    );
};

//Loads the incoming notes from the server.
const loadNoteFromServer = () => {
    sendAjax('GET', '/getNote', null, (data) => {
        ReactDOM.render(
            <NoteList note={data.note} />, document.querySelector("#note")
        );
    });
};

//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <NoteForm csrf={csrf} />, document.querySelector('#makeNote')
    );

    ReactDOM.render(
        <NoteList note={[]} />, document.querySelector('#note'),
    );
    loadNoteFromServer();
};

//Gains a csrf token per user interaction.
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken; 
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});