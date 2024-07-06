import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "../Ast/Expr";
import { Error } from "../Error/error";
import { Token } from "../Tokens/token";
import { AnyValue, TokenType } from "../Tokens/tokenType";

export class Interpreter implements Visitor<AnyValue> {

  public visitLiteralExpr(expr: Literal): AnyValue {
    return expr.value;
  }

  public visitGroupingExpr(expr: Grouping): AnyValue {
    return this.evaluate(expr.expression);
  }

  public visitUnaryExpr(expr: Unary) :AnyValue {
    const right : AnyValue = this.evaluate(expr.right);

    switch(expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right)
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  }

  public visitBinaryExpr(expr: Binary): AnyValue {
      const left : AnyValue = this.evaluate(expr.left);
      const right : AnyValue = this.evaluate(expr.right);

      switch(expr.operator.type){

        case TokenType.PLUS:
          if(typeof left === "number" && typeof right === "number"){
            return left + right;
          }
          
          // String concatenation
          if(typeof left === "string" && typeof right === "string"){
            return left + right;
          }
          break;

        case TokenType.MINUS:
          this.checkNumberOperands(expr.operator, left, right); 
          return left - right;

        case TokenType.SLASH:
          this.checkNumberOperands(expr.operator, left, right);
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

        case TokenType.BANG_EQUAL : 
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

  private isTruthy(object : AnyValue): boolean {
    if(object == null)
      return false;
    if(typeof object === "boolean")
      return object;
    return true;
  }

  private isEqual(a: AnyValue, b: AnyValue): boolean {
    if(a == null && b == null)
      return true;
    if(a == null)
      return false;

    return a.equals(b);
  }

  checkNumberOperand(operator: Token, value: AnyValue) {
    if (typeof value === "number") {  
      return;
    }
    throw Error.error(operator.line, "Operands must be a number");

  }

  checkNumberOperands(operator: Token, left: AnyValue, right: AnyValue) {
    if (typeof left === "number" && typeof right === "number") {
      return;
    }
    throw Error.error(operator.line, "Operands must be numbers");
  }
}
