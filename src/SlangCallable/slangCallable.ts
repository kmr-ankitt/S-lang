import { Interpreter } from "../Interpreter/interpreter";
import { AnyValue } from "../Tokens/tokenType";

export abstract class slangCallable {
  abstract arity() : number;
  abstract call(interpreter: Interpreter, args: AnyValue[]): AnyValue;
}
