let csrfToken;

const handleGif = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#gifSearch").val() == '' || $("#gifLimit").val() == ''){
        handleError("RAWR! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#gifForm").attr("action"), $("#gifForm").serialize(), function() {
        loadGifFromServer();
    });

    return false;
};


const GifForm = (props) =>{
    return (
        <form id="gifForm" 
        onSubmit={handleGif}
        name="gifForm"
        action="/search"
        method="POST"
        className="gifForm"
        >
            <label htmlFor="search">Enter a Search Term: </label>
            <input id="gifSearch" type="text" name="search" placeholder="Enter Search Term"/>
            <label htmlFor="limit">Enter a Search Term: </label>
            <input id="gifLimit" type="text" name="limit" placeholder="Enter Limit to search"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeChatSubmit" type="submit" value="Make Chat" />

        </form>
    );
};


const GifList = function(props){
    if(props.search.length === 0) {
        return (
            <div className="chatList">
                <h3 className="emptyChat">No Responses Yet!</h3>
            </div>
        );
    }

   
    const GifNodes = props.search.map(function(search) {

        //console.log("searchButtonClicked() called");
     
     //1
      GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

      //2
      //Public API key from here: https://developers.giphy.com/docs/
      //If this one no longer works, get your own (it's free)
       GIPHY_KEY = "dc6zaTOxFJmzC";
 
      //3-build up our URL string
      url = GIPHY_URL;
      url += "api_key=" + GIPHY_KEY;
      
      //4-parse the user entered term we wish to search
       term = document.querySelector("#searchterm").value;
      displayTerm = term;
 
      //5-get rid of any leading and trialing spaces
      term = term.trim();
 
      //6- encode spaces and special characters
      term = encodeURIComponent(term);
      
      if(e.target.id == 'search'){
         
         document.querySelector("#searchMore").disabled = false;
         
         offset = 0;
 
         //1
      const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
 
      //2
      //Public API key from here: https://developers.giphy.com/docs/
      //If this one no longer works, get your own (it's free)
      let GIPHY_KEY = "dc6zaTOxFJmzC";
 
      //3-build up our URL string
      url = GIPHY_URL;
      url += "api_key=" + GIPHY_KEY;
      
      //4-parse the user entered term we wish to search
      let term = document.querySelector("#searchterm").value;
      displayTerm = term;
 
      //5-get rid of any leading and trialing spaces
      term = term.trim();
 
      //6- encode spaces and special characters
      term = encodeURIComponent(term);
     }
      //7-if there's no term to search then bail out of the function (return does this)
      if (term.length < 1) return;
 
      //8- append the search term to the URL - the parameter name is 'q'
      url += "&q=" + term;
      
      //9 - grab the user chosen search 'limit' from the <select> and append it to the URL
      limit = document.querySelector("#limit").value;
      
 
      url += "&limit=" + Number(limit);
      
      
      //10 - update the UI
      document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";
 
      //11-see what the URL looks like
      //console.log(url);
      if(e.target.id == 'searchMore'){
         
         offset += Number(limit);
 
         url += "&offset=" +offset;
         //  if (offset > 1) {
         //       fixedURL = url.replace("&offset=" + offset, '');
         //  }
         console.log("press");
         console.log(url);
    
         console.log(Number(offset));
         
      }
      // 12 Request data!
      getData(url);
  }
 
 
 
//   function getData(url) {
//       //1-create new XHR object
//       let xhr = new XMLHttpRequest();
 
//       //2-set the onload handler
//       xhr.onload = dataLoaded;
 
//       //3-set the onerror handler
//       xhr.onerror = dataError;
 
//       //4-open connection and send the request
//       xhr.open("GET", url);
//       xhr.send();
//   }
 
//   function dataLoaded(e) {
//       //5-event.target is the xhr object
//       let xhr = e.target;
 
//       //6-xhr.responseText is the JSON file we just downloaded
//       //console.log(xhr.responseText);
 
//       //7-turn the text into a parsable JavaScript Object
//       let obj = JSON.parse(xhr.responseText);
 
//       //8-if there are no results, print a message and return
//       if (!obj.data || obj.data.length == 0) {
//           document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
//           return; //Bail out
//       }
 
//       //9-Start building an HTML string we will display to the user
//       let results = obj.data;
//       //console.log("results.length = " + results.length);
//       let bigString = "<p><i>Here are " + results.length + " results for " + displayTerm + "Offset = " +offset+"</i></p>";
 
//       //10-loop through the array of results
//       for (let i = 0; i < results.length; i++) {
//           let result = results[i];
 
//           //11-get the URL to the GIF
//           let smallURL = result.images.fixed_width_small.url;
//           if (!smallURL) smallURL = "images/no-image-found.png";
 
//           //12-get the URL to the GIGPHY Page
//           let url = result.url;
 
//           let rating = (result.rating ? result.rating : "NA").toUpperCase();
//           //13 - Build a <div> to hold each result
//           //ES6 String Templating
//           let line = `<div class='result'><img src='${smallURL}' title= '${result.id}'/>`;
//           line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span>`;
//           line += `<span><p>Rating: ${rating}</p></span></div>`;
 
//           //14- another way of doing the same thing above
//           //Replaces this:
//           //let line = "<div class='result'>";
//           //line+="<img src=";
//           //line+=smallURL;
//           //line+=" title=";
//           //line+=result.id;
//           //line+= "/>";
//           //line+="<span><a target='_blank' href"+url+">View on Giphy</a></span>";
 
//           //15-add the <div> to 'bigString'
//           bigString += line;
//       }
 
//       //16 - all done building the HTML - show it to the user!
//       document.querySelector("#content").innerHTML = bigString;
 
//       //17-update the status
//       document.querySelector("#status").innerHTML = "<b>Success!</b>"
 
        // const handleDelete = (e) => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
        //     xhr.send();
        // }

        // const handleFriend = (e) => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.open('POST', `/getFriendsList?_id=${chat._id}&_csrf=${csrfToken}`);
        //     xhr.send();
        // }

        // return (
        //     <div key={chat._id} className="chat">
        //         <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
        //         <h3 className="chatUser"> User: {chat.username} </h3>
        //         <h3 className="chatResponse"> Response: {chat.response} </h3>
        //         <input id='submitDelete' className="makeDeleteSubmit" type="submit" value="Delete Response" onClick={handleDelete}/>
        //         <input id='submits' className="makeFriendSubmit" type="submit" value="Add Friend!" onClick={handleFriend} />
        //     </div>
            
        // );
        
    });

    
    
    return (
        <div className="gifList">
            {GifNodes}
        </div>
    );
};

const loadChatFromServer = () => {
    sendAjax('GET', '/getChat', null, (data) => {
        ReactDOM.render(
            <ChatList chat={data.chat} />, document.querySelector("#chat")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <ChatForm csrf={csrf} />, document.querySelector('#makeChat')
    );

    ReactDOM.render(
        <ChatList chat={[]} />, document.querySelector('#chat'),
    );
    setInterval(() => {
        
        loadChatFromServer();
      }, 100);
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