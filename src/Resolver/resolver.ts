import { ExprVisitor, Expr, ExprVariable, ExprAssign, ExprBinary, ExprCall, ExprGrouping, ExprLiteral, ExprLogical, ExprUnary, ExprGetter } from "../Ast/Expr";
import { Stmt, StmtBlock, StmtClass, StmtExpression, StmtFunc, StmtIf, StmtPrint, StmtReturn, StmtVar, StmtVisitor, StmtWhile } from "../Ast/Stmt";
import { Error } from "../Error/error";
import { Interpreter } from "../Interpreter/interpreter";
import { Token } from "../Tokens/token";
import { Stack } from "./stack";

enum FunctionType {
  NONE,
  FUNCTION
}

export class Resolver implements ExprVisitor<void>, StmtVisitor<void> {
  private readonly interpreter: Interpreter;
  private readonly scopes: Stack<Map<string, boolean>> = new Stack<Map<string, boolean>>();
  private currentFunction: FunctionType = FunctionType.NONE;

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
  }

  /**  Expression Resolving  **/

  visitExprVariableExpr(expr: ExprVariable): void {
    if (!this.scopes.isEmpty() && (this.scopes.peek().get(expr.name.lexeme))=== false ) {
      Error.error(expr.name, "Can't read local variable in its own initializer.");
    }
    
    this.resolveLocal(expr, expr.name)
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

    expr.args.forEach((arg) => {
      this.resolve(arg);
    })
  }

  visitExprGetterExpr(expr: ExprGetter): void {
    this.resolve(expr.obj);
  }
  
  visitExprGroupingExpr(expr: ExprGrouping): void {
    this.resolve(expr.expression);
  }

  visitExprLiteralExpr(expr: ExprLiteral): void { }

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

    this.resolveFunction(stmt, FunctionType.FUNCTION);
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
    if (this.currentFunction === FunctionType.NONE) {
      Error.error(stmt.keyword, "Can't return from top-level code");
    }
    if (stmt.value != null)
      this.resolve(stmt.value);
  }

  visitStmtWhileStmt(stmt: StmtWhile): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }

  visitStmtClassStmt(stmt: StmtClass): void {
    this.declare(stmt.name);
    this.define(stmt.name);
  }
  
  // Helper Functions

  private beginScope(): void {
    this.scopes.push(new Map<string, boolean>);
  }

  private endScope(): void {
    this.scopes.pop();
  }

  private declare(name: Token): void {
    if (this.scopes.isEmpty())
      return;

    let scope: Map<string, boolean> = this.scopes.peek();
    if (scope.has(name.lexeme))
      Error.error(name, "Already a variable with this name in this scope.");
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

  private resolveFunction(func: StmtFunc, type: FunctionType) {
    let enclosingFunction = this.currentFunction;
    this.currentFunction = type;

    this.beginScope();
    func.params.forEach((param) => {
      this.declare(param);
      this.define(param);
    })
    this.resolve(func.body);
    this.endScope();
    this.currentFunction = enclosingFunction;
  }

  // Implementation of the overloaded methods

  resolve(statements: Stmt[]): void
  resolve(stmt: Stmt | Expr): void
  resolve(target: Stmt[] | Stmt | Expr): void {
    if (target instanceof Array) target.forEach((stmt) => this.resolve(stmt))
    else target.accept(this)
  }
}
