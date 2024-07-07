import Slang from "../main";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";
import { RuntimeError } from "./RuntimeError";

export class Error {

  //   Error reporting is done here
  private static report(line: number, where: string, message: string) {
    console.error("[line " + line + "] Error" + where + ": " + message);
    Slang.hadError = true;
  }

  static runtimeError(error : RuntimeError) : void{
    console.error(error.message + "\n[line " + error.token.line + "]");
    Slang.hadRuntimeError = true;
  }

  static error(line: number, message: string): void;
  static error(token: Token, message: string): void;
  static error(arg1: number | Token, message: string): void {
    if (typeof arg1 === "number") {
      this.report(arg1, "", message);
    } else {
      if (arg1.type === TokenType.EOF) {
        this.report(arg1.line, " at end", message);
      } else {
        this.report(arg1.line, " at '" + arg1.lexeme + "'", message);
      }
    }
  }
}
