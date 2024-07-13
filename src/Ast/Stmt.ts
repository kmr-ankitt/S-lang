import { Expr } from "./Expr";
import { Token } from "../Tokens/token";

export interface StmtVisitor<R> {
    visitBlockStmt(stmt: Block): R;
    visitExpressionStmt(stmt: Expression): R;
    visitPrintStmt(stmt: Print): R;
    visitIfStmt(stmt: If): R;
    visitVarStmt(stmt: Var): R;
    visitWhileStmt(stmt: While): R;
}

export type Stmt = Block | Expression | Print | If | Var | While;

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

export class If {
    public condition: Expr;
    public thenBranch: Stmt;
    public elseBranch: Stmt | null;

    public constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
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

export class While {
    public condition: Expr;
    public body: Stmt;

    public constructor(condition: Expr, body: Stmt) {
        this.condition = condition;
        this.body = body;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitWhileStmt(this);
    }
}

