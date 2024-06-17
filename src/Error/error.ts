import Slang from "../main";

export class error {
  static error(line: number, message: string) {
    this.report(line, "", message);
  }

  //   Error reporting is done here
  private static report(line: number, where: string, message: string) {
    console.error("[line " + line + "] Error" + where + ": " + message);
    Slang.hadError = true;
  }
}
