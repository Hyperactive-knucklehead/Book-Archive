// fetching data from api
const fetchData = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// getting all elements by id
const searchField = document.getElementById("search-field");
const searchBtn = document.getElementById("search-btn");
const booksContainer = document.getElementById("books");
const searchResults = document.getElementById("search-results");

//load data
searchBtn.addEventListener("click", (e) => {
  removeError();
  e.preventDefault();
  if (searchField.value.length > 0) {
    loadData();
  } else {
    searchField.classList.add("border-3", "border-danger");
    searchResults.innerText = "please search your favorite book";
    searchResults.classList.add("fw-bold");
    searchResults.setAttribute("style", "color:#ff8c8c !important");
  }
});

//removing error from search field when input is given
const removeError = () => {
  searchField.classList.remove("border-3", "border-danger");
  searchResults.innerText = "";
  searchResults.classList.remove("fw-bold");
  searchResults.removeAttribute("style", "color:#ff8c8c !important");
};
searchField.addEventListener("blur", () => {
  removeError();
});

const loadData = () => {
  const searchText = searchField.value;
  const url = `https://openlibrary.org/search.json?q=${searchText}`;
  fetchData(url)
    .then((data) => displayData(data.docs))
    .finally(() => (searchField.value = ""));
};

//display data
const displayData = (books) => {
  booksContainer.textContent = "";
  if (books.length === 0) {
    searchResults.innerText = "NO RESULTS FOUND";
  } else {
    books?.forEach((book) => {
      const { title, first_publish_year, cover_i } = book;
      if (cover_i) {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("col");
        bookDiv.innerHTML = `
        <div class="card h-100">
            <img src="https://covers.openlibrary.org/b/id/${cover_i}-M.jpg" style="width: 337px;
            height: 345px;" class="card-img-top" alt="book" />
                <div class="card-body">
                  <h5 class="card-title">${title}</h5>
                  <div class="card-text">
                    <p>author name : ${
                      book.author_name?.[0] ? book.author_name[0] : ""
                    }<p/>
                    <p>publisher : ${
                      book.publisher?.[0] ? book.publisher[0] : ""
                    }<p/>
                    <p>first published : ${
                      first_publish_year ? first_publish_year : ""
                    }<p/>
                  </div>
                </div>
        </div>
        `;
        booksContainer.appendChild(bookDiv);
      }
    });
    //showing how many search results found
    if (booksContainer.childElementCount === 0) {
      searchResults.innerHTML = `${books.length} SEARCH RESULTS FOUND FOR <strong>"${searchField.value}"</strong> AND AMONG THEM NONE ARE SHOWN BELOW"`;
    } else {
      searchResults.innerHTML = `${books.length} SEARCH RESULTS FOUND FOR <strong>"${searchField.value}"</strong> AND AMONG THEM ${booksContainer.childElementCount} ARE SHOWN BELOW"`;
    }
  }
};
