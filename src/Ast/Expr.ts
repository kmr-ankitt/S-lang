import { Token } from "../Tokens/token"; 
import { AnyValue } from "../Tokens/tokenType"; ;

export interface ExprVisitor<R> {
    visitExprBinaryExpr(expr: ExprBinary): R;
    visitExprGroupingExpr(expr: ExprGrouping): R;
    visitExprLiteralExpr(expr: ExprLiteral): R;
    visitExprUnaryExpr(expr: ExprUnary): R;
    visitExprAssignExpr(expr: ExprAssign): R;
    visitExprLogicalExpr(expr: ExprLogical): R;
    visitExprVariableExpr(expr: ExprVariable): R;
}

export type Expr = ExprBinary | ExprGrouping | ExprLiteral | ExprUnary | ExprAssign | ExprLogical | ExprVariable;

export class ExprBinary {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    public constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprBinaryExpr(this);
    }
}

export class ExprGrouping {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprGroupingExpr(this);
    }
}

export class ExprLiteral {
    public value: AnyValue;

    public constructor(value: AnyValue) {
        this.value = value;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprLiteralExpr(this);
    }
}

export class ExprUnary {
    public operator: Token;
    public right: Expr;

    public constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprUnaryExpr(this);
    }
}

export class ExprAssign {
    public name: Token;
    public value: Expr;

    public constructor(name: Token, value: Expr) {
        this.name = name;
        this.value = value;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprAssignExpr(this);
    }
}

export class ExprLogical {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    public constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprLogicalExpr(this);
    }
}

export class ExprVariable {
    public name: Token;

    public constructor(name: Token) {
        this.name = name;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprVariableExpr(this);
    }
}

