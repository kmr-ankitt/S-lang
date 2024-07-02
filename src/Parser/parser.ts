import { Binary, Expr } from "../Ast/Expr";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";

export class Parser{
    private readonly tokens : Token[]; 
    private current  : number = 0;

    constructor(tokens : Token[]){ 
        this.tokens = tokens;
    }

    private expression() : Expr{
        return this.equality();
    }

    private equality() : Expr{
        let expr : Expr = comparison();

        while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)){
            const operator : Token = this.previous();
            const right : Expr = this.comparison();
            expr = new Binary(expr, operator, right);
        }
        return expr;
    }

    /* Helper Functions */
    
    // Match method to check if the current token is of the given type.
    // If it is, consume it and return true, otherwise return false
 
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
        if (this.check(type)) {
            this.advance();
            return true;
        }
        }
        return false;
    }
  

    // Check if the current token is of the given type.
    // If it is, it return true, otherwise return false

    private check(type : TokenType) : boolean{
        if(this.isAtEnd()){
            return false;
        }
        return this.peek().type === type;
    }

    // Advance the current token

    private advance(): Token{
        if(!this.isAtEnd()){
            this.current++;
        }
        return this.previous();
    }

    //Check if the current token is EOF

    private isAtEnd() : boolean{
        return this.peek().type === TokenType.EOF;
    }

    // Returns the token to be consumed
    private peek() : Token{
        return this.tokens[this.current];
    }

    // Gets the previous token
    private previous() : Token{
        return this.tokens[this.current - 1];
    }

}



