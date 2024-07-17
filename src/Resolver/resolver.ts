import { ExprVisitor, Expr } from "../Ast/Expr";
import { Stmt, StmtBlock, StmtVisitor } from "../Ast/Stmt";
import { Interpreter } from "../Interpreter/interpreter";
import { Stack } from "./stack";

export class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
  private readonly interpreter: Interpreter;
  private readonly scopes: Stack<Map<string, Expr>> = new Stack<Map<string, Expr>>();

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
  }

  visitStmtBlockStmt(stmt: StmtBlock): void {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  // Helper Functions
  
  private beginScope(): void{
    this.scopes.push(new Map<string, Expr>);
  }
  
  private endScope(): void{
    this.scopes.pop();
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
