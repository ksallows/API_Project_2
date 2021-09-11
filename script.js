const baseURL = "https://pokeapi.co/api/v2/";
const table = document.querySelector("table");

let currentPageOffset = 0;

const nav = document.querySelector("nav");
let hideNav = () => nav.style.display = "none";
let showNav = () => nav.style.display = "block";

let initialize = () => {
    hideNav();
    getPokemonList();
}

let getPokemonList = () => fetch(`${baseURL}pokemon?limit=20&offset=` + currentPageOffset, { mode: "cors" }).then(result => result.json()).then(result => displayPokemon(result));

let getPokemonType = (url) => fetch(url, { mode: "cors" }).then(result => result.json()).then(result => result.types.length == 1 ? [result.types[0].type.name] : [result.types[0].type.name, result.types[1].type.name]);

let getPokemonSprite = (url) => fetch(url, { mode: "cors" }).then(result => result.json()).then(result => result.sprites.front_default);

let displayPokemon = async (pokemonJSON) => {
    //console.log(pokemonJSON.results);
    let pokemonList = pokemonJSON.results;
    for (i = 0; i < pokemonList.length; i++) {
        let endpointURL = pokemonList[i].url;
        let tableRow = document.createElement("tr");

        let tableCell_Sprite = document.createElement("td");
        let sprite = document.createElement("img");
        sprite.src = await getPokemonSprite(endpointURL);

        let tableCell_Name = document.createElement("td");
        tableCell_Name.textContent = pokemonList[i].name;

        let tableCell_Type = document.createElement("td");
        let pokemonType = await getPokemonType(endpointURL);
        console.log(pokemonType);
        tableCell_Type.textContent = pokemonType[0];
        pokemonType.length == 1 ? "" : tableCell_Type.textContent += " " + pokemonType[1];


        table.appendChild(tableRow);
        tableRow.appendChild(tableCell_Sprite);
        tableCell_Sprite.appendChild(sprite);
        tableRow.appendChild(tableCell_Name);
        tableRow.appendChild(tableCell_Type);
    }
}

window.addEventListener("DOMContentLoaded", initialize())