let csrfToken;

const handleGif = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#gifSearch").val() == '' || $("#gifLimit").val() == ''){
        handleError("RAWR! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#gifForm").attr("action"), $("#gifForm").serialize(), function() {
        loadGifFromServer();
    });

    return false;
};


const GifForm = (props) =>{
    return (
        <form id="gifForm" 
        onSubmit={handleGif}
        name="gifForm"
        action="/search"
        method="POST"
        className="gifForm"
        >
            <label htmlFor="search">Enter a Search Term: </label>
            <input id="gifSearch" type="text" name="search" placeholder="Enter Search Term"/>
            <label htmlFor="limit">Enter a Search Term: </label>
            <input id="gifLimit" type="text" name="limit" placeholder="Enter Limit to search"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeChatSubmit" type="submit" value="Make Chat" />

        </form>
    );
};


const GifList = function(props){
    if(props.search.length === 0) {
        return (
            <div className="chatList">
                <h3 className="emptyChat">No Responses Yet!</h3>
            </div>
        );
    }

   
    const GifNodes = props.chat.map(function(chat) {
        const handleDelete = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
            xhr.send();
        }

        const handleFriend = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `/getFriendsList?_id=${chat._id}&_csrf=${csrfToken}`);
            xhr.send();
        }

        return (
            <div key={chat._id} className="chat">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="chatUser"> User: {chat.username} </h3>
                <h3 className="chatResponse"> Response: {chat.response} </h3>
                <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Response" onClick={handleDelete}/>
                <input id='submits' className="makeFriendSubmit" type="submit" value="Add Friend!" onClick={handleFriend} />
            </div>
            
        );
        
    });

    
    
    return (
        <div className="chatList">
            {chatNodes}
        </div>
    );
};

const loadChatFromServer = () => {
    sendAjax('GET', '/getChat', null, (data) => {
        ReactDOM.render(
            <ChatList chat={data.chat} />, document.querySelector("#chat")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <ChatForm csrf={csrf} />, document.querySelector('#makeChat')
    );

    ReactDOM.render(
        <ChatList chat={[]} />, document.querySelector('#chat'),
    );
    setInterval(() => {
        
        loadChatFromServer();
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