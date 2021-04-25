let csrfToken;

//Creates the meme list to hold all user uploads.
const MemeList = function(props){
    
    if(props.search.length === 0) {
        return (
            <div className="memesList">
                <h3 className="emptyMeme">No Friends Yet</h3>
            </div>
        );
    }

    //Creates the meme node of the image added by a user.
    const memeNodes = props.search.map(function(file) {
        let fileRequestURL = `/retrieve?_id=${file._id}`

        return (
            <div key={file._id} className="meme">
                <img src={fileRequestURL} alt="image" className="image" />
            </div>
        );
    });   

    //meme list to display nodes.
    return (
        <div className="memesList">
            {memeNodes},   
        </div>
    );
};

//Loads the incoming images from the server.
const loadMemesFromServer = () => {
    sendAjax('GET', '/getFileAllIds', null, (data) => {
        ReactDOM.render(
            <MemeList search={data.search} />, document.querySelector("#meme")
        );
    });
};

//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <MemeList search={[]} />, document.querySelector('#meme'),
    );
    setInterval(() => {
        loadMemesFromServer();
    }, 100);
};

//Gains a csrf token per user interaction.
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});