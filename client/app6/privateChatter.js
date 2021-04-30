let csrfToken;

//Handles user interactions with the chat form.
const handlePrivateChat = (e) => {
    e.preventDefault();

    $("#alertMessage").animate({width:'hide'}, 350);

    if($("#privateChatResponse").val() == ''){
        handleError("Chat fields are required.");
        return false;
    }

    sendAjax('POST', $("#privateChatForm").attr("action"), $("#privateChatForm").serialize(), function() {
        loadPrivateChatFromServer();
    });

    return false;
};

//Chat form for users to enter responses to each other.
const PrivateChatForm = (props) =>{

    
    return (
        <form id="privateChatForm" 
        onSubmit={handlePrivateChat}
        name="privateChatForm"
        action="/privateChat"
        method="POST"
        className="privateChatForm"
        >
            <label htmlFor="response">Enter a response: </label>
            <input id="chatResponse" type="text" name="response" placeholder="Enter Response"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeChatSubmit" type="submit" value="Make Chat" />

        </form>
    );
};

//Creates the chat list to store reponses to be viewed.
const PrivateChatList = function(props){
    if(props.chat.length === 0) {
        return (
            <div className="privateChatList">
                <h3 className="emptyPrivateChat">No Responses Yet!</h3>
            </div>
        );
    }

   //Creates the chat node of a user response.
    const privateChatNodes = props.chat.map(function(chat) {

        //Deletes the response from the database.
        const handleDelete = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
            xhr.send();
        }

        //Adds a friend to the user signed in.
        const handleFriend = (e) => {
           
           e.preventDefault();
           
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `/addFriend?username=${chat.username}`);

            xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

            xhr.send();
        }

       

        //Content viewable on chat page.
        return (
            <div key={chat._id} className="chat">
                <img src="/assets/img/chatIcon.png" alt="Chat Icon" className="chatIcon" />
                <h3 className="chatUser"> User: {chat.username} </h3>
                <h3 className="chatResponse"> Response: {chat.response} </h3>
                <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Response" onClick={handleDelete}/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input id='submitFriend' className="makeFriendSubmit" type="submit" value="Add Friend!" onClick={handleFriend} />
                
                
            
            </div>
            
        );
        
    });


    
    //Chat list to display nodes.
    return (
        <div className="privateChatList">
            {privateChatNodes}
        </div>
    );
};

//Loads the incoming reponses from the server.
const loadPrivateChatFromServer = () => {
    sendAjax('GET', '/getPremium', null, (result) => {
    sendAjax('GET', '/getPrivateChat', null, (data) => {
        ReactDOM.render(
            <PrivateChatList chat={data.chat} subscribed={result.subscribed}/>, document.querySelector("#privateChat")
        );
    });
    });

   
};



//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <PrivateChatForm csrf={csrf} />, document.querySelector('#makePrivateChat')
    );

    ReactDOM.render(
        <PrivateChatList chat={[]} />, document.querySelector('#privateChat'),
    );

    
        loadPrivateChatFromServer();
     
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