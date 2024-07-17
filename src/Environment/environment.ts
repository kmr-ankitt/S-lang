import { RuntimeError } from "../Error/RuntimeError";
import { Token } from "../Tokens/token";
import { AnyValue } from "../Tokens/tokenType";

export class Environment {
  private readonly values = new Map<string, AnyValue>();
  enclosing?: Environment;

  constructor(enclosing?: Environment) {
    this.enclosing = enclosing;
  }

  get(name: Token): AnyValue {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme)!;
    }

    if (this.enclosing != null)
      return this.enclosing.get(name);

    throw new RuntimeError(name, `Undefined variable ${name.lexeme}.`);
  }

  getAt(distance: number, name: string): AnyValue {
    return this.ancestor(distance).values.get(name);
  }
  
  ancestor(distance : number): Environment {
    let environment: Environment = this;
    for (let i = 0; i < distance; i++){
        environment = environment.enclosing!;
    }
    return environment;
  }

  define(name: string, value: AnyValue): void {
    this.values.set(name, value);
  }

  assign(name: Token, value: AnyValue): void {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }
    if (this.enclosing != null) {
      this.enclosing.assign(name, value);
      return;
    }

    throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.");
  }
  
  assignAt(distance : number , name : Token , value : AnyValue) : void{
    this.ancestor(distance).values.set(name.lexeme, value);
  }
}
