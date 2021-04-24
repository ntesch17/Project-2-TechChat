let csrfToken;

const MemeList = function(props){
    
    if(props.search.length === 0) {
        return (
            <div className="memesList">
                <h3 className="emptyMeme">No Friends Yet</h3>
            </div>
        );
    }

    const memeNodes = props.search.map(function(file) {
        let fileRequestURL = `/retrieve?_id=${file._id}`

        return (
            <div key={file._id} className="meme">
                <img src={fileRequestURL} alt="image" className="image" />
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
    sendAjax('GET', '/getFileAllIds', null, (data) => {
        ReactDOM.render(
            <MemeList search={data.search} />, document.querySelector("#meme")
        );
    });
};



const setup = function(csrf){
    ReactDOM.render(
        <MemeList search={[]} />, document.querySelector('#meme'),
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