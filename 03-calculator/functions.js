functions = { // {func: function, disp: display}
    add: {
        func: function(a, b) {
            return a + b;
        },
        disp: '+',
        keyName: '+'
    },
    subtract: {
        func: function(a, b) {
            return a - b;
        },
        disp: '-',
        keyName: '-'
    },
    multiply: {
        func: function(a, b) {
            return a * b;
        },
        disp: '×',
        keyName: '*'
    },
    divide: {
        func: function(a, b) {
            return a / b;
        },
        disp: '/',
        keyName: '/'
    }
}
const resetNanBtns = document.querySelectorAll('.reset-nan')
const funcDispValues = Object.values(functions).map(f => f['disp'])
const btmDisplay = document.querySelector('#btm-display')
const topDisplay = document.querySelector('#top-display')
const btnsAppendDisplay = document.querySelectorAll('.display-append');
const btnsFunction = document.querySelectorAll('.function')
const btnClear = document.querySelector('#clear');
const btnDot = document.querySelector('#dot');
const btnReset = document.querySelector('#reset');
const btnDelete = document.querySelector('#delete');
const btnNegate = document.querySelector('#negate');
const btnEqual = document.querySelector('#equal');
let a;
let b;
let func;
let btmDisplayRdyToClr;
const maxDecimal = 3;
const mousedownEvent = new Event('mousedown');

function getId(item) {
    return item.getAttribute('id');
}
btnsFunction.forEach(btn => {
    btn.textContent = functions[getId(btn)]['disp'];
})

function operateFunc(a, b, func) {
    return functions[func]['func'](a, b);
}
function clearBtmDisplay() {
    btmDisplay.textContent = '0';
    btmDisplayRdyToClr = true;
}
function checkClearBtmDisplay() {
    if (btmDisplayRdyToClr) {
        clearBtmDisplay();
    }
}
function reset() {
    clearBtmDisplay();
    topDisplay.textContent = '';
    a = undefined;
    b = undefined;
    func = undefined;
}
function checkInvalidResult() {
    return (isNaN(a) || (isFinite(a) === false))
        && (typeof a !== 'undefined')
}
function checkInvalidResultReset() {
    if (checkInvalidResult()) {
        reset();
    }
}
function formatNegNumber(num) {
    if (typeof num !== 'number') {
        num = Number(num);
    }
    numStr = num.toString();
    return (num < 0) ?
        '(' + numStr + ')' :
        numStr
}
function roundNumber(num, decimal=maxDecimal) {
    if (typeof num !== 'number') {
        num = Number(num);
    }
    let decPoints = 10**decimal;
    return Math.round((num + Number.EPSILON) * decPoints) / decPoints;
}
function addDot() {
    let dotText = this.textContent;
    if (btmDisplay.textContent.indexOf(dotText) === -1) {
        btmDisplay.textContent += dotText;
    }
    btmDisplayRdyToClr = false;
}
function appendBtmDisplay() {
    let thisText = this.textContent;
    checkClearBtmDisplay();
    if ((btmDisplayRdyToClr === true) ||
        (btmDisplay.textContent === '0')) {
        btmDisplay.textContent = thisText;
    } else {
        if (btmDisplay.textContent === '-0') {
            btmDisplay.textContent = '-';
        }
        btmDisplay.textContent += thisText;
    }
    btmDisplayRdyToClr = false;
}
function deleteBtmDisplay() {
    checkClearBtmDisplay();
    if (btmDisplay.textContent.length <= 1) {
        clearBtmDisplay();
    } else {
        btmDisplay.textContent = btmDisplay.textContent.slice(0, -1);
    }
}
function negate() {
    let btmContent = btmDisplay.textContent;
    btmDisplay.textContent = (btmContent[0] === '-') ?
                                btmContent.slice(1, btmContent.length) :
                                '-' + btmContent;
    btmDisplayRdyToClr = false;
}
function displayResult(num1=a, num2=b, f=func) {
    let output = roundNumber(operateFunc(num1, num2, f));
    btmDisplay.textContent = output.toString();
    a = output;
    btmDisplayRdyToClr = true;
    func = undefined;
    b = undefined;
}
// Operator functions
// When press function operator,
// (1) If current result/`a` is invalid, reset()
// (2) if `func` is undefined
//      - if `a` is nan/infinite/invalid, reset()
//      - input `func`
//      - take `a` as `btmD`
//      - update `topD` = `btmD` + `func`
//      - mark `btmD` as ready to clear
// (3) if `func` is defined and `btmD` is ready to clear
//      - input `func`
//      - update `topD` = `topD`.slice(0, -1) + funcDisplay
// (4) if `func` is defined and `btmD` is not ready to clear
//      - take `b` as `btmD`
//      - calculate output
//      - update `topD` = `btmD` = output
//      - make `func` = undefined
//      - use (1)
function defineFunc(btnId, btnDisplay, btmContent) {
    func = btnId;
    a = Number(btmContent);
    topDisplay.textContent = formatNegNumber(btmContent) + ' ' + btnDisplay;
    btmDisplayRdyToClr = true;
}
function updateFunc() {
    let btnId = getId(this);
    let btnDisplay = functions[btnId]['disp'];
    let btmContent = btmDisplay.textContent;
    if (checkInvalidResult()) {
        reset();
    } else if (typeof func === 'undefined') {
        defineFunc(btnId, btnDisplay, btmContent);
    } else if (btmDisplayRdyToClr) {
        // Waiting to input `b`, so we only update `func`
        func = btnId;
        topDisplay.textContent = topDisplay.textContent.slice(0, -1) +
            ' ' + btnDisplay;
    } else {
        b = Number(btmContent);
        displayResult();
        if (checkInvalidResult()) {
            topDisplay.textContent += ' ' + btmContent;
        } else {
            defineFunc(btnId, btnDisplay, btmDisplay.textContent);
        }
    }
}

