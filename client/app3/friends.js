let csrfToken;

const FriendsList = function(props){
    
    if(props.friend.length === 0) {
        return (
            <div className="friendsList">
                <h3 className="emptyFriendsList">No Friends Yet</h3>
            </div>
        );
    }

    const friendNodes = props.friend.map(function(friend) {
        
        return (
            <div key={friend} className="friend">
                <img src="/assets/img/chatIcon.png" alt="Chat Icon" className="chatIcon" />
                <h3 className="friendName"> Friend: {friend} </h3>
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
            <FriendsList friend={data.friend} />, document.querySelector("#friends")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <FriendsList friend={[]} />, document.querySelector('#friends'),
    );

    //console.log(friend);
        loadFriendsFromServer();

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});