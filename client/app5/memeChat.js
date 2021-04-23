let csrfToken;

const memeList = function(props){
    
    if(props.meme.length === 0) {
        return (
            <div className="memesList">
                <h3 className="emptyMeme">No Friends Yet</h3>
            </div>
        );
    }

    const memeNodes = props.meme.map(function(meme) {
        
        return (
            <div key={meme} className="meme">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="friendName"> Friend: {meme} </h3>
            </div>
        );
    });

    return (
        <div className="memesList">
            {memeNodes},
        </div>
    );
};


const loadMemesFromServer = () => {
    console.log('here');
    sendAjax('GET', '/getFriendsList', null, (data) => {
        ReactDOM.render(
            <FriendsList friend={data.friend} />, document.querySelector("#meme")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <memeList meme={[]} />, document.querySelector('#meme'),
    );

    
        loadMemesFromServer();

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});