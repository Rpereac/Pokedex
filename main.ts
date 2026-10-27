import * as Utils from "./utils.js";
import * as Models from "./models.js";

const mapaPokemon = new Map<number, Models.BasePokemon>();

const btnLlistaPokemon = (document.getElementById("btn-show-all") as HTMLButtonElement)

btnLlistaPokemon.addEventListener("click", carregarLlistaPokemon);

btnLlistaPokemon.addEventListener("dblclick", buidarLlista);

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
            mapaPokemon.set(pokemon.id, pokemon)
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

function buidarLlista(){
    mapaPokemon.clear();
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
            coincideix = false;
        }
        else if (/^\d+$/.test(text)){
            coincideix = Number(id) === Number(text)
        }else{
            coincideix = nom.includes(text)
        }
        li.classList.toggle("hidden", !coincideix)
    })

}

