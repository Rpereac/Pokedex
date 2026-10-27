//EXERCICI 1

import * as Utils from "./utils.js";
import * as Models from "./models";

const mapaPokemon = new Map<number, Models.BasePokemon>();

const btnLlistaPokemon = (document.getElementById("btn-show-all") as HTMLButtonElement)

btnLlistaPokemon.addEventListener("click", carregarLlistaPokemon);

btnLlistaPokemon.addEventListener("dblclick", buidarLlista);

async function carregarLlistaPokemon(){
    try {
        Utils.mostrarEstat("Carregant llista...", "loading");

        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        if (!resposta.ok) throw new Error(`Error: ${resposta.status}`)

        const pokemons: Models.BasePokemon[] = []
        const dades = (await resposta.json() as Models.IPokeApiListResponse)
        dades.results.map((p) => {
            const pokemon = new Models.BasePokemon(p)
            mapaPokemon.set(pokemon.id, pokemon)
            pokemons.push(pokemon)
        } )

        Utils.renderiztarLlistaNoms(pokemons);
    }
    catch (error){

    }
}

function buidarLlista(){
    mapaPokemon.clear();
}

