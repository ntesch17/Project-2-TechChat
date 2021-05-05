let csrfToken;

//Creates the friend list to store the user id of the user pressed to be added as a friend.
const FriendsList = function(props){
    if(props.friend.length === 0) {
        return (
            <div className="friendsList">
                <h3 className="emptyFriendsList">No Friends Yet</h3>
            </div>
        );
    }

    //Creates the friend node of the user added as a friend.
const friendNodes = props.friend.map(function(friend) { 

//Deletes the response from the database.
const handleRemove = (e) => {
    let xhr = new XMLHttpRequest();
   
    xhr.open('DELETE', `/deleteFriend?friend=${friend}&_csrf=${csrfToken}`);
    
    xhr.onload = () => { 
        if(xhr.response) {
            let obj = JSON.parse(xhr.response);
            if(obj.redirect) {
                window.location = obj.redirect;
                window.alert("Friend Deleted!");
            }
        }
    }
    xhr.send();
}

    return (
            <div key={friend} className="friend">
                <img src="/assets/img/chatIcon.png" alt="Chat Icon" className="chatIcon" />
                <h3 className="friendName"> Friend: {friend} </h3>
                <input id='submitDelete' className="makeRemoveSubmit" type="submit" value="Delete Friend" onClick={handleRemove}/>
            </div>
        );
    });

    //friends list to display nodes.
    return (
        <div className="friendsList">
            {friendNodes},
        </div>
    );
};

//Loads the incoming friends from the server.
const loadFriendsFromServer = () => {
    sendAjax('GET', '/getFriendsList', null, (data) => {
        ReactDOM.render(
            <FriendsList friend={data.friend} />, document.querySelector("#friends")
        );
    });
};

//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <FriendsList friend={[]} />, document.querySelector('#friends'),
    );
    loadFriendsFromServer();
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