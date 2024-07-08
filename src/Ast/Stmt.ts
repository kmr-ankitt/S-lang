import { Expr } from "./Expr";

export interface Visitor<R> {
    visitExpressionStmt(stmt: Expression): R;
    visitPrintStmt(stmt: Print): R;
}

export type Stmt = Expression | Print;

export class Expression {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: Visitor<R>): R {
        return visitor.visitExpressionStmt(this);
    }
}

export class Print {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: Visitor<R>): R {
        return visitor.visitPrintStmt(this);
    }
}

