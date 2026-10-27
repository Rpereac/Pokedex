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

        const dades = (await resposta.json() as Models.IPokeApiListResponse)
        Utils.amagarEstat();
    }
    catch (error){
        const missatge = error instanceof Error ? error.message : "Error desconegut";
        Utils.mostrarEstat(missatge, "error");
    }
}

function buidarLlista(){
    mapaPokemon.clear();
}

