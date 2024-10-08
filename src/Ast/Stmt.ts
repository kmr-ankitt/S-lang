import { Expr } from "./Expr";
import { Token } from "../Tokens/token";

export interface StmtVisitor<R> {
    visitStmtBlockStmt(stmt: StmtBlock): R;
    visitStmtClassStmt(stmt: StmtClass): R;
    visitStmtExpressionStmt(stmt: StmtExpression): R;
    visitStmtPrintStmt(stmt: StmtPrint): R;
    visitStmtFuncStmt(stmt: StmtFunc): R;
    visitStmtIfStmt(stmt: StmtIf): R;
    visitStmtReturnStmt(stmt: StmtReturn): R;
    visitStmtVarStmt(stmt: StmtVar): R;
    visitStmtWhileStmt(stmt: StmtWhile): R;
}

export type Stmt = StmtBlock | StmtClass | StmtExpression | StmtPrint | StmtFunc | StmtIf | StmtReturn | StmtVar | StmtWhile;

export class StmtBlock {
    public statements: Stmt[];

    public constructor(statements: Stmt[]) {
        this.statements = statements;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtBlockStmt(this);
    }
}

export class StmtClass {
    public name: Token;
    public methods: StmtFunc[];

    public constructor(name: Token, methods: StmtFunc[]) {
        this.name = name;
        this.methods = methods;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtClassStmt(this);
    }
}

export class StmtExpression {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtExpressionStmt(this);
    }
}

export class StmtPrint {
    public expression: Expr;

    public constructor(expression: Expr) {
        this.expression = expression;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtPrintStmt(this);
    }
}

export class StmtFunc {
    public name: Token;
    public params: Token[];
    public body: Stmt[];

    public constructor(name: Token, params: Token[], body: Stmt[]) {
        this.name = name;
        this.params = params;
        this.body = body;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtFuncStmt(this);
    }
}

export class StmtIf {
    public condition: Expr;
    public thenBranch: Stmt;
    public elseBranch: Stmt | null;

    public constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtIfStmt(this);
    }
}

export class StmtReturn {
    public keyword: Token;
    public value: Expr | null;

    public constructor(keyword: Token, value: Expr | null) {
        this.keyword = keyword;
        this.value = value;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtReturnStmt(this);
    }
}

export class StmtVar {
    public name: Token;
    public initializer: Expr;

    public constructor(name: Token, initializer: Expr) {
        this.name = name;
        this.initializer = initializer;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtVarStmt(this);
    }
}

export class StmtWhile {
    public condition: Expr;
    public body: Stmt;

    public constructor(condition: Expr, body: Stmt) {
        this.condition = condition;
        this.body = body;
    }

    public accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitStmtWhileStmt(this);
    }
}

