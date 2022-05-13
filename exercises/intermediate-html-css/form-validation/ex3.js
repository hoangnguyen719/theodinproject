const email = document.getElementById("mail");
const submit = document.getElementById("submit-btn");
const ERROR_MSG = "The email address should contain one @ and is at least 10-character long"

function checkEmailValid() {
    return (email.value.length >= 10) && (email.value.indexOf('@') > -1)
}

function emailValidify() {
    if (checkEmailValid()) {
        email.setCustomValidity("");
    } else {
        email.setCustomValidity(ERROR_MSG);
        email.reportValidity();
    }
}

email.addEventListener("input", emailValidify);
submit.addEventListener("click", emailValidify)
