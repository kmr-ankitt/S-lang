import { Visitor, Binary, Expr, Grouping, Literal, Unary } from "../Ast/Expr";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";

export class AstPrinter implements Visitor<string> {
  print(expr: Expr) {
    return expr.accept(this);
  }

  public visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  public visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize("group", expr.expression);
  }

  public visitLiteralExpr(expr: Literal): string {
    if (expr.value == null) return "nil";
    return expr.value.toString();
  }

  public visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    return `(${name} ${exprs.map((expr) => `${expr.accept(this)}`).join(" ")})`;
  }
}
