const baseURL = "https://pokeapi.co/api/v2/";
const table = document.querySelector("table");

let currentPageOffset = 0;

const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const jumpButton = document.getElementById("jump");
const jumpInput = document.getElementById("jumpInput");
const currentPage = document.getElementById("pageNum")

let disablePrev = () => prevButton.setAttribute("disabled", "disabled");

let initialize = () => {
    //disablePrev();
    getPokemonList();

}

let updatePageNum = () => currentPage.textContent = (currentPageOffset / 20) + 1;

let getPokemonList = () => fetch(`${baseURL}pokemon?limit=20&offset=${currentPageOffset}`, { mode: "cors" })
    .then(result => result.json())
    .then(result => displayPokemon(result))
    .catch(error => console.log(error))

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
    while (table.childElementCount > 1) {
        table.removeChild(table.lastChild);
    }
    let pokemonList = pokemonJSON.results;
    for (i = 0; i <= pokemonList.length - 1; i++) {
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
        tableCell_Type.textContent = pokemonType[0];
        pokemonType.length == 1 ? "" : tableCell_Type.textContent += " " + pokemonType[1];

        table.appendChild(tableRow);
        tableRow.appendChild(tableCell_ID);
        tableRow.appendChild(tableCell_Sprite);
        tableCell_Sprite.appendChild(sprite);
        tableRow.appendChild(tableCell_Name);
        tableRow.appendChild(tableCell_Type);

        updatePageNum();
    }
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
    if (pageNum !== "") {
        currentPageOffset = pageNum * 20;
        getPokemonList();
    }
}

nextButton.addEventListener("click", () => next());
prevButton.addEventListener("click", () => prev());
jumpButton.addEventListener("click", () => jumpTo(jumpInput.value));

window.addEventListener("DOMContentLoaded", () => initialize())