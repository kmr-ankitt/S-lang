import fs from "fs";
import readline from "readline";
import { Lexer } from "./Lexer/lexer";
import { Parser } from "./Parser/parser";
import { Interpreter } from "./Interpreter/interpreter";

export default class Slang {

  private static readonly interpreter : Interpreter = new Interpreter();
  static hadError: boolean = false;
  static hadRuntimeError: boolean = false;

  //   This make the run Slang as file
  static runFile(path: string) {
    const buffer = fs.readFileSync(path);
    this.run(buffer.toString());

    if (this.hadError) {
      process.exit(65);
    }
    if (this.hadRuntimeError) {
      process.exit(70);
    }
  }

  static runPrompt() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });

    rl.on("line", (line) => {
      line = line.trim();

      if (line === "exit") {
        rl.close();
      } else {
        if (line) {
          try {
            this.run(line);
          } catch (err) {
            console.log(err);
          } finally {
            this.hadError = false;
          }
        }
        rl.prompt();
      }
    });

    rl.prompt();
  }

  private static run(source: string) {
    const lexer = new Lexer(source);
    const tokens = lexer.scanTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse()


    if(this.hadError) 
      return;
    
    this.interpreter.interpret(statements);
  }
}

function main() {
  if (process.argv.length > 3) {
    console.log("Usage: S-lang [script]");
    process.exit(64);
  } else if (process.argv.length === 3) {
    Slang.runFile(process.argv[2]);
  } else {
    Slang.runPrompt();
  }
}

main();
