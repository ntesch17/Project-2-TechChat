// <!-- Post form. Note that the encoding type is set to 'multipart/form-data'. You cannot
//     upload files using the standard form-urlencoded encoding type. Also note that because we
//     are using the default html form action, we have named out file sampleFile. This will become
//     relevant in our src/controllers/files.js when trying to access the file on the server. -->
//     <form ref='uploadForm' 
//       id='uploadForm' 
//       action='/upload' 
//       method='post' 
//       encType="multipart/form-data">
//         <input type="file" name="sampleFile" />
//         <input type='submit' value='Upload!' />
//     </form> 
    
//     <!-- Get form. Just a standard GET request getting made with a query parameter of ?filename -->
//     <form ref='retrieveForm' 
//       id='retrieveForm' 
//       action='/retrieve' 
//       method='get'>
//       <label for='fileName'>Retrieve File By Name: </label>
//       <input name='fileName' type='text' />
//       <input type='submit' value='Download!' />
//     </form>

let csrfToken;

const handleUpload = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    let formData = new FormData();

    formData.append("sampleFile", document.getElementById("upload").files[0]);

    let xhr = new XMLHttpRequest();

    xhr.open('POST', $("#uploadForm").attr("action"));


    xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

    xhr.onload = () => loadFilesFromServer();

    xhr.send(formData);

    return false;
};

// const handleRetrieve = (e) => {
//     e.preventDefault();

//     $("#domoMessage").animate({width:'hide'}, 350);

//     if($("#chatResponse").val() == ''){
//         handleError("RAWR! Chat fields are required.");
//         return false;
//     }

//     sendAjax('POST', $("#chatForm").attr("action"), $("#chatForm").serialize(), function() {
//         loadChatFromServer();
//     });

//     return false;
// };

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

// const retrieveForm = (props) =>{
//     return (
//         <form id="retrieveForm" name="retrieveForm"
//         onSubmit={handleRetrieve}
//         action="/search"
//         method="GET"
//         className="retrieveForm"
//         >
//              <label htmlFor='fileName'>Retrieve File By Name: </label>
//              <input id='retrieve' name='fileName' type='text'  placeholder="Enter a file by name."/>
//             <input type="hidden" name="_csrf" value={props.csrf} />
//             <input className="retrieveForm" type='submit' value='Download!' />

//         </form>
//     );
// };


const FileList = function(props){
    if(props.search.length === 0) {
        return (
            <div className="fileList">
                <h3 className="emptyfile">No Files Yet!</h3>
            </div>
        );
    }

   
    const fileNodes = props.search.map(function(search) {
       

        return (
            <div key={search} className="search">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                {/* <img className="friendName" src="/retrieve?fileName={search}"   /> */}
{/*                 <img src="/retrieve?fileName=picture.jpg" />
                <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Response" onClick={handleDelete}/>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input id='submitFriend' className="makeFriendSubmit" type="submit" value="Add Friend!" onClick={handleFriend} /> */}
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
    sendAjax('GET', '/retrieve', null, (data) => {
        ReactDOM.render(
            <FileList search={data.search} />, document.querySelector("#search")
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