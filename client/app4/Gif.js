
let csrfToken;

//Handles user interactions with the upload form.
const handleUpload = (e) => {
    e.preventDefault();

    $("#alertMessage").animate({width:'hide'}, 350);

    let formData = new FormData();

    formData.append("sampleFile", document.getElementById("upload").files[0]);

    let xhr = new XMLHttpRequest();

    xhr.open('POST', $("#uploadForm").attr("action"));


    xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

    xhr.onload = () => loadFilesFromServer();

    xhr.send(formData);

    return false;
};

//upload form for users to enter images to their private account.
const UploadForm = (props) =>{
    return (
        <form id="uploadForm" 
        onSubmit={handleUpload}
        name="uploadForm"
        action="/upload"
        method="POST"
        encType="multipart/form-data"
        className="uploadForm"
        >
             <label htmlFor="image">Enter a image to upload: </label>
            <input id='upload' type="file" name="sampleFile" placeholder="Enter a file here"/>
            
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className='makeUploadSubmit' type='submit' value='Upload!' />

        </form>
    );
};

//Creates the image list to store images to be viewed by the user that entered the image.
const FileList = function(props){
    if(props.search.length === 0) {
        return (
            <div className="fileList">
                <h3 className="emptyfile">No Files Yet!</h3>
            </div>
        );
    }

   //Creates the image node of a user entered image.
    const fileNodes = props.search.map(function(file) {
        let fileRequestURL = `/retrieve?_id=${file._id}`;

        //Handles deleting of a meme.
        const handleDelete = (e) => {
            e.preventDefault();
           
            let xhr = new XMLHttpRequest();

            xhr.open('DELETE', `/deleteMeme?_id=${file._id}`);

            xhr.onload = () => {
                console.log(xhr.response)
                if(xhr.response) {
                    let obj = JSON.parse(xhr.response);
                   
                    if(obj.redirect) {
                        window.alert("Meme Deleted!");
                        window.location = obj.redirect;
                    }
                }
            }

            xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

            xhr.send();
        }

        //Content viewable on file list page.
        return (
            <div key={file._id} className="search">
                <img src={fileRequestURL} alt="image" className="image" />
                <input id='submitMeme' className="makeDeleteMeme" type="submit" value="Delete Image!" onClick={handleDelete}  />
                <a href={fileRequestURL} download="Your_Image">
                <button id="downloadButton" type="button">Download Image!</button>
                </a>
            </div>
        );
    });

    //file list to display nodes.
    return (
        <div className="fileList">
            {fileNodes}
        </div>
    );
};

//Loads the incoming files from the server.
const loadFilesFromServer = () => {
    sendAjax('GET', '/getFileIds', null, (data) => {
        ReactDOM.render(
            <FileList search={data} />, document.querySelector("#search")
        );
    });
};

//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <UploadForm csrf={csrf} />, document.querySelector('#makeSearch')
    );

    ReactDOM.render(
        <FileList search={[]} />, document.querySelector('#search'),
    );
    
    loadFilesFromServer();
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