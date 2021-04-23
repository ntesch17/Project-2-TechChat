
let csrfToken;

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
            <input className="uploadForm" type='submit' value='Upload!' />

        </form>
    );
};

const FileList = function(props){
    if(props.search.length === 0) {
        return (
            <div className="fileList">
                <h3 className="emptyfile">No Files Yet!</h3>
            </div>
        );
    }

   
    const fileNodes = props.search.map(function(file) {
        let fileRequestURL = `/retrieve?_id=${file._id}`;
        const handleMeme = (e) => {
            e.preventDefault();
           
            let xhr = new XMLHttpRequest();

            xhr.open('POST', fileRequestURL);

            xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

            xhr.send();
        }
      

        return (
            <div key={file._id} className="search">
                <img src={fileRequestURL} alt="image" className="image" />
                <input id='submitMeme' className="makeMeme" type="submit" value="Send to Meme Chat!" onClick={handleMeme} />
            </div>
            
        );
        
    });

    
    
    return (
        <div className="fileList">
            {fileNodes}
        </div>
    );
};

const loadFilesFromServer = () => {
    sendAjax('GET', '/getFileIds', null, (data) => {
        ReactDOM.render(
            <FileList search={data} />, document.querySelector("#search")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <UploadForm csrf={csrf} />, document.querySelector('#makeSearch')
    );

    ReactDOM.render(
        <FileList search={[]} />, document.querySelector('#search'),
    );
  
        
        loadFilesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
       csrfToken = result.csrfToken; 
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});