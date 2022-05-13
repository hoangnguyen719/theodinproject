const nameMinLen = 2;
const passwordMinLen = 6;
const defaultMaxLen = 10e3;
const emailRegex = /^\S+@\w+\.\w+.*$/; // you@example.com
const phoneRegex = /^\d{9,12}$/;
const errorMsgSpanClass = 'error-msg';
// password regex: contains at least a special character,
// a lower case letter, an upper case letter, and a digit
const passwordRegex = [/^.*[!@#$%^&*.].*$/, /^.*[A-Z].*$/, /^.*[a-z].*$/, /^.*\d.*$/];

const formPrpElements = document.querySelectorAll('div.form-prp>input');
const form = document.querySelector('form#signup-form');
const passwordEle = document.querySelector('input#password');
// const passwordConfirmEle = document.querySelector('input#password-confirm');
// const firstNameEle = document.querySelector('input#first-name');
// const lastNameEle = document.querySelector('input#last-name');
// const emailEle = document.querySelector('input#email');
// const phoneEle = document.querySelector('input#phone');

const attrConstraints = {
    '#first-name': {
        'regexp': undefined
        , 'min-len': nameMinLen
        , 'max-len': defaultMaxLen
        , 'required': true
        , 'match-password': false
        , 'error-msg': 'Must have at least 2 characters'
    }
    , '#last-name': {
        'regexp': undefined
        , 'min-len': nameMinLen
        , 'max-len': defaultMaxLen
        , 'required': true
        , 'match-password': false
        , 'error-msg': 'Must have at least 2 characters'
    }
    , '#email': {
        'regexp': emailRegex
        , 'min-len': 0
        , 'max-len': defaultMaxLen
        , 'required': true
        , 'match-password': false
        , 'error-msg': 'you@example.com'
    }
    , '#phone': {
        'regexp': phoneRegex
        , 'min-len': 0
        , 'max-len': defaultMaxLen
        , 'required': false
        , 'match-password': false
        , 'error-msg': 'Must be of 9-12 digits'
    }
    , '#password': {
        'regexp': passwordRegex
        , 'min-len': 0
        , 'max-len': defaultMaxLen
        , 'required': true
        , 'match-password': false
        , 'error-msg': `Must contains at least 1 special character !@#$%^&*.,
            1 upper-case letter,
            1 lower case letter and 1 digit`
    }
    , '#password-confirm': {
        'regexp': undefined
        , 'min-len': 0
        , 'max-len': defaultMaxLen
        , 'required': true
        , 'match-password': true
        , 'error-msg': 'Must be similar to password'
    }
};

// Resource https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_without_a_built-in_api
// 1. Make form `novalidate` - DONE
// 2. Make a copy of index.html and remove all html-constraint
// 3. Change CSS `:invalid` and `:valid` selectors to class selectors (e.g. input.invalid)
// 4. Update JS to account for validation rules - DONE
//     a) Required/empty or not? - DONE
//     b) Length - DONE
//     c) Data type: Number, email, etc. - DONE
//     d) Password confirm - DONE
//     e) Input format - DONE
// 5. Add form submit validation
// 6. Add validation styling



function allowValidityStyle(element) {
    if (!element.classList.contains('validity-style')) {
        element.classList.add('validity-style');
    }
}

function containInvalidCls(element) {
    return element.classList.contains('invalid')
}

function containValidCls(element) {
    return element.classList.contains('valid');
}

function classifyInvalid(element) {
    let clsList = element.classList;
    if (containValidCls(element)) {
        clsList.remove('valid');
    }
    if (!containInvalidCls(element)) {
        clsList.add('invalid');
    }
}

function classifyValid(element) {
    let clsList = element.classList;
    if (!containValidCls(element)) {
        clsList.add('valid');
    }
    if (containInvalidCls(element)) {
        clsList.remove('invalid');
    }
}

function checkLength(element, minLen=-1, maxLen=defaultMaxLen) {
    let valLen = element.value.length;
    return ((valLen >= minLen) && (valLen <= maxLen));
}

function checkRequired(element, isRequired) {
    return isRequired ? (element.value.trim().length > 0) : true;
}

function checkFormat(element, regexp) {
    let eleValue = element.value;
    if ((regexp === undefined) || (element.value.length === 0)) { // no checking
        return true;
    } else if (regexp.length === undefined) { // a single regexp
        return regexp.test(eleValue);
    } else { // an array of regexp expressions
        return regexp.every(rx => rx.test(eleValue));
    }
}

function checkMatchPassword(element, isChecked) {
    return isChecked ? passwordEle.value === element.value : true;
}

function isValid(element, constraints) {
    return (
        checkRequired(element, constraints['required'])
        && checkLength(element, constraints['min-len'], constraints['max-len'])
        && checkFormat(element, constraints['regexp'])
        && checkMatchPassword(element, constraints['match-password'])
        )
}

function validate(element, constraints) {
    if (isValid(element, constraints)) {
        classifyValid(element);
    } else {
        classifyInvalid(element);
    }

}

function hideErrorMsg(errorMsgSpace) {
    if (errorMsgSpace.classList.contains('error-active')) {
        errorMsgSpace.classList.remove('error-active');
    }
    errorMsgSpace.textContent = '';
}

function showErrorMsg(element, errorMsgSpace, errorMsg='') {
    if (containInvalidCls(element)) {
        errorMsgSpace.textContent = errorMsg;
        if (!errorMsgSpace.classList.contains('error-active')) {
            errorMsgSpace.classList.add('error-active');
        }
    } else {
        hideErrorMsg(errorMsgSpace);
    }
}

function listenEventValidate(element, event, constr, errorMsgSpace) {
    element.addEventListener(event, () => {
        validate(element, constr);
        if (element.classList.contains('validity-style')) {
            showErrorMsg(element, errorMsgSpace, constr['error-msg']);
        }
    })
}

// Validate form submit
function validateAll(event) {
    for (let selector in attrConstraints) {
        let element = document.querySelector(selector);
        let constraints = attrConstraints[selector];
        if (!isValid(element, constraints)) {
            event.preventDefault();
            element.focus();
            break;
        }
    }
}

function allowValidStyleSubmit() {
    formPrpElements.forEach(ele => allowValidityStyle(ele));
}

function validateSubmit(event) {
    allowValidStyleSubmit();
    validateAll(event);
}
////

form.addEventListener('submit', e => validateSubmit(e));

for (let selector in attrConstraints) {
    let element = document.querySelector(selector);
    let constr = attrConstraints[selector];
    let errorMsgSpace = document.querySelector(
        selector + ' ~ span.' + errorMsgSpanClass
        );

    validate(element, constr);

    element.addEventListener('blur', () => {
        allowValidityStyle(element);
    })
    listenEventValidate(element, 'input', constr, errorMsgSpace);
    listenEventValidate(element, 'focus', constr, errorMsgSpace);
    element.addEventListener('blur', () => {
        hideErrorMsg(errorMsgSpace)
    })
}