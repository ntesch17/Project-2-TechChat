let csrfToken;

const handleNote = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#noteResponse").val() == ''){
        handleError("RAWR! Chat fields are required.");
        return false;
    }

    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function() {
        loadChatFromServer();
    });

    return false;
};


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


const NoteList = function(props){
    if(props.note.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No Notes Yet!</h3>
            </div>
        );
    }

    const noteNodes = props.note.map(function(note) {
        const handleDelete = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/deleteNote?_id=${note._id}&_csrf=${csrfToken}`);
            xhr.send();
        }

        return (
            <div key={note._id} className="note">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="noteResponse"> Note: {note.note} </h3>
                <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Note" onClick={handleDelete}/>
            </div>
        );
        
    });
    
    return (
        <div className="noteList">
            {noteNodes}
        </div>
    );
};

const loadNoteFromServer = () => {
    sendAjax('GET', '/getNote', null, (data) => {
        ReactDOM.render(
            <NoteList note={data.note} />, document.querySelector("#note")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <NoteForm csrf={csrf} />, document.querySelector('#makeNote')
    );

    ReactDOM.render(
        <NoteList note={[]} />, document.querySelector('#note'),
    );
    setInterval(() => {
        loadNoteFromServer();
      }, 100);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken; 
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});