import { Interpreter } from "../Interpreter/interpreter";
import { slangCallable } from "../SlangHelper/slangCallable";
import { AnyValue } from "../Tokens/tokenType";
import { slangFunction } from "./slangFunction";
import { slangInstance } from "./slangInstance";

export class slangClass implements slangCallable {
  readonly name: string;
  private readonly methods: Map<string, slangFunction>;

  constructor(name: string, methods: Map<string, slangFunction>) {
    this.name = name;
    this.methods = methods;
  }

  findMethod(name: string) {
    if (this.methods.has(name))
      return this.methods.get(name);
    
    return null;
  }

  public toString(): string {
    return this.name;
  }

  public call(interpreter: Interpreter, args: AnyValue[]) {
    let instance: slangInstance = new slangInstance(this);
    return instance;
  }

  public arity(): number {
    return 0;
  }
}
