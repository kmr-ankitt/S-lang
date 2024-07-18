import { Token } from "../Tokens/token"; 
import { AnyValue } from "../Tokens/tokenType"; ;

export interface ExprVisitor<R> {
    visitExprBinaryExpr(expr: ExprBinary): R;
    visitExprGroupingExpr(expr: ExprGrouping): R;
    visitExprLiteralExpr(expr: ExprLiteral): R;
    visitExprUnaryExpr(expr: ExprUnary): R;
    visitExprAssignExpr(expr: ExprAssign): R;
    visitExprCallExpr(expr: ExprCall): R;
    visitExprGetterExpr(expr: ExprGetter): R;
    visitExprLogicalExpr(expr: ExprLogical): R;
    visitExprSetterExpr(expr: ExprSetter): R;
    visitExprThisExpr(expr: ExprThis): R;
    visitExprVariableExpr(expr: ExprVariable): R;
}

export type Expr = ExprBinary | ExprGrouping | ExprLiteral | ExprUnary | ExprAssign | ExprCall | ExprGetter | ExprLogical | ExprSetter | ExprThis | ExprVariable;

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

export class ExprCall {
    public callee: Expr;
    public paren: Token;
    public args: Expr[];

    public constructor(callee: Expr, paren: Token, args: Expr[]) {
        this.callee = callee;
        this.paren = paren;
        this.args = args;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprCallExpr(this);
    }
}

export class ExprGetter {
    public obj: Expr;
    public name: Token;

    public constructor(obj: Expr, name: Token) {
        this.obj = obj;
        this.name = name;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprGetterExpr(this);
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

export class ExprSetter {
    public obj: Expr;
    public name: Token;
    public val: Expr;

    public constructor(obj: Expr, name: Token, val: Expr) {
        this.obj = obj;
        this.name = name;
        this.val = val;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprSetterExpr(this);
    }
}

export class ExprThis {
    public keyword: Token;

    public constructor(keyword: Token) {
        this.keyword = keyword;
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExprThisExpr(this);
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

