class BasePokemon {
    private readonly _id: number
    private readonly _nom: string
    private  readonly _url: string

    constructor(id: number, nom: string, url: string) {
        this._id = id
        this._nom = nom
        this._url = url
    }

    get nom(){
        return this._nom
    }

    get url() {
        return this._url
    }

    get id(){
        return this._id
    }

}