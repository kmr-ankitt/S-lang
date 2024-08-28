import { TokenType } from "../Tokens/tokenType";

export const keywords: Record<string, TokenType> = {
  nd: TokenType.AND,          // "nd" - short for "and"
  fam: TokenType.CLASS,        // "fam" - a group, like a class
  oof: TokenType.ELSE,         // "oof" - something went wrong, alternative path
  noi: TokenType.FALSE,        // "noi" - clear denial
  roll: TokenType.FOR,         // "roll" - rolling through a loop
  fun: TokenType.FUN,          // "fun" - keeps the original but adds a playful tone
  iffy: TokenType.IF,          // "iffy" - uncertain, conditional
  void: TokenType.NIL,         // "void" - represents nothingness
  or: TokenType.OR,            // "or" - one or the other
  echo: TokenType.PRINT,       // "echo" - something that's repeated, like print
  return: TokenType.RETURN,    // "return" - returning to something
  top: TokenType.SUPER,        // "top" - something superior
  here: TokenType.THIS,        // "here" - refers to the current context
  real: TokenType.TRUE,        // "real" - simple affirmation
  let: TokenType.VAR,          // "let" - a place to store things, like a variable
  loop: TokenType.WHILE,       // "loop" - easy to relate to continuous repetition
}
