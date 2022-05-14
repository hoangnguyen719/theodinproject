let myLibrary = [];
const inputBookTitle = document.querySelector('#add-book-title');
const inputBookAuthor = document.querySelector('#add-book-author');
const inputBookPages = document.querySelector('#add-book-pages');
const inputBookRead = document.querySelector('#add-book-read');
const addBookBtn = document.querySelector('#add-btn');
const addBtnMsg = document.querySelector('#add-btn-msg');
const addErrorMsgContent = 'Book already existing in the library!';
const addErrorMsgCls = 'add-error';
const addSuccessMsgContent = 'Book successfully added to the library!';
const addSuccessMsgCls = 'add-success';

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function isSameBook(book1, book2) {
  if ((book1.title.toLowerCase() === book2.title.toLowerCase())
      && (book1.author.toLowerCase() === book2.author.toLowerCase())
      && (book1.pages === book2.pages)) {
        return true;
  }
  return false;
}

function bookAlreadyExists(book) {
  for (let existing_book of myLibrary) {
    if (isSameBook(book, existing_book)) return true;
  }
  return false;
}

function getBookFromInput() {
  return new Book(inputBookTitle.value, inputBookAuthor.value
    , Number(inputBookPages.value)
    , inputBookRead.checked)
}

function clearAddInputs() {
  inputBookTitle.value = '';
  inputBookAuthor.value = '';
  inputBookPages.value = '';
  inputBookRead.checked = false;
}

function displayAddMsg(cls, msg) {
  removeAddMsg();
  addBtnMsg.innerHTML = msg;
  addBtnMsg.classList.add(cls);
}

function removeAddMsg() {
  let clsList = addBtnMsg.classList;
  for (let msg of [addErrorMsgCls, addSuccessMsgCls]) {
    if (clsList.contains(msg)) clsList.remove(msg)
  }
  addBtnMsg.innerHTML = '';
}

function addBookFromInput() {
  let inputBook = getBookFromInput();
  if (bookAlreadyExists(inputBook)) {
    displayAddMsg(addErrorMsgCls, addErrorMsgContent);
  } else {
    addBookToLibrary(inputBook);
    displayAddMsg(addSuccessMsgCls, addSuccessMsgContent);
  }
}

function clickBookAddBtn() {
  addBookFromInput();
  displayBookList();
}

function createBookDiv(book) {

}

function displayBookList() {

}

addBookBtn.addEventListener('click', addBookFromInput);