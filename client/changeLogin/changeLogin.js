const handleChangeLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#newPass").val() == '' || $("#newPass2").val() == ''){
        handleError("RAWR! Username or password is empty.");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#changeloginForm").attr("action"), $("#changeloginForm").serialize(), redirect);

    return false;
};




const changeLoginWindow = (props) =>{
    return (
        <form id="changeLoginForm" name="changeLoginForm"
        onSubmit={handleChangeLogin}
        action="/change"
        method="POST"
        className="changeLoginForm"
        >
            
            <label htmlFor="newPass">Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="New Password"/>
            <label htmlFor="newPass2">Password: </label>
            <input id="newPass2" type="password" name="newPass2" placeholder="Retype New Password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="sign Up" />

        </form>
    );
};

const createChangeLoginWindow = (csrf) => {
    ReactDOM.render(
        <changeLoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const changeButton = document.querySelector("#changeButton");
    
    changeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangeLoginWindow(csrf);
        return false;
    });

    createChangeLoginWindow(csrf); //default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});