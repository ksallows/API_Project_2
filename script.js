const baseURL = "https://pokeapi.co/api/v2/";
const table = document.querySelector("table");

let currentPageOffset = 0;

const nav = document.querySelector("nav");

const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const jumpButton = document.getElementById("jump");
const jumpInput = document.getElementById("jumpInput");
const currentPage = document.getElementById("pageNum")

let disablePrev = () => prevButton.setAttribute("disabled", "disabled");

let initialize = () => {
    disablePrev();
    getPokemonList();
    currentPage.textContent = 1;
}

let getPokemonList = () => fetch(`${baseURL}pokemon?limit=20&offset=${currentPageOffset}`, { mode: "cors" }).then(result => result.json()).then(result => displayPokemon(result));

let getPokemonType = (url) => fetch(url, { mode: "cors" }).then(result => result.json()).then(result => result.types.length == 1 ? [result.types[0].type.name] : [result.types[0].type.name, result.types[1].type.name]);

let getPokemonSprite = (url) => fetch(url, { mode: "cors" }).then(result => result.json()).then(result => result.sprites.front_default);

let getPokemonID = (url) => fetch(url, { mode: "cors" }).then(result => result.json()).then(result => result.id);

let displayPokemon = async (pokemonJSON) => {
    while (table.childElementCount > 1) {
        table.removeChild(table.lastChild);
    }
    let pokemonList = pokemonJSON.results;
    for (i = 0; i < pokemonList.length; i++) {
        let endpointURL = pokemonList[i].url;
        let tableRow = document.createElement("tr");

        let tableCell_ID = document.createElement("td");
        tableCell_ID.textContent = await getPokemonID(endpointURL);

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

        currentPageOffset !== 0 ? currentPage.textContent = currentPageOffset / 20 : ""
    }
}


// let prev = () => {
//     if (currentPageOffset <= 20) {
//         currentPageOffset += 20;
//         getPokemonList();
//     }
// }

// let jumpTo = (pageNum) => {

// }

nextButton.addEventListener("click", () => {
    currentPageOffset += 20;
    getPokemonList();
});
// prevButton.addEventListener("click", prev());
// jumpButton.addEventListener("click", jumpTo(jumpInput.value));

window.addEventListener("DOMContentLoaded", initialize())