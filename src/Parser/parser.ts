import { Binary, Expr, Grouping, Literal, Unary } from "../Ast/Expr";
import { Error } from "../Error/error";
import Slang from "../main";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";
import { ParseError } from "./parseError";

export class Parser {
  
  private readonly tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    let expr: Expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  // comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;

  private comparison(): Expr {
    let expr: Expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator: Token = this.previous();
      const right: Expr = this.term();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  // term           → factor ( ( "-" | "+" ) factor )* ;

  private term(): Expr {
    let expr: Expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.factor();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  // factor         → unary ( ( "/" | "*" ) unary )* ;

  private factor(): Expr {
    let expr: Expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  //   unary          → ( "!" | "-" ) unary | primary ;

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      return new Unary(operator, right);
    }
    return this.primary();
  }

  //   primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;

  private primary() : Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }
    throw this.error(this.peek(), "Expect expression.");
  }

  /****** Helper Functions ******/

  // Match method to check if the current token is of the given type.
  // If it is, consume it and return true, otherwise return false

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  // Check if the current token is of the given type.
  // If it is, it return true, otherwise return false

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    return this.peek().type === type;
  }

  // Advance the current token

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  //Check if the current token is EOF

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  // Returns the token to be consumed
  private peek(): Token {
    return this.tokens[this.current];
  }

  // Gets the previous token
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  // Consume the next token if it matches the expected type.
  private consume(type : TokenType, message : string) : void {
    if (this.check(type)) {
      this.advance();
    } else {
      throw this.error(this.peek(), message);
    }
  }

  private error(token : Token, message : string) : ParseError {
    Error.error(token, message);
    return new ParseError();
  }
}