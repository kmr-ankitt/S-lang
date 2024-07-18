import { Expr, ExprAssign, ExprBinary, ExprCall, ExprGetter, ExprGrouping, ExprLiteral, ExprLogical, ExprUnary, ExprVariable } from "../Ast/Expr";
import { Stmt, StmtBlock, StmtClass, StmtExpression, StmtFunc, StmtIf, StmtPrint, StmtReturn, StmtVar, StmtWhile } from "../Ast/Stmt";
import { Error } from "../Error/error";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";
import { ParseError } from "./parseError";

export class Parser {
  private readonly tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /*** Was done to check if the parser is working
  parse(): Expr {
    try {
      return this.expression();
    } catch (error) {
      return new Literal(null);
    }
  }
***/

  parse(): Stmt[] {
    let statements: Stmt[] = [];
    while (!this.isAtEnd()) statements.push(this.declaration());
    return statements;
  }

  private expression(): Expr {
    return this.assignment();
  }

  private statement(): Stmt {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.LEFT_BRACE)) return new StmtBlock(this.block());
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();

    return this.expressionStatement();
  }

  private declaration(): Stmt {
    try {
      if (this.match(TokenType.CLASS)) return this.classDeclaration();
      if (this.match(TokenType.FUN)) return this.function("function");
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
      
    } catch (error: any) {
      this.synchronize();
      return new StmtExpression(new ExprLiteral(null));
    }
  }

  private printStatement(): Stmt {
    const value: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new StmtPrint(value);
  }

  private expressionStatement(): Stmt {
    const expr: Expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new StmtExpression(expr);
  }

  private block(): Stmt[] {
    const statements: Stmt[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  private ifStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition: Expr = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.")

    const thenBranch: Stmt = this.statement();
    let elseBranch = null;
    if (this.match(TokenType.ELSE))
      elseBranch = this.statement();

    return new StmtIf(condition, thenBranch, elseBranch);
  }

  /** Since Lox is dynamically typed, we allow operands of any type and use truthiness to determine what each operand represents.
  We apply similar reasoning to the result. Instead of promising to literally return true or false, a logic operator merely
  guarantees it will return a value with appropriate truthiness. ***/

  private or(): Expr {
    let expr: Expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator: Token = this.previous();
      const right: Expr = this.and();
      expr = new ExprLogical(expr, operator, right);
    }

    return expr;
  }

  private and(): Expr {
    let expr: Expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator: Token = this.previous();
      const right: Expr = this.equality();
      expr = new ExprLogical(expr, operator, right);
    }

    return expr;
  }

  private whileStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition: Expr = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body: Stmt = this.statement();

    return new StmtWhile(condition, body);
  }

  private forStatement(): Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");

    let initializer: Stmt | null = null;
    if (this.match(TokenType.SEMICOLON)) {
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition: Expr | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

    let increment: Expr | null = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

    let body: Stmt = this.statement();

    if (increment !== null) {
      body = new StmtBlock([body, new StmtExpression(increment)]);
    }

    if (condition === null) {
      condition = new ExprLiteral(true);
    }
    body = new StmtWhile(condition, body);

    if (initializer !== null) {
      body = new StmtBlock([initializer, body]);
    }

    return body;
  }

  private returnStatement() : Stmt{
    const keyword: Token = this.previous();
    let value: Expr | null= null;
    if (!this.check(TokenType.SEMICOLON))
      value = this.expression();
    
    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new StmtReturn(keyword, value);
  }

  private varDeclaration(): Stmt {
    {
      const name: Token = this.consume(
        TokenType.IDENTIFIER,
        "Expect variable name."
      );

      let initializer: Expr = new ExprLiteral(null);
      if (this.match(TokenType.EQUAL)) initializer = this.expression();

      this.consume(
        TokenType.SEMICOLON,
        "Expect ';' after variable declaration."
      );
      return new StmtVar(name, initializer);
    }
  }
  
  private classDeclaration() : Stmt{
    const name: Token = this.consume(TokenType.IDENTIFIER, "Expect class name.");
    this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.")
    let methods: StmtFunc[] = [];
    while(!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()){
      methods.push(this.function("method"));
    }
    
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");
    
    return new StmtClass(name, methods);
  }

  private function(kind : string) : StmtFunc {
    const name: Token = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");
    let parameters: Token[] = [];
    if(!this.check(TokenType.RIGHT_PAREN)){
      do {
        if (parameters.length >= 255)
          this.error(this.peek(), "Can't have more than 255 parameters.");
        parameters.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
    
    this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);
    const body: Stmt[] = this.block();
    return new StmtFunc(name, parameters, body);
  }
  
  private assignment(): Expr {
    const expr: Expr = this.or();
    if (this.match(TokenType.EQUAL)) {
      const equals: Token = this.previous();
      const value: Expr = this.assignment();

      if (expr instanceof ExprVariable) {
        const name: Token = (expr as any).name;
        return new ExprAssign(name, value);
      }
      this.error(equals, "Invalid assignment target.");
    }
    return expr;
  }

  private equality(): Expr {
    let expr: Expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new ExprBinary(expr, operator, right);
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
      expr = new ExprBinary(expr, operator, right);
    }
    return expr;
  }

  // term           → factor ( ( "-" | "+" ) factor )* ;

  private term(): Expr {
    let expr: Expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.factor();
      expr = new ExprBinary(expr, operator, right);
    }
    return expr;
  }

  // factor         → unary ( ( "/" | "*" ) unary )* ;

  private factor(): Expr {
    let expr: Expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      expr = new ExprBinary(expr, operator, right);
    }
    return expr;
  }

  //   unary          → ( "!" | "-" ) unary | primary ;

  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      return new ExprUnary(operator, right);
    }
    return this.call();
  }

  //   primary        → NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" ;

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) return new ExprLiteral(false);
    if (this.match(TokenType.TRUE)) return new ExprLiteral(true);
    if (this.match(TokenType.NIL)) return new ExprLiteral(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new ExprLiteral(this.previous().literal);
    }
    if (this.match(TokenType.IDENTIFIER))
      return new ExprVariable(this.previous());
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr: Expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new ExprGrouping(expr);
    }
    throw this.error(this.peek(), "Expect expression.");
  }

  private call(): Expr {
    let expr: Expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN))
        expr = this.finishCall(expr);
      else if (this.match(TokenType.DOT)) {
        const name: Token = this.consume(TokenType.IDENTIFIER, "Expect property name after '.'.");
        expr = new ExprGetter(expr, name);
      }
      else
        break;
    }

    return expr;
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
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string): ParseError {
    Error.error(token, message);
    return new ParseError();
  }

  private finishCall(callee: Expr): Expr {
    let args: Expr[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255)
          this.error(this.peek(), "Can't have more than 255 arguments.");
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    
    const paren: Token = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");
    return new ExprCall(callee, paren, args);
  }

  // Synchronize the parser to the end of the file. It discards tokens until it thinks it has found a statement boundary.

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}
