console.log('work')


function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    renderPageSelection()
}

function renderBooks() {
    var books = getBooks()
    console.log(books)
    var strHtmls = ''
    strHtmls = books.map(book =>
        `<tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.price}$</td>
            <td>
                <button class="read btn" onclick="onModalOpen('${book.name}')">Read</button>
                <button class="update btn" onclick="onUpdateBook('${book.id}')">Update</button>
                <button class="delete btn" onclick="onDeleteBook('${book.id}')">Delete</button>
            </td>
        </tr>`
    )
    console.table(strHtmls)
    document.querySelector('.book-list').innerHTML = strHtmls.join('')
}

function renderPageSelection() {
    var books = getPageLength()
    var strHtmls = ''
    for (var i = 0; i < books.books.length / books.size; i++) {
        strHtmls += `<button class="page${i}" onclick="onSelectPage(${i})">${i}</button>`
    }
    document.querySelector('.page-container').innerHTML = strHtmls
    document.querySelector('.page0').style.backgroundColor = 'lightgreen'
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +(prompt('Price ?'))
    console.log(newPrice)
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice) //delete variable
        renderBooks()
    }
}

function onModalOpen(bookId) {
    var book = getBookByName(bookId)
    console.log(book)
    var strHtmls = ''
    const elModal = document.querySelector('.modal')

    elModal.classList.add('open')
    strHtmls = `
    <h3>${book.name}</h3>
    <img src="${book.imgUrl}"/>
    <p>This is ${book.name} learning book!<p>
    <h3>Rate this book:</h3>
    <button value="1" onClick="onRateBtn('${book.id}', value)">+</button><span class="rate">${book.rate}</span>
    <button value="-1" onclick="onRateBtn('${book.id}', value)">-</button>
    <button class="close btn" onclick="onCloseModal()">Close</button>
    `
    elModal.innerHTML = strHtmls
}
function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onRateBtn(bookId, value) {
    const book = getBookById(bookId)
    if (book.rate >= 10 && +value > 0 || book.rate < 1 && +value < 0) return
    var newRate = changeRate(bookId, value)
    console.log('book ', book)
    document.querySelector('.rate').innerText = newRate
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    console.log(filterBy)
    renderBooks()

    const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}


function onOpenInput() {
    document.querySelector('.input').classList.remove('hidden')
}

function onAddBook(name) {
    //TODO:toggle to hide input after another click
    console.log(name)
    if (name) {
        const book = addBook(name)
        hideElement('input')
        renderBooks()
    }
}

function onNextPage() {
    var currPage = nextPage()
    markSelectPage(currPage)
    renderBooks()
}

function onPrevPage() {
    var currPage = prevPage()
    if(currPage < 0 )  return
    markSelectPage(currPage)
    renderBooks()
}

function onSelectPage(page) {
    markSelectPage(page)
    selectPage(page)
    renderBooks()
}

function markSelectPage(page) {
    for(var i = 0; i < 4; i++) {
        document.querySelector(`.page${i}`).style.backgroundColor = 'white'
    }
    document.querySelector(`.page${page}`).style.backgroundColor = 'lightgreen'
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: queryStringParams.get('maxPrice') || 0,
        minRate: queryStringParams.get('minRate') || 0
    }

    if (!filterBy.maxPrice && !filterBy.minRate) return
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    document.querySelector('.filter-price-range').value = filterBy.maxPrice
    setBookFilter(filterBy)
}

function onSortBy(sortKey) {
    console.log(sortKey)
    sort(sortKey)
    renderBooks()
}