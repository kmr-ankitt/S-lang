import { Environment } from "../Environment/environment";
import { Error } from "../Error/error";
import { RuntimeError } from "../Error/RuntimeError";
import { Token } from "../Tokens/token";
import { AnyValue, TokenType } from "../Tokens/tokenType";
import { Expr, ExprAssign, ExprBinary, ExprCall, ExprGetter, ExprGrouping, ExprLiteral, ExprLogical, ExprSetter, ExprUnary, ExprVariable, ExprVisitor } from "../Ast/Expr";
import { Stmt, StmtBlock, StmtClass, StmtExpression, StmtFunc, StmtIf, StmtPrint, StmtReturn, StmtVar, StmtVisitor, StmtWhile } from "../Ast/Stmt";
import { Clock, slangCallable } from "../SlangHelper/slangCallable";
import { slangFunction } from "../SlangHelper/slangFunction";
import { returnError } from "../Error/returnError";
import { slangClass } from "../SlangHelper/slangClass";
import { slangInstance } from "../SlangHelper/slangInstance";

export class Interpreter implements ExprVisitor<AnyValue>, StmtVisitor<void> {

  readonly globals: Environment = new Environment();
  private environment: Environment = this.globals;
  private readonly locals: Map<Expr, number> = new Map < Expr, number>();

  constructor() {
    this.globals.define("clock", new Clock);
  }

  interpret(statements: Stmt[]): void {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error: any) {
      Error.runtimeError(error);
    }
  }

  visitStmtExpressionStmt(stmt: StmtExpression): void {
    this.evaluate(stmt.expression);
  }
  public visitStmtPrintStmt(stmt: StmtPrint): void {
    const value: AnyValue = this.evaluate(stmt.expression);
    console.log(this.stringify(value))
  }

  public visitStmtVarStmt(stmt: StmtVar): void {
    let value: AnyValue = null;
    if (stmt.initializer != null)
      value = this.evaluate(stmt.initializer);

    this.environment.define(stmt.name.lexeme, value);
  }

  public visitStmtBlockStmt(stmt: StmtBlock): void {
    this.executeBlock(stmt.statements, new Environment(this.environment));
  }

  public visitStmtIfStmt(stmt: StmtIf): void {
    if (this.isTruthy(this.evaluate(stmt.condition)))
      this.execute(stmt.thenBranch);
    else if (stmt.elseBranch != null)
      this.execute(stmt.elseBranch);
  }

  public visitStmtWhileStmt(stmt: StmtWhile): void {
    while (this.isTruthy(this.evaluate(stmt.condition)))
      this.execute(stmt.body);
  }

  public visitStmtFuncStmt(stmt: StmtFunc): void {
    let func: slangFunction = new slangFunction(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, func);
  }
  
  public visitStmtReturnStmt(stmt: StmtReturn): void {
    let value: AnyValue = null;
    if (stmt.value != null)
      value = this.evaluate(stmt.value);
    
    throw new returnError(value);
  }

  visitStmtClassStmt(stmt: StmtClass): void {
    this.environment.define(stmt.name.lexeme, null);
    
    let methods: Map<string, slangFunction> = new Map<string, slangFunction>;
    
    stmt.methods.forEach((method : StmtFunc)=>{
      const func: slangFunction = new slangFunction(method, this.environment);
      methods.set(method.name.lexeme, func);
    })
    
    let klass: slangClass = new slangClass(stmt.name.lexeme, methods);
    this.environment.assign(stmt.name, klass);
  }
  
  /*  Expression  Resolvers  */

  public visitExprAssignExpr(expr: ExprAssign): AnyValue {
    const value: AnyValue = this.evaluate(expr.value);
    const distance = this.locals.get(expr);
    if (distance != null)
      this.environment.assignAt(distance, expr.name, value);
    else
      this.globals.assign(expr.name, value);
    return value;
  }

  public visitExprLiteralExpr(expr: ExprLiteral): AnyValue {
    return expr.value;
  }

  public visitExprGroupingExpr(expr: ExprGrouping): AnyValue {
    return this.evaluate(expr.expression);
  }

  public visitExprUnaryExpr(expr: ExprUnary): AnyValue {
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

  public visitExprVariableExpr(expr: ExprVariable): AnyValue {
    return this.lookUpVariable(expr.name, expr);
  }

  public visitExprLogicalExpr(expr: ExprLogical): AnyValue {
    const left: AnyValue = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(left))
        return left;
    }
    else {
      if (!this.isTruthy(left))
        return left;
    }

    return this.evaluate(expr.right);
  }

  public visitExprCallExpr(expr: ExprCall): AnyValue {
    let callee: AnyValue = this.evaluate(expr.callee);

    let args: AnyValue[] = [];
    
    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }
    
    if (!(callee instanceof slangCallable)) {
      throw new RuntimeError(expr.paren, "Can only call functions and classes.");
    }
    let func: slangCallable = callee as slangCallable;

    if (args.length != func.arity()) {
      throw new RuntimeError(expr.paren, `Expected ${func.arity()} arguments but got ${args.length}.`);
    }
    return func.call(this, args);
  }

  public visitExprGetterExpr(expr: ExprGetter): AnyValue {
    const obj: any = this.evaluate(expr.obj);
    if (obj instanceof slangInstance)
      return obj.get(expr.name);
    
    throw new RuntimeError(expr.name, "Only instances have properties.")
  }
  
  public visitExprSetterExpr(expr: ExprSetter): AnyValue {
    const obj: AnyValue = this.evaluate(expr.obj);
    
    if (!(obj instanceof slangInstance))
      throw new RuntimeError(expr.name, "Only instances have fields.");
    
    const value: AnyValue = this.evaluate(expr.val);
    obj.set(expr.name, value);
    return value;
  }
  
  public visitExprBinaryExpr(expr: ExprBinary): AnyValue {
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
        if (right == 0)
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

  private execute(stmt: Stmt): void {
    stmt.accept(this);
  }

  executeBlock(statements: Stmt[], environment: Environment) {
    const previous: Environment = this.environment;
    try {
      this.environment = environment;

      statements.map((statement) => {
        this.execute(statement);
      })
    }
    finally {
      this.environment = previous;
    }
  }
  private checkNumberOperand(operator: Token, operand: AnyValue): void {
    if (typeof operand === "number") {
      return;
    }
    throw new RuntimeError(operator, "Operands must be a number.");
  }

  public resolve(expr : Expr , depth : number) : void{
    this.locals.set(expr, depth);
  }
  
  private lookUpVariable(name : Token , expr : Expr): AnyValue{
    const distance = this.locals.get(expr);
    if (distance != null)
      return this.environment.getAt(distance, name.lexeme);
    else
      return this.globals.get(name);
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
