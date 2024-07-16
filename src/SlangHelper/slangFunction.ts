import { StmtFunc } from "../Ast/Stmt";
import { Environment } from "../Environment/environment";
import { Interpreter } from "../Interpreter/interpreter";
import { AnyValue } from "../Tokens/tokenType";
import { slangCallable } from "./slangCallable";

export class slangFunction extends slangCallable {
  private declaration: StmtFunc;
  constructor(declaration: StmtFunc) {
    super();
    this.declaration = declaration;
  }
  
  public arity(): number {
    return this.declaration.params.length;
  }
  
  public toString() : string{
    return "<fn " + this.declaration.name.lexeme + ">"; 
  }
  
  public call(interpreter : Interpreter, args : AnyValue[]){
    let environment: Environment = new Environment(interpreter.globals);
    for (var i = 0; i < this.declaration.params.length; i++){
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }
    
    interpreter.executeBlock(this.declaration.body, environment);
    return null;
  }
}
