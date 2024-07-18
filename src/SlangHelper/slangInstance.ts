import { RuntimeError } from "../Error/RuntimeError";
import { Token } from "../Tokens/token";
import { AnyValue } from "../Tokens/tokenType";
import { slangClass } from "./slangClass";
import { slangFunction } from "./slangFunction";

export class slangInstance{
  private klass: slangClass;
  private readonly fields : Map<string, AnyValue> = new Map<string, AnyValue>()
  
  constructor(klass : slangClass){
    this.klass = klass;
  }
  
  get(name : Token): AnyValue{
    if(this.fields.has(name.lexeme))
      return this.fields.get(name.lexeme)
    
    const method = this.klass.findMethod(name.lexeme);
    if(method != null)
      return method;
    
    throw new RuntimeError(name, `Undefined property '${name.lexeme}'.`);
  }
  
  set(name : Token , value : AnyValue) : void{
    this.fields.set(name.lexeme, value);
  }
  
  public toString() : string{
    return this.klass.name + " instance";
  }
  
}