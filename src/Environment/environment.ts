import { RuntimeError } from "../Error/RuntimeError";
import { Token } from "../Tokens/token";
import { AnyValue } from "../Tokens/tokenType";

export class Environment {
    private readonly values = new Map<string, AnyValue>();

    get(name : Token) : AnyValue{
        if(this.values.has(name.lexeme)){
            return this.values.get(name.lexeme)!;
        }

        throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
    }

    define(name : string, value : AnyValue) : void{
        this.values.set(name, value);
    }
}