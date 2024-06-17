import {TokenType} from "./tokenType";

class Token{
    constructor(
        readonly type : TokenType,
        readonly lexeme : string,
        readonly literal : {} ,
        readonly line : number
    ){}
    
    public toString() : string{
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}