import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";

export class Parser{
    private readonly tokens : Token[]; 
    private current  : number = 0;

    constructor(tokens : Token[]){ 
        this.tokens = tokens;
    }

}