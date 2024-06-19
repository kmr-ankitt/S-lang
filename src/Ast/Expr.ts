import { Token } from "./Tokens/token"; 
import { AnyValue } from "./Tokens/tokenType"; ;

export type Expr = Binary | Grouping | Literal | Unary;

export class Binary {
    public left: Expr;
    public operator: Token;
    public right: Expr;

    public constructor(left: Expr, operator: Token, right: Expr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

}

export class Grouping {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

}

export class Literal {
    public value: AnyValue;

    public constructor(value: AnyValue) {
        this.value = value;
    }

}

export class Unary {
    public operator: Token;
    public right: Expr;

    public constructor(operator: Token, right: Expr) {
        this.operator = operator;
        this.right = right;
    }

}

