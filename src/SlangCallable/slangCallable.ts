import { Interpreter } from "../Interpreter/interpreter";
import { AnyValue } from "../Tokens/tokenType";

export default interface slangCallable {
  call(interpreter: Interpreter, args: AnyValue[]): AnyValue;
}
