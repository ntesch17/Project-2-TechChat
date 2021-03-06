
//Handles user interactions with the change loggin form.
const handleChangeLogin = (e) => {
    e.preventDefault();

    $("#alertessage").animate({width:'hide'},350);

    if($("#oldPass").val() == '' ||$("#newPass").val() == '' || $("#newPass2").val() == ''){
        handleError("All fields required.");
        return false;
    }

    sendAjax('POST', $("#changeLoginForm").attr("action"), $("#changeLoginForm").serialize(), redirect);

    return false;
};

//change loggin form for users to change the password to the account already created.
const ChangeLoginWindow = (props) =>{
    return (
        <form id="changeLoginForm" name="changeLoginForm"
        onSubmit={handleChangeLogin}
        action="/change"
        method="POST"
        className="changeLoginForm"
        >
             <label htmlFor="oldPass">Old Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="Old Password"/>
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="New Password"/>
            <label htmlFor="newPass2">Retype New Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="Retype New Password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Change Password" />

        </form>
    );
};

//Creates the change loggin window
const createChangeLoginWindow = (csrf) => {
    ReactDOM.render(
        <ChangeLoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    createChangeLoginWindow(csrf); //default view
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