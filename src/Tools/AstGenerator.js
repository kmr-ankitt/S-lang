"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
function defineType(content, baseName, className, fieldList) {
    var fields = fieldList.split(",");
    content += "export class ".concat(className, " {\n");
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
        var field = fields_1[_i];
        var _a = field.split(":").map(function (str) { return str.trim(); }), name_1 = _a[0], type = _a[1];
        content += "    public ".concat(name_1, ": ").concat(type, ";\n");
    }
    content += "\n";
    content += "    public constructor(".concat(fieldList, ") {\n");
    for (var _b = 0, fields_2 = fields; _b < fields_2.length; _b++) {
        var field = fields_2[_b];
        var name_2 = field.split(":")[0].trim();
        content += "        this.".concat(name_2, " = ").concat(name_2, ";\n");
    }
    content += "    }\n\n";
    content += "}\n\n";
    // content += "    public accept<T>(visitor: Visitor<T>): T {\n";
    // content += `        return visitor.visit${className}${baseName}(this);\n`;
    // content += "    }\n}\n\n";
    return content;
}
// function defineVisitor(content: string, baseName: string, types: string[]): string {
//   content += "export interface Visitor<T> {\n";
//   for (const type of types) {
//     const typeName = type.split(":")[0].trim();
//     content += `    visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): T;\n`;
//   }
//   content += "}\n\n";
//   return content;
// }
function defineAst(outDir, baseName, types, imports) {
    var path = "".concat(outDir, "/").concat(baseName, ".ts");
    var content = imports.endsWith(";") ? "".concat(imports, "\n\n") : "".concat(imports, ";\n\n");
    // content = defineVisitor(content, baseName, types);
    var classNames = types.map(function (v) { return v.split(" : ")[0].trim(); });
    content += "export type ".concat(baseName, " = ").concat(classNames.join(" | "), ";\n\n");
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var type = types_1[_i];
        var _a = type.split(" : ").map(function (str) { return str.trim(); }), className = _a[0], fields = _a[1];
        content = defineType(content, baseName, className, fields);
    }
    (0, fs_1.writeFileSync)(path, content);
}
// Main Function 
(function () {
    var args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error("Usage: ts-node generate-ast.ts <outdir>");
        process.exit(1);
    }
    var outDir = args[0];
    defineAst(outDir, "Expr", [
        "Binary   : left: Expr, operator: Token, right: Expr",
        "Grouping : expression: Expr",
        "Literal  : value: AnyValue ",
        "Unary    : operator: Token, right: Expr",
        // "Assign   : name: Token, value: Expr",
        // "Call     : callee: Expr, paren: Token, args: Expr[]",
        // "Getter   : obj: Expr, name: Token", // Named Getter instead of Get for consistency with Setter
        // "Logical  : left: Expr, operator: Token, right: Expr",
        // "Setter   : obj: Expr, name: Token, val: Expr", // Named Setter instead of Set cause of collision with the JS Set
        // "Super    : keyword: Token, method: Token",
        // "This     : keyword: Token",
        // "Variable : name: Token",
    ], 'import { Token } from "./Tokens/token"; \nimport { AnyValue } from "./Tokens/tokenType"; ');
    // defineAst(
    //   outDir,
    //   "Stmt",
    //   [
    //     "Block      : statements: Stmt[]",
    //     "Class      : name: Token, superclass: Variable | null, methods: Func[]",
    //     "Expression : expression: Expr",
    //     "Func       : name: Token, params: Token[], body: Stmt[]",
    //     "If         : condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null",
    //     "Print      : expression: Expr",
    //     "Return     : keyword: Token, value: Expr | null",
    //     // initializer is Expr | null to stop typescript from complaining.
    //     "Var        : name: Token, initializer: Expr | null",
    //     "While      : condition: Expr, body: Stmt",
    //   ],
    //   'import { Expr, Variable } from "./expr";\nimport { Token } from "./token"',
    // );
})();
