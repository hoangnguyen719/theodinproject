let myLibrary = {};
let nextBookIdx = 0;
const addErrorMsgContent = 'Book already existing in the library!';
const addErrorMsgCls = 'add-error';
const addSuccessMsgContent = 'Book successfully added to the library!';
const addSuccessMsgCls = 'add-success';
const bookIdAttrName = 'bookid';

const inputBookTitle = document.querySelector('#add-book-title');
const inputBookAuthor = document.querySelector('#add-book-author');
const inputBookPages = document.querySelector('#add-book-pages');
const inputBookRead = document.querySelector('#add-book-read');
const addBookBtn = document.querySelector('#add-btn');
const addBtnMsg = document.querySelector('#add-btn-msg');
const bookCounter = document.querySelector('#book-count');
const bookList = document.querySelector('#book-list');


// function Book(title, author, pages, isRead) {
//   this.title = title;
//   this.author = author;
//   this.pages = pages;
//   this.isRead = isRead;
// }

class Book {
  constructor(title, author, pages, isRead) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.isRead = isRead;
  }
}

function addBookToLibrary(bookIdx, book, bookDOM) {
  myLibrary[bookIdx] = {
    'book': book
    , 'DOM': bookDOM
  }
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
  for (let existing_book in myLibrary) {
    if (isSameBook(book, myLibrary[existing_book]['book'])) return true;
  }
  return false;
}

function getBookFromInput() {
  return new Book(
    inputBookTitle.value
    , inputBookAuthor.value
    , Number(inputBookPages.value)
    , inputBookRead.checked
    );
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
    addBookToLibrary(nextBookIdx, inputBook, createBookItemDOM(inputBook, nextBookIdx));
    displayAddMsg(addSuccessMsgCls, addSuccessMsgContent);
    nextBookIdx ++;
  }
}

function displayBookCounter() {
  bookCounter.innerHTML =
    `Total Books in the Library: ${Object.keys(myLibrary).length}`;
}

function clearBookList() {
  bookList.innerHTML = '';
}

function displayAllBooks() {
  clearBookList();
  for (let book in myLibrary) {
    bookList.append(myLibrary[book]['DOM']);
  }
}

function displayBookList() {
  displayBookCounter();
  displayAllBooks()
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

function clickBookRemoveBtn(event) {
  let bookIdx = event.srcElement.getAttribute(bookIdAttrName);
  delete myLibrary[bookIdx];
  displayBookList();
}

function addElementCls(ele, cls) {
  if (!ele.classList.contains(cls)) {
    ele.classList.add(cls);
  }
}

function removeElementCls(ele, cls) {
  if (ele.classList.contains(cls)) {
    ele.classList.remove(cls);
  }
}

function clickBookReadBtn(event) {
  let readBtn = event.srcElement;
  let bookItem = myLibrary[readBtn.getAttribute(bookIdAttrName)];
  bookItem['book'].isRead = true;
  let bookTitle = bookItem['DOM'].querySelector('.book-title');
  if (readBtn.classList.contains('book-read-btn-unread')) {
    removeElementCls(readBtn, 'book-read-btn-unread');
    removeElementCls(bookTitle, 'book-title-read');
  } else {
    addElementCls(readBtn, 'book-read-btn-unread');
    addElementCls(bookTitle, 'book-title-read');
  }
}

function createBookItemDOM(book, bookIdx) {
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

  bookListItem.setAttribute(bookIdAttrName, bookIdx);
  readBtn.setAttribute(bookIdAttrName, bookIdx);
  removeBtn.setAttribute(bookIdAttrName, bookIdx);

  readBtn.addEventListener('click', clickBookReadBtn);
  removeBtn.addEventListener('click', clickBookRemoveBtn);

  bookListItem.append(bookInfo, bookBtn);
  bookInfo.append(bookTitle, bookSubInfo);
  bookSubInfo.append(bookAuthor, bookPages);
  bookBtn.append(readBtn, removeBtn);

  return bookListItem;
}

function clickBookAddBtn() {
  addBookFromInput();
  displayBookList();
}

addBookBtn.addEventListener('click', clickBookAddBtn);

displayBookList();