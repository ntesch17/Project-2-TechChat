const FriendsList = function(props){
    if(props.data.friends.length === 0) {
        return (
            <div className="friendsList">
                <h3 className="emptyFriendsList">No Friends Yet</h3>
            </div>
        );
    }

    const friendNodes = props.data.friends.map(function() {
        return (
            <div key={friend._id} className="friend">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="friendName"> Friend: {friend.username} </h3>
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