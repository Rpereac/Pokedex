import * as Utils from "./utils.js";
import * as Models from "./models.js";
import {BasePokemon, POKEMON_TYPES, PokemonType, PokemonTypeName} from "./models.js";

const cachePokemon = new Map<number, Models.DetailedPokemon>();

const btnLlistaPokemon = (document.getElementById("btn-show-all") as HTMLButtonElement)

btnLlistaPokemon.addEventListener("click", carregarLlistaPokemon);

btnLlistaPokemon.addEventListener("dblclick", buidarLlista);
let ul = document.getElementById("pokemon-list")
ul?.addEventListener("click", (e) => {
    Utils.marcarItemActiu(e.target as HTMLElement)
    const li = (e.target as HTMLElement).closest("li")
    const id = Number(li?.dataset.id)
    const url = String(li?.dataset.url)
    const pokemon = cachePokemon.get(id)
    if (pokemon) {
        Utils.renderitzaDetallCard(pokemon)
    } else {
        carregarDetallPokemon(id, url)
    }
    Utils.amagarEstat()
})
async function carregarLlistaPokemon(){
    try {
        Utils.netejarCercador();
        Utils.mostrarEstat("Carregant llista...", "loading");

        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        if (!resposta.ok) {
            throw new Error(`Error: ${resposta.status}`)
        }

        const pokemons: Models.BasePokemon[] = []
        const dades = (await resposta.json() as Models.IPokeApiListResponse)
        dades.results.map((p) => {
            const pokemon = new Models.BasePokemon(p)
            pokemons.push(pokemon)
        } )

        Utils.renderitzarLlistaNoms(pokemons);
        Utils.amagarEstat();
    }
    catch (error){
        const missatge = error instanceof Error ? error.message : "Error desconegut";
        Utils.mostrarEstat(missatge, "error");
    }
}

async function carregarDetallPokemon(id: number, url: string): Promise<void>{
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const pokemon = (await response.json() as Models.IPokeApiDetail)
        const pokemonDetailed = new Models.DetailedPokemon(pokemon, url)
        Utils.renderitzaDetallCard(pokemonDetailed)
        cachePokemon.set(id, pokemonDetailed)

    }catch (error){
        const missatge = error instanceof Error ? error.message : "Error desconegut";
        Utils.mostrarEstat(missatge, "error");
    }
}
function buidarLlista(){
    cachePokemon.clear();
}

const inputCerca= document.getElementById("search-input") as HTMLInputElement
inputCerca.addEventListener("input", filtrarLlista)

function filtrarLlista(): void{
    const text = inputCerca.value.trim().toLowerCase();
    const items = document.querySelectorAll<HTMLLIElement>("#pokemon-list li")

    items.forEach((li) => {
        const nom = li.dataset.name ?? ""
        const id = li.dataset.id ?? ""
        let coincideix: boolean;

        if (text === ""){
            coincideix = true;
        }
        else if (/^\d+$/.test(text)){
            coincideix = Number(id) === Number(text)
        }else{
            coincideix = nom.includes(text)
        }
        li.classList.toggle("hidden", !coincideix)
    })

}

Utils.generarBotonsTipus()
let btnfiltreContainer = document.querySelector("#type-filter-container") as HTMLDivElement
btnfiltreContainer.addEventListener("click", (e) => {
    let btn = (e.target) as HTMLButtonElement
    Utils.marcarItemActiu(btn)
    let tipus = btn.dataset.type
})
async function carregarPokemonPerTipus(tipus: string){
    try{
        const response = await fetch(`https://pokeapi.co/v2/type/${tipus}/?limit=151`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }
        const pokemons = []
        const pokemonTipus = await response.json() as Models.IPokeApiTypeResponse
        pokemonTipus.pokemon.map((p) => {
            const basePokemon = new BasePokemon((p.pokemon))
            pokemons.push(basePokemon)
        for (const [id, pokemon] of Object.entries(cachePokemon)) {
            let pokemonType = POKEMON_TYPES[tipus as PokemonTypeName] as PokemonType
            if (!pokemon.types.includes(pokemonType)) {
                delete cachePokemon[id]
            }
        }      
})
    }catch (error){
        const missatge = error instanceof Error ? error.message : "Error desconegut";
        Utils.mostrarEstat(missatge, "error");
    }
}
