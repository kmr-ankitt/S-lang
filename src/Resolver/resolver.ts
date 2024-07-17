import { ExprVisitor, Expr, ExprVariable, ExprAssign } from "../Ast/Expr";
import { Stmt, StmtBlock, StmtFunc, StmtVar, StmtVisitor } from "../Ast/Stmt";
import { Error } from "../Error/error";
import { Interpreter } from "../Interpreter/interpreter";
import { Token } from "../Tokens/token";
import { Stack } from "./stack";

export class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
  private readonly interpreter: Interpreter;
  private readonly scopes: Stack<Map<string, boolean>> = new Stack<Map<string, boolean>>();

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
  }

  visitStmtBlockStmt(stmt: StmtBlock): void {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  visitStmtVarStmt(stmt: StmtVar): void {
    this.declare(stmt.name);
    if (stmt.initializer != null)
      this.resolve(stmt.initializer);
    this.define(stmt.name);
  }
  
  visitExprVariableExpr(expr: ExprVariable): void {
    if(!this.scopes.isEmpty() && this.scopes.peek().get(expr.name.lexeme) === false ){
      Error.error(expr.name, "Can't read local variable in its own initializer.");
    }
  }
  
  visitExprAssignExpr(expr: ExprAssign): void {
    this.resolve(expr.value);
    this.resolveLocal(expr, expr.name);
  }
  
  visitStmtFuncStmt(stmt: StmtFunc): void {
    this.declare(stmt.name);
    this.define(stmt.name);
    
    this.resolveFunction(stmt);
  }
  
  // Helper Functions
  
  private beginScope(): void{
    this.scopes.push(new Map<string, Expr>);
  }
  
  private endScope(): void{
    this.scopes.pop();
  }
  
  private declare(name : Token) : void{
    if (this.scopes.isEmpty())
      return;
    
    let scope: Map<string, boolean> = this.scopes.peek();
    scope.set(name.lexeme, false);
  }
  
  private define(name: Token): void{
    if (this.scopes.isEmpty())
      return;
    this.scopes.peek().set(name.lexeme, true);
  }

  private resolveLocal(expr : Expr, name : Token) : void{
    for (let i = this.scopes.size() - 1; i >= 0; i--){
      if(this.scopes.get(i).has(name.lexeme)){
        this.interpreter.resolve(expr, this.scopes.size() - 1 - i);
        return;
      }
    }
  } 
  
  private resolveFunction(func : StmtFunc){
    this.beginScope();
    func.params.map((param)=>{
      this.declare(param);
      this.define(param);
    })
    this.resolve(func.body);
    this.endScope();
  }
  
  resolve(statements: Stmt[]): void;
  resolve(stmt: Stmt): void;
  resolve(expr: Expr): void;

  // Implementation of the overloaded methods
  resolve(param: Stmt[] | Stmt | Expr): void {
    if (Array.isArray(param)) {
      // If it's an array of statements, resolve each statement
      param.forEach(statement => this.resolve(statement));
    } else if (this.isStmt(param)) {
      // If it's a single statement, call the resolve for Stmt
      this.resolveStmt(param);
    } else if (this.isExpr(param)) {
      // If it's a single expression, call the resolve for Expr
      this.resolveExpr(param);
    }
  }

  private resolveStmt(stmt: Stmt): void {
    stmt.accept(this);
  }
  
  private resolveExpr(expr: Expr): void {
    expr.accept(this);
  }

  private isStmt(param: any): param is Stmt {
    return typeof param.accept === 'function' && 'someStmtSpecificProperty' in param;
  }

  private isExpr(param: any): param is Expr {
    return typeof param.accept === 'function' && 'someExprSpecificProperty' in param;
  }

}
