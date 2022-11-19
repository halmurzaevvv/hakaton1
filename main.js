// ? АПИ Для запросов
let API_TWEETS = "http://localhost:8080/tweets";

//! CRUD

let tweetInp = document.querySelector(".whats_happening");
let tweetBtn = document.querySelector(".title__tweet");

//? подалка

let editTweet = document.querySelector(".edit-tweet");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

//! PAGINATION

let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination__list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

//! SEARCH

let searchInp = document.querySelector(".searchTerm");
let searchVal = "";




//? Блок куда добавляются карточки из функции render
let list = document.querySelector(".tweets__list");

// ! ADD - Обработчик событий на добавление
tweetBtn.addEventListener("click", async function (e) {
    let obj = {
        tweetInp: tweetInp.value,
    };

    console.log(obj);

    if (
        !obj.tweetInp.trim()
    ) {
        alert("Заполните поле");
        return;
    };

    //! Запрос на добавление

    await fetch(API_TWEETS, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-type": "application/json",
        },
    });

    tweetInp.value = "";

    render();
});

//! Отображение из json-server

async function render() {

    let products = await fetch(
        `${API_TWEETS}?q=${searchVal}&_page=${currentPage}&_limit=3`
    )
        .then((res) => res.json())
        .catch((err) => console.log(err));
    drawPaginationButtons();
    list.innerHTML = "";
    products.forEach((element) => {
        // console.log(element);
        let newElem = document.createElement("div");
        newElem.id = element.id;
        newElem.innerHTML = `
        <div class="tweets__container">
        <div class="tweets__list_left">
            <img class="profile_img" src="./img/user2.png" alt="" />
        </div>
        <div class="tweets__list_right">
            <strong class="username__list">Halmurzaev</strong>
            <strong class="descr__list">${element.tweetInp}</strong>
            <div class="btn__list">
                <div class="btn__like">
                    <img class="btns" src="./img/heart.png" alt="" />
                </div>
               
                
                <div href="#" class="btn__trash" >
                    <img id=${element.id} class=" btn__delete btns" src="./img/trash.png" alt="" />
                </div>
                <div data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn__edit" >
                    <img  id=${element.id} class=" btn__edit btns" src="./img/edit1.png" alt="" />
                </div>
            </div>
        </div>`;
        list.prepend(newElem);
    });

}
render();

//! Удаление продукта

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn__delete")) {
        let id = e.target.id;
        fetch(`${API_TWEETS}/${id}`, {
            method: "DELETE",
        }).then(() => render());
    }
});

//! Редактирование твита
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn__edit")) {
        let id = e.target.id;
        fetch(`${API_TWEETS}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                editTweet.value = data.tweetInp;
                editSaveBtn.setAttribute("id", data.id);
            });
    }
});

editSaveBtn.addEventListener("click", function () {
    let id = this.id;
    let tweetInp = editTweet.value;

    if (!tweetInp) {
        return;
    }
    let editProducts = {
        tweetInp: tweetInp,
    };
    saveEdit(editProducts, id);
});

//! Функция запроса для сохранения
function saveEdit(editedProduct, id) {
    fetch(`${API_TWEETS}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(editedProduct),
    }).then(() => {
        render();
    });
    let modal = bootstrap.Modal.getInstance(exampleModal);
    modal.hide();
}


// todo PAGINATION
function drawPaginationButtons() {
    fetch(`${API_TWEETS}?q=${searchVal}`)
        .then((res) => res.json())
        .then((data) => {
            pageTotalCount = Math.ceil(data.length / 3);
            // paginationList.innerHTML = "";

        });
}

prev.addEventListener("click", () => {
    if (currentPage <= 1) {
        return;
    }
    currentPage--;
    render();
});

next.addEventListener("click", () => {
    if (currentPage >= pageTotalCount) {
        return;
    }
    currentPage++;
    render();
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("page_number")) {
        currentPage = e.target.innerText;
        render();
    }
});

//todo SEARCH

searchInp.addEventListener("input", () => {
    searchVal = searchInp.value;
    currentPage = 1;
    render();
});


//! tweet modal

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("navbar__tweet")) {
        let id = e.target.id;
        fetch(`${API_TWEETS}/${id}`)
            .then((res) => res.json())
            .then((data) => {
                editTweet2.value = data.tweetInp;
                editSaveBtnTweet.setAttribute("id", data.id);
            });
    }
});

editSaveBtnTweet.addEventListener("click", function () {
    let id = this.id;
    let tweetInp = editTweet2.value;

    if (!tweetInp) {
        return;
    }
    let editProducts = {
        tweetInp: tweetInp,
    };
    saveEdit(editProducts, id);
});

//! Функция запроса для сохранения
function saveEdit(editedProduct, id) {
    fetch(`${API_TWEETS}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(editedProduct),
    }).then(() => {
        render();
    });
    let modal = bootstrap.Modal.getInstance(exampleModal);
    modal.hide();
}
