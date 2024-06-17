import {AnyValue, TokenType} from "./tokenType";

export class Token{
    constructor(
        readonly type : TokenType,
        readonly lexeme : string,
        readonly literal : AnyValue ,
        readonly line : number
    ){}
    
    public toString() : string{
        return this.type + " " + this.lexeme + " " + this.literal;
    }
}