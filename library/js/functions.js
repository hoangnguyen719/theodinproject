let myLibrary = [];
const addErrorMsgContent = 'Book already existing in the library!';
const addErrorMsgCls = 'add-error';
const addSuccessMsgContent = 'Book successfully added to the library!';
const addSuccessMsgCls = 'add-success';

const inputBookTitle = document.querySelector('#add-book-title');
const inputBookAuthor = document.querySelector('#add-book-author');
const inputBookPages = document.querySelector('#add-book-pages');
const inputBookRead = document.querySelector('#add-book-read');
const addBookBtn = document.querySelector('#add-btn');
const addBtnMsg = document.querySelector('#add-btn-msg');
const bookCounter = document.querySelector('#book-count');
const bookList = document.querySelector('#book-list');


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

function displayBookCounter() {
  bookCounter.innerHTML = `Total Books in the Library: ${myLibrary.length}`;
}

function createElement(element, numberOfElement) {
  let arr = []
  for (let i=0; i<numberOfElement; i++) {
    arr.push(document.createElement(element))
  }
  return arr;
}

function addClassToElement(ele, className) {
  ele.classList.add(className);
}

function createBookItemDOM(book) {
  let bookListItem, bookInfo, bookTitle, bookSubInfo, bookAuthor, bookPages, bookBtn;
  let readBtn, removeBtn;
  [bookListItem, bookInfo, bookTitle, bookSubInfo, bookAuthor, bookPages, bookBtn] =
    createElement('div', 7);
  [readBtn, removeBtn] = createElement('button', 2);

  bookListItem.classList.add('book-list-item');
  bookInfo.classList.add('book-info');
  bookTitle.classList.add('book-title');
  bookSubInfo.classList.add('book-sub-info');
  bookAuthor.classList.add('book-author');
  bookPages.classList.add('book-pages');
  bookBtn.classList.add('book-btn');
  readBtn.classList.add('book-read-btn');
  removeBtn.classList.add('book-remove-btn');

  bookTitle.innerHTML = book.title;
  bookAuthor.innerHTML = book.author;
  bookPages.innerHTML = book.pages;
  readBtn.type = 'button';
  removeBtn.type = 'button';
  removeBtn.innerHTML = 'Remove';

  if (book.isRead) {
    readBtn.classList.add('book-read-btn-unread');
    bookTitle.classList.add('book-title-read');
  }

  bookListItem.append(bookInfo, bookBtn);
  bookInfo.append(bookTitle, bookSubInfo);
  bookSubInfo.append(bookAuthor, bookPages);
  bookBtn.append(readBtn, removeBtn);

  return bookListItem;
}

function clearBookList() {
  bookList.innerHTML = '';
}

function displayAllBooks() {
  for (book of myLibrary) {
    let bookDOM = createBookItemDOM(book);
    bookList.append(bookDOM);
  }
}

function displayBookList() {
  displayBookCounter();
  clearBookList();
  displayAllBooks()
}

function clickBookAddBtn() {
  addBookFromInput();
  displayBookList();
}

function removeBook(book) {

}

function removeBookDOM() {

}

function clickBookRemoveBtn() {
  let book;
  removeBook(book);
  removeBookDOM();
}

addBookBtn.addEventListener('click', clickBookAddBtn);
displayBookCounter();