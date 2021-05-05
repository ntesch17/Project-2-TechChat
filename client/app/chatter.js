let csrfToken;

//Handles user interactions with the chat form.
const handleChat = (e) => {
    e.preventDefault();

    $("#alertMessage").animate({width:'hide'}, 350);

    if($("#chatResponse").val() == ''){
        handleError("Chat fields are required.");
        return false;
    }

    sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function() {
        //document.querySelector('#advertisments').remove()
       
        loadChatFromServer();
    });

  
    return false;
};

//Chat form for users to enter responses to each other.
const ChatForm = (props) =>{

    
    return (
        <form id="chatForm" 
        onSubmit={handleChat}
        name="chatForm"
        action="/chat"
        method="POST"
        className="chatForm"
        >
            <label htmlFor="response">Enter a response: </label>
            <input id="chatResponse" type="text" name="response" placeholder="Enter Response"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeChatSubmit" type="submit" value="Make Chat" />
            {/* <input id='submitsP' className="makeSubscribeSubmit" type="submit" value="Subscribe to Premium" onClick={handleSubsribe}/>  */}
            
        </form>
    );
};

//Creates the chat list to store reponses to be viewed.
const ChatList = function(props){
    if(props.chat.length === 0) {
        return (
            <div className="chatList">
                <h3 className="emptyChat">No Responses Yet!</h3>
            </div>
        );
    }

   //Creates the chat node of a user response.
    const chatNodes = props.chat.map(function(chat) {

        //Deletes the response from the database.
        const handleDelete = (e) => {
            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
            xhr.onload = () => {
                console.log(xhr.response)
                if(xhr.response) {
                    let obj = JSON.parse(xhr.response);
                   
                    if(obj.redirect) {
                        window.location = obj.redirect;
                    }
                    
                }
            }
            xhr.send();
        }

        //Adds a friend to the user signed in.
        const handleFriend = (e) => {
           
           e.preventDefault();
           
            let xhr = new XMLHttpRequest();
            //document.querySelector('#advertisments').remove()
            xhr.open('POST', `/addFriend?username=${chat.username}`);
            
            xhr.onload = () => {
                if(xhr.status === 204){
                    window.alert("User already on friends list!");
                }
            }

            xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

            xhr.send();
        }


     
        // //Creates a private chat with user selected
        // const handlePrivate = (e) => {
           
        //     e.preventDefault();
            
        //      let xhr = new XMLHttpRequest();
 
        //      xhr.open('POST', `/privateChat?_id=${chat._id}&username=${chat.username}`);
 
        //      xhr.setRequestHeader('CSRF-TOKEN', csrfToken);
 
        //      xhr.send();
        //  }
        
        //Content viewable on chat page.
        console.log(props.friendsList);
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

   //Adds a friend to the user signed in.
   const handleSubsribe = (e) => {
           
    e.preventDefault();

    
    

     let xhr = new XMLHttpRequest();

     xhr.open('POST', `/makePremium?subscribed=true`);
     
     xhr.onload = () => {
        
        if(xhr.response) {
            let obj = JSON.parse(xhr.response);
           
            if(obj.redirect) {
                window.location = obj.redirect;
            }
            
        }
    }
     xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

     xhr.send();
 }
    
    //Chat list to display nodes.
    return (
        <div className="chatList">
            {chatNodes},
                  {props.subscribed == false &&
                    <input id='submitsP' className="makeSubscribeSubmit" type="submit" value="Subscribe to Premium" onClick={handleSubsribe}/> 
                }
        </div>
    );
};

//Loads the incoming reponses from the server.
const loadChatFromServer = () => {
   
    sendAjax('GET', '/getPremium', null, (result) => {
        
    sendAjax('GET', '/getChat', null, (data) => {
        ReactDOM.render(
            <ChatList chat={data.chat} subscribed={result.subscribed}/>, document.querySelector("#chat"), 
           
        );
    });
    });

   
};



//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <ChatForm csrf={csrf} />, document.querySelector('#makeChat')
    );

    ReactDOM.render(
        <ChatList chat={[]} />, document.querySelector('#chat'),
    );
    
    
        loadChatFromServer();
     
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