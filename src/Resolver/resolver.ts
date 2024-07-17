import { ExprVisitor, Expr, ExprVariable, ExprAssign, ExprBinary, ExprCall, ExprGrouping, ExprLiteral, ExprLogical, ExprUnary } from "../Ast/Expr";
import { Stmt, StmtBlock, StmtExpression, StmtFunc, StmtIf, StmtPrint, StmtReturn, StmtVar, StmtVisitor, StmtWhile } from "../Ast/Stmt";
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

  /**  Expression Resolving  **/

  visitExprVariableExpr(expr: ExprVariable): void {
    if (!this.scopes.isEmpty() && this.scopes.peek().get(expr.name.lexeme) === false) {
      Error.error(expr.name, "Can't read local variable in its own initializer.");
    }
  }

  visitExprAssignExpr(expr: ExprAssign): void {
    this.resolve(expr.value);
    this.resolveLocal(expr, expr.name);
  }

  visitExprBinaryExpr(expr: ExprBinary): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitExprCallExpr(expr: ExprCall): void {
    this.resolve(expr.callee);

    expr.args.map((arg) => {
      this.resolve(arg);
    })
  }

  visitExprGroupingExpr(expr: ExprGrouping): void {
    this.resolve(expr.expression);
  }

  visitExprLiteralExpr(expr: ExprLiteral): void {}
  
  visitExprLogicalExpr(expr: ExprLogical): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }
  
  visitExprUnaryExpr(expr: ExprUnary): void {
    this.resolve(expr.right);
  }

  /**  Statement Resolving  **/

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


  visitStmtFuncStmt(stmt: StmtFunc): void {
    this.declare(stmt.name);
    this.define(stmt.name);

    this.resolveFunction(stmt);
  }

  visitStmtExpressionStmt(stmt: StmtExpression): void {
    this.resolve(stmt.expression);
  }

  visitStmtIfStmt(stmt: StmtIf): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.thenBranch);
    if (stmt.elseBranch != null)
      this.resolve(stmt.elseBranch);
  }

  visitStmtPrintStmt(stmt: StmtPrint): void {
    this.resolve(stmt.expression);
  }

  visitStmtReturnStmt(stmt: StmtReturn): void {
    if (stmt.value != null)
      this.resolve(stmt.value);
  }

  visitStmtWhileStmt(stmt: StmtWhile): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }

  // Helper Functions

  private beginScope(): void {
    this.scopes.push(new Map<string, Expr>);
  }

  private endScope(): void {
    this.scopes.pop();
  }

  private declare(name: Token): void {
    if (this.scopes.isEmpty())
      return;

    let scope: Map<string, boolean> = this.scopes.peek();
    scope.set(name.lexeme, false);
  }

  private define(name: Token): void {
    if (this.scopes.isEmpty())
      return;
    this.scopes.peek().set(name.lexeme, true);
  }

  private resolveLocal(expr: Expr, name: Token): void {
    for (let i = this.scopes.size() - 1; i >= 0; i--) {
      if (this.scopes.get(i).has(name.lexeme)) {
        this.interpreter.resolve(expr, this.scopes.size() - 1 - i);
        return;
      }
    }
  }

  private resolveFunction(func: StmtFunc) {
    this.beginScope();
    func.params.map((param) => {
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
