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

/* The following main function prints the expression in AST like this (* (- 123) (group 45.67)) */

function main(): void {
  const expression: Expr = new Binary(
    new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(123)),
    new Token(TokenType.STAR, "*", null, 1),
    new Grouping(new Literal(45.67))
  );

  console.log(new AstPrinter().print(expression));
}

main();
