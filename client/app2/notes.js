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
            <input id='submits' className="makeChatSubmit" type="submit" value="Make Chat" />

        </form>
    );
};


const ChatList = function(props){
    if(props.note.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No Notes Yet!</h3>
            </div>
        );
    }

    const noteNodes = props.note.map(function(note) {
        return (
            <div key={note._id} className="note">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="noteResponse"> Note: {note.note} </h3>
            </div>
        );
        
    });
    
    return (
        <div className="noteList">
            {noteNodes}
        </div>
    );
};

const loadChatFromServer = () => {
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
        loadChatFromServer();
      }, 100);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});