const gNames = ['HTML', 'CSS', 'JS', 'React', 'Angular', 'Vue', 'Type Script', 'SASS']
const gImg = ['img/html.png', 'img/css.png', 'img/js.png', 'img/react.png', 'img/angular.png', 'img/vue.png', 'img/typescript.png', 'img/sass.png']
const STORAGE_KEY = 'book'
const PAGE_SIZE = 5

var gFilterBy = { maxPrice: 0, minRate: 0, search: null}
var gSorted = false
var gBooks
var gPageIdx = 0

_createBooks()

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 16; i++) {
            books.push(_createBook())
        }
    }
    gBooks = books
    _saveToLocalStorage()
}

function _createBook(name) {
    var index = getRandomIntInclusive(0, gNames.length - 1)
    return {
        id: makeId(1),
        name: (name) || gNames[index],
        price: getRandomIntInclusive(1, 150),
        imgUrl: gImg[index],
        rate: 0
    }
}

function getBooks() {
    // var books
    if (gFilterBy.search) {
        return books = gBooks.filter(book => book.name.toLowerCase() === gFilterBy.search)
    } else {
        var books = gBooks.filter(book => book.rate >= gFilterBy.minRate && book.price <= gFilterBy.maxPrice)
    }

    var startIdx = gPageIdx * PAGE_SIZE
    console.log(gBooks)
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveToLocalStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => bookId === book.id)
    book.price = newPrice
    _saveToLocalStorage()
}

function changeRate(bookId, value) {
    const book = gBooks.find(book => bookId === book.id)
    return book.rate += +value
}

function getBookByName(bookName) {
    const book = gBooks.find(book => book.name === bookName)
    return book
}

function getPageLength() {
    return {books:gBooks, size:PAGE_SIZE}
}

function setBookFilter(filterBy) {
    if (filterBy.minRate !== undefined) gFilterBy.minRate = +filterBy.minRate
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = +filterBy.maxPrice
    if (filterBy.search !== null) gFilterBy.search = filterBy.search
    return gFilterBy
}

function addBook(name) {
    const book = _createBook(name)
    gBooks.unshift(book)
    _saveToLocalStorage()
    return book
}

function nextPage() {
    gPageIdx++
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
    return gPageIdx
}

function selectPage(page) {
    gPageIdx = +page
}

function prevPage() {
    if (gPageIdx < 1) return gPageIdx
    gPageIdx--
    return gPageIdx
}

function sort(sortKey) {
    gPageIdx = 0
    if (sortKey === 'title') gBooks.sort((book1, book2) => book1.name.localeCompare(book2.name))
    else gBooks.sort((book1, book2) => book1.price - book2.price)
}

function _saveToLocalStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