// Equal operator
// When press equal operator
// if a = NaN then reset
// (1) If `a` is invalid, reset()
// (2) If func is undefined
//      - a = `btmD`
//      - func = 'add'
//      - b = 0
//      - outputing (with `displayResult`) (*)
//          + calculate output
//          + update `btmD` = output
//          + make `func` undefined
//      - update `topD` = a
// (3) If func is defined
//      - take `b` as `btmD`
//      - update `topD` = `topD` + `btmD`
//      - outputing (use *)
function equal() {
    if (checkInvalidResult()) {
        reset();
    } else if (typeof func === 'undefined') {
        a = Number(btmDisplay.textContent);
        let tmpFunc = 'add';
        let tmpB = 0;
        displayResult(a, tmpB, tmpFunc);
        topDisplay.textContent = a;
    } else {
        b = Number(btmDisplay.textContent);
        topDisplay.textContent += ' ' + formatNegNumber(b);
        displayResult(a, b, func);
    }
}

resetNanBtns.forEach(btn => {
    btn.addEventListener('mousedown', checkInvalidResultReset);
}) // Need to keep this at top before all other `addEventListener`

btnClear.addEventListener('mousedown', clearBtmDisplay);
btnReset.addEventListener('mousedown', reset);
btnDelete.addEventListener('mousedown', deleteBtmDisplay);
btnNegate.addEventListener('mousedown', negate);
btnsAppendDisplay.forEach(btn => {
    btn.addEventListener('mousedown', appendBtmDisplay);
});
btnsFunction.forEach(btn => {
    btn.addEventListener('mousedown', updateFunc);
})
btnEqual.addEventListener('mousedown', equal);
btnDot.addEventListener('mousedown', addDot);

document.addEventListener('keydown', (e) => {
    console.log(e);
    let keyName = e.key.toLowerCase();
    let elem = document.querySelector(`[keyName="${keyName}"]`)
    if (elem) {
        elem.dispatchEvent(mousedownEvent);
    }
})

reset();