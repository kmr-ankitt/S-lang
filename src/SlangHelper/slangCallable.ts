import { Interpreter } from "../Interpreter/interpreter";
import { AnyValue } from "../Tokens/tokenType";

export abstract class slangCallable {
  abstract arity() : number;
  abstract call(interpreter: Interpreter, args: AnyValue[]): AnyValue;
}

export class Clock extends slangCallable{
  public arity(): number{
    return 0;
  }
  
  public call(interpreter: Interpreter, args: AnyValue[]): AnyValue {
    let date = new Date().getTime() / 1000.0;
    return date;
  }
  
  public toString() : string{
    return "<native function>";
  }
}
