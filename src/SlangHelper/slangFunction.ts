import { StmtFunc } from "../Ast/Stmt";
import { Environment } from "../Environment/environment";
import { returnError } from "../Error/returnError";
import { Interpreter } from "../Interpreter/interpreter";
import { AnyValue } from "../Tokens/tokenType";
import { slangCallable } from "./slangCallable";

export class slangFunction extends slangCallable {
  private readonly declaration: StmtFunc;
  private readonly closure: Environment;
  
  constructor(declaration: StmtFunc, closure : Environment) {
    super();
    this.declaration = declaration;
    this.closure = closure;
  }

  public arity(): number {
    return this.declaration.params.length;
  }

  public toString(): string {
    return "<fn " + this.declaration.name.lexeme + ">";
  }

  public call(interpreter: Interpreter, args: AnyValue[]): AnyValue {
    let environment: Environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue: any) {
      return returnValue.value;
    }
    return null;
  }
}
