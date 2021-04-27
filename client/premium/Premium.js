let csrfToken;

//Handles user interactions with the premium form.
const handlePremium = (e) => {
    e.preventDefault();

    $("#alertMessage").animate({width:'hide'}, 350);

    if($("#email").val() == ''){
        handleError("Chat fields are required.");
        return false;
    }

    $("#submits").submit(function(e) {
       
    });

    sendAjax('POST', $("#premiumForm").attr("action"), $("#premiumForm").serialize(), function() {
        $("#email").hide();
        $("#submits").hide();
        loadPremiumFromServer();
    });

    return false;
};

//Premium form for users to enter email to subscribe.
const PremiumForm = (props) =>{
    return (
        <form id="premiumForm" 
        onSubmit={handlePremium}
        name="premiumForm"
        action="/premium"
        method="POST"
        className="premiumForm"
        >
            <label htmlFor="email">Enter your email: </label>
            <input id="email" type="text" name="email" placeholder="Enter a email"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input id='submits' className="makeChatSubmit" type="submit" value="Submit to Subscribe" />

        </form>
    );
};

//Creates the premium list to store email of subcribtion.
const PremiumList = function(props){
    if(props.premium.length === 0) {
        return (
            <div className="premiumList">
                <h3 className="emptyPremium">Enter email to subcribe!</h3>
            </div>
        );
    }

   //Creates the premium node of a user email.
    const premiumNodes = props.premium.map(function(premium) {

        // //Deletes the response from the database.
        // const handleDelete = (e) => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.open('DELETE', `/deleteMessage?_id=${chat._id}&_csrf=${csrfToken}`);
        //     xhr.send();
        // }

        // //Adds a friend to the user signed in.
        // const handleFriend = (e) => {
           
        //    e.preventDefault();
           
        //     let xhr = new XMLHttpRequest();

        //     xhr.open('POST', `/addFriend?username=${chat.username}`);

        //     xhr.setRequestHeader('CSRF-TOKEN', csrfToken);

        //     xhr.send();
        // }

        //Content viewable on chat page.
        return (
            <div key={premium._id} className="premium">
                <img src="/assets/img/chatIcon.png" alt="Chat Icon" className="chatIcon" />
                <h3 className="chatUser"> Subscribed Email: {premium.email} </h3>
            </div>
            
        );
        
    });

    
    //Premium list to display nodes.
    return (
        <div className="premiumList">
            {premiumNodes}
        </div>
    );
};

//Loads the incoming reponses from the server.
const loadPremiumFromServer = () => {
    sendAjax('GET', '/getPremium', null, (data) => {
        ReactDOM.render(
            <PremiumList premium={data.premium} />, document.querySelector("#premium")
        );
    });
};

//Sets up the react render calls.
const setup = function(csrf){
    ReactDOM.render(
        <PremiumForm csrf={csrf} />, document.querySelector('#makePremium')
    );

    ReactDOM.render(
        <PremiumList premium={[]} />, document.querySelector('#premium'),
    );
    loadPremiumFromServer();
     
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