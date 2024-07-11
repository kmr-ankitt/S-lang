import { Binary, Expr, Grouping, Literal, Unary, ExprVisitor, Variable } from "../Ast/Expr";
import { Expression, Print, Stmt, StmtVisitor, Var } from "../Ast/Stmt";
import { Environment } from "../Environment/environment";
import { Error } from "../Error/error";
import { RuntimeError } from "../Error/RuntimeError";
import { Token } from "../Tokens/token";
import { AnyValue, TokenType } from "../Tokens/tokenType";

export class Interpreter implements ExprVisitor<AnyValue>, StmtVisitor<void> {

  private environment : Environment = new Environment();

  interpret(statements : Stmt[]) : void {
    try {
      for(const statement of statements) {
        this.execute(statement); 
      }
    } catch (error : any) {
      Error.runtimeError(error);
    }
  }

  public visitExpressionStmt(stmt: Expression): void {
      this.evaluate(stmt.expression);
  }

  public visitPrintStmt(stmt: Print): void {
    const value : AnyValue = this.evaluate(stmt.expression);
    console.log(this.stringify(value))
  }

  public visitVarStmt(stmt: Var): void {
    let value : AnyValue = null;
    if(stmt.initializer != null)
      value = this.evaluate(stmt.initializer);

    this.environment.define(stmt.name.lexeme, value);
  }

  /*  Expression  Resolvers  */

  public visitLiteralExpr(expr: Literal): AnyValue {
    return expr.value;
  }

  public visitGroupingExpr(expr: Grouping): AnyValue {
    return this.evaluate(expr.expression);
  }

  public visitUnaryExpr(expr: Unary): AnyValue {
    const right: AnyValue = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  }

  public visitVariableExpr(expr: Variable): AnyValue {
      return this.environment.get(expr.name);
  }

  public visitBinaryExpr(expr: Binary): AnyValue {
    const left: AnyValue = this.evaluate(expr.left);
    const right: AnyValue = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }

        // String concatenation
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings."
        );

      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return left - right;

      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        if(right == 0)
          throw new RuntimeError(expr.operator, "Cannot divide by zero.");
        return left / right;

      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return left * right;

      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return left > right;

      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left >= right;

      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return left < right;

      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left <= right;

      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);

      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }
    return null;
  }

  /*** Helper functions ***/

  private evaluate(expr: Expr): AnyValue {
    return expr.accept(this);
  }

  private isTruthy(object: AnyValue): boolean {
    if (object == null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  private isEqual(a: AnyValue, b: AnyValue): boolean {
    if (a == null && b == null) return true;
    if (a == null) return false;

    return a.equals(b);
  }

  private stringify(object: AnyValue): string {
    if (object == null) return "nill";

    if (typeof object === "number") {
      const text: string = object.toString();
      if (text.endsWith(".0")) {
        return text.substring(0, text.length - 2);
      }
      return text;
    }
    return object.toString();
  }

  private execute(stmt : Stmt): void{
    stmt.accept(this);
  }

  private checkNumberOperand(operator: Token, operand: AnyValue): void {
    if (typeof operand === "number") {
      return;
    }
    throw new RuntimeError(operator, "Operands must be a number.");
  }

  private checkNumberOperands(
    operator: Token,
    left: AnyValue,
    right: AnyValue
  ): void {
    if (typeof left === "number" && typeof right === "number") {
      return;
    }
    throw new RuntimeError(operator, "Operands must be numbers.");
  }
}
