import Slang from "../main";
import { Token } from "../Tokens/token";
import { TokenType } from "../Tokens/tokenType";

export class Error {

  //   Error reporting is done here
  private static report(line: number, where: string, message: string) {
    console.error("[line " + line + "] Error" + where + ": " + message);
    Slang.hadError = true;
  }

  static error(token : Token, message : string) : void { 
    if(token.type === TokenType.EOF)
      this.report(token.line, " at end", message);

    else
      this.report(token.line, " at '" + token.lexeme + "'", message);

  }
}
