import { Interpreter } from "../Interpreter/interpreter";
import { slangCallable } from "../SlangHelper/slangCallable";
import { AnyValue } from "../Tokens/tokenType";
import { slangInstance } from "./slangInstance";

export class slangClass implements slangCallable{
  readonly name: string;
  
  constructor(name : string){
    this.name = name;
  }
  
  public toString() : string{
    return this.name;
  }
  
  public call(interpreter: Interpreter, args: AnyValue[]) {
    let instance: slangInstance = new slangInstance(this);
    return instance;
  }
  
  public arity(): number {
    return 0;
  }
}