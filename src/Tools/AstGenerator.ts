import { writeFileSync } from "fs";

function defineType(
  content: string,
  baseName: string,
  className: string,
  fieldList: string
): string {
  const fields = fieldList.split(",");

  content += `export class ${className} {\n`;

  for (const field of fields) {
    const [name, type] = field.split(":").map((str) => str.trim());
    content += `    public ${name}: ${type};\n`;
  }

  content += "\n";
  content += `    public constructor(${fieldList}) {\n`;

  for (const field of fields) {
    const name = field.split(":")[0].trim();
    content += `        this.${name} = ${name};\n`;
  }

  content += "    }\n\n";
  // content += "}\n\n";

  content += `    public accept<R>(visitor: ${baseName}Visitor<R>): R {\n`;
  content += `        return visitor.visit${className}${baseName}(this);\n`;
  content += "    }\n}\n\n";

  return content;
}

function defineVisitor(
  content: string,
  baseName: string,
  types: string[]
): string {
  content += `export interface ${baseName}Visitor<R> {\n`;

  for (const type of types) {
    const typeName = type.split(":")[0].trim();
    content += `    visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): R;\n`;
  }

  content += "}\n\n";
  return content;
}

function defineAst(
  outDir: string,
  baseName: string,
  types: string[],
  imports: string
): void {
  const path = `${outDir}/${baseName}.ts`;
  let content = imports.endsWith(";") ? `${imports}\n\n` : `${imports};\n\n`;

  content = defineVisitor(content, baseName, types);

  const classNames = types.map((v) => v.split(" : ")[0].trim());
  content += `export type ${baseName} = ${classNames.join(" | ")};\n\n`;

  for (const type of types) {
    const [className, fields] = type.split(" : ").map((str) => str.trim());
    content = defineType(content, baseName, className, fields);
  }

  writeFileSync(path, content);
}

// Main Function
(() => {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error("Usage: ts-node generate-ast.ts <outdir>");
    process.exit(1);
  }

  const outDir = args[0];

  defineAst(
    outDir,
    "Expr",
    [
      "ExprBinary   : left: Expr, operator: Token, right: Expr",
      "ExprGrouping : expression: Expr",
      "ExprLiteral  : value: AnyValue ",
      "ExprUnary    : operator: Token, right: Expr",
      "ExprAssign   : name: Token, value: Expr",
      "ExprCall     : callee: Expr, paren: Token, args: Expr[]",
      // "ExprGetter   : obj: Expr, name: Token", // Named Getter instead of Get for consistency with Setter
      "ExprLogical  : left: Expr, operator: Token, right: Expr",
      // "ExprSetter   : obj: Expr, name: Token, val: Expr", // Named Setter instead of Set cause of collision with the JS Set
      // "ExprSuper    : keyword: Token, method: Token",
      // "ExprThis     : keyword: Token",
      "ExprVariable : name: Token",
    ],
    'import { Token } from "../Tokens/token"; \nimport { AnyValue } from "../Tokens/tokenType"; '
  );

  defineAst(
    outDir,
    "Stmt",
    [
      "StmtBlock      : statements: Stmt[]",
      "StmtClass      : name: Token, methods: StmtFunc[]",
      "StmtExpression : expression: Expr",
      "StmtPrint      : expression: Expr",
      "StmtFunc       : name: Token, params: Token[], body: Stmt[]",
      "StmtIf         : condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null",
      "StmtReturn     : keyword: Token, value: Expr | null",
          // initializer is Expr | null to stop typescript from complaining.
      "StmtVar        : name: Token, initializer: Expr",
      "StmtWhile      : condition: Expr, body: Stmt",
    ],
    'import { Expr } from "./Expr";\nimport { Token } from "../Tokens/token";'
  );
})();
