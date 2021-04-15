const FriendsList = function(props){
    if(props.chat.length === 0) {
        return (
            <div className="friendsList">
                <h3 className="emptyFriendsList">No Friends Yet</h3>
            </div>
        );
    }

    const friendNodes = props.chat.map(function(chat) {
        return (
            <div key={chat._id} className="chat">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="friendName"> Friend: {chat.friends} </h3>
            </div>
        );
    });

    return (
        <div className="friendsList">
            {friendNodes},
           

        </div>
    );
};

const loadFriendsFromServer = () => {
    console.log('here');
    sendAjax('GET', '/getFriendsList', null, (data) => {
        ReactDOM.render(
            <FriendsList chat={data.chat} />, document.querySelector("#friends")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <FriendsList chat={[]} />, document.querySelector('#friends'),
    );

    setInterval(() => {
        loadFriendsFromServer();
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