import { Token } from "../Tokens/token"; 
import { AnyValue } from "../Tokens/tokenType"; ;

export interface ExprVisitor<R> {
    visitBinaryExpr(expr: Binary): R;
    visitGroupingExpr(expr: Grouping): R;
    visitLiteralExpr(expr: Literal): R;
    visitUnaryExpr(expr: Unary): R;
    visitAssignExpr(expr: Assign): R;
    visitVariableExpr(expr: Variable): R;
}

export type Expr = Binary | Grouping | Literal | Unary | Assign | Variable;

export class Binary {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    public constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }
}

export class Grouping {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }
}

export class Literal {
    public value: AnyValue;

    public constructor(value: AnyValue) {
        this.value = value;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}

export class Unary {
    public operator: Token;
    public right: Expr;

    public constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}

export class Assign {
    public name: Token;
    public value: Expr;

    public constructor(name: Token, value: Expr) {
        this.name = name;
        this.value = value;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }
}

export class Variable {
    public name: Token;

    public constructor(name: Token) {
        this.name = name;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }
}

