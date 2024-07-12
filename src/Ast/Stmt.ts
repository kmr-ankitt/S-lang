import { Expr } from "./Expr";
import { Token } from "../Tokens/token";

export interface StmtVisitor<R> {
    visitBlockStmt(stmt: Block): R;
    visitExpressionStmt(stmt: Expression): R;
    visitPrintStmt(stmt: Print): R;
    visitVarStmt(stmt: Var): R;
}

export type Stmt = Block | Expression | Print | Var;

export class Block {
    public statements: Stmt[];

    public constructor(statements: Stmt[]) {
        this.statements = statements;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitBlockStmt(this);
    }
}

export class Expression {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitExpressionStmt(this);
    }
}

export class Print {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitPrintStmt(this);
    }
}

export class Var {
    public name: Token;
    public initializer: Expr;

    public constructor(name: Token, initializer: Expr) {
        this.name = name;
        this.initializer = initializer;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitVarStmt(this);
    }
}

