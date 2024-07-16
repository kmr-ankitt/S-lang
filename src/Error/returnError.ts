import { AnyValue } from "../Tokens/tokenType";

export class returnError extends Error{
  readonly value: AnyValue;
  
  constructor(value : AnyValue){
    super();
    this.value = value;
  }
}