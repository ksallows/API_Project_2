const baseURL = "https://pokeapi.co/api/v2/";

let currentPageOffset = 0;
let currentPageNum = 1;

const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const jumpButton = document.getElementById("jump");
const jumpInput = document.getElementById("jumpInput");
const loading = document.getElementById("loading");
const currentPage = document.getElementById("page");
const table = document.querySelector("table");

let updatePageNum = () => {
    currentPage.innerHTML = "";
    currentPageNum = currentPageOffset == 0 ? 1 : currentPageOffset / 20;
    console.log(currentPageNum);

    if (currentPageNum < 4) { // 1 - 3
        for (i = currentPageNum - 2; i <= currentPageNum + 2; i++) {
            if (i > 0) {
                i == currentPageNum ? createListItem(i, "active") : createListItem(i);
            }
        }
        createDots();
        createListItem(55);
    }
    else if (currentPageNum > 3 && currentPageNum < 53) { // 4 - 52
        createListItem(1);
        createDots();
        for (i = currentPageNum - 2; i <= currentPageNum + 2; i++) {
            if (i > 0) {
                i == currentPageNum ? createListItem(i, "active") : createListItem(i);
            }
        }
        createDots();
        createListItem(55);
    }
    else if (currentPageNum > 52) { // 53 - 55
        createListItem(1);
        createDots();
        for (i = currentPageNum - 2; i <= currentPageNum + 2; i++) {
            if (i < 56) {
                i == currentPageNum ? createListItem(i, "active") : createListItem(i);
            }
        }
    }

}

let createDots = () => {
    let listItem = document.createElement("li");
    let span = document.createElement("span");
    span.innerText = "...";
    listItem.classList.add("uk-disabled");
    listItem.appendChild(span);
    currentPage.appendChild(listItem);
}

let createListItem = (num, className) => {
    let listItem = document.createElement("li");
    let link = document.createElement("a");
    if (className == "active") {
        listItem.classList.add("uk-active");
        let span = document.createElement("span")
        span.innerText = num;
        listItem.appendChild(span);
    }
    else {
        link.href = "#";
        link.innerText = num;
        link.addEventListener("click", () => jumpTo(num));
        listItem.appendChild(link);
    }
    currentPage.appendChild(listItem);
}

let disablePrev = () => prevButton.classList.add("disabled");
let enablePrev = () => prevButton.classList.remove("disabled");

let getPokemonList = () => {
    table.style.display = "none";
    loading.style.display = "block";
    return fetch(`${baseURL}pokemon?limit=20&offset=${currentPageOffset}`, { mode: "cors" })
        .then(result => result.json())
        .then(result => displayPokemon(result))
        .catch(error => console.log(error))
}

let getPokemonType = (url) => fetch(url, { mode: "cors" })
    .then(result => result.json())
    .then(result => result.types.length == 1 ? [result.types[0].type.name] : [result.types[0].type.name, result.types[1].type.name])
    .catch(error => console.log(error))

let getPokemonSprite = (url) => fetch(url, { mode: "cors" })
    .then(result => result.json())
    .then(result => result.sprites.front_default)
    .catch(error => console.log(error))

let getPokemonValue = (url, value) => fetch(url, { mode: "cors" })
    .then(result => result.json())
    .then(result => result[value])
    .catch(error => console.log(error))

let displayPokemon = async (pokemonJSON) => {
    if (currentPageOffset < 20) {
        disablePrev();
    } else if (currentPageOffset > 0) {
        enablePrev();
    }
    while (table.childElementCount > 1) {
        table.removeChild(table.lastChild);
    }
    let pokemonList = pokemonJSON.results;
    for (i = 0; i < pokemonList.length; i++) {
        let endpointURL = pokemonList[i].url;
        let tableRow = document.createElement("tr");

        let tableCell_ID = document.createElement("td");
        tableCell_ID.textContent = await getPokemonValue(endpointURL, "id");

        let tableCell_Sprite = document.createElement("td");
        let sprite = document.createElement("img");
        sprite.src = await getPokemonSprite(endpointURL);

        let tableCell_Name = document.createElement("td");
        tableCell_Name.textContent = pokemonList[i].name;

        let tableCell_Type = document.createElement("td");
        let pokemonType = await getPokemonType(endpointURL);
        tableCell_Type.innerHTML = "<span class='" + pokemonType[0] + "-type'>" + pokemonType[0] + "</span>";
        if (pokemonType.length == 2) {
            tableCell_Type.innerHTML += "<span class='" + pokemonType[1] + "-type'>" + pokemonType[1] + "</span>"
        }

        table.appendChild(tableRow);
        tableRow.appendChild(tableCell_ID);
        tableRow.appendChild(tableCell_Sprite);
        tableCell_Sprite.appendChild(sprite);
        tableRow.appendChild(tableCell_Name);
        tableRow.appendChild(tableCell_Type);

    }
    updatePageNum();
    loading.style.display = "none";
    table.style.display = "table";
}

let next = () => {
    currentPageOffset += 20;
    getPokemonList();
}

let prev = () => {
    if (currentPageOffset >= 20) {
        currentPageOffset -= 20;
        getPokemonList();
    }
}

let jumpTo = (pageNum) => {
    if (pageNum !== "" && pageNum <= 55) {
        currentPageOffset = pageNum * 20;
        getPokemonList();
    }
}

nextButton.addEventListener("click", () => next());
prevButton.addEventListener("click", () => prev());
jumpButton.addEventListener("click", () => jumpTo(jumpInput.value));

window.addEventListener("DOMContentLoaded", () => getPokemonList())