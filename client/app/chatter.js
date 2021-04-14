const handleChat = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#chatResponse").val() == ''){
        handleError("RAWR! Chat fields are required.");
        return false;
    }

    // $("#submits").submit(function(e) {
    //     $("#username").hide();
    //     $("#chatUser").hide();
    // });

    sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function() {
        // $("#username").hide();
        // $("#chatUser").hide();
        loadChatFromServer();
    });

    return false;
};


const ChatForm = (props) =>{
    return (
        <form id="chatForm" 
        onSubmit={handleChat}
        name="chatForm"
        action="/chat"
        method="POST"
        className="chatForm"
        >
            {/* <label id='username' htmlFor="username">Enter a username: </label>
            <input id="chatUser" type="text" name="username" placeholder="Enter Username"/> */}
            <label htmlFor="response">Enter a response: </label>
            <input id="chatResponse" type="text" name="response" placeholder="Enter Response"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeChatSubmit" type="submit" value="Make Chat" />

        </form>
    );
};


const ChatList = function(props){
    if(props.chat.length === 0) {
        return (
            <div className="chatList">
                <h3 className="emptyChat">No Responses Yet!</h3>
            </div>
        );
    }

    const chatNodes = props.chat.map(function(chat) {
        return (
            <div key={chat._id} className="chat">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="chatUser"> User: {chat.username} </h3>
                <h3 className="chatResponse"> Response: {chat.response} </h3>
                <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Response" />
                <input id='submits' className="makeFriendSubmit" type="submit" value="Add Friend!" />
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
        // document.querySelector("#submitDelete").onclick(function(e) {
        //     console.log('here');
        //     chat.deleteOne({ size: 'large' }).then(function(){
        //         console.log("Data deleted"); // Success
        //     }).catch(function(error){
        //         console.log(error); // Failure
        //     });
        //     });
        
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