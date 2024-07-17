export class Stack<T> {
  private readonly stack: T[] = [];

  push(item: T): void {
    this.stack.push(item);
  }

  pop(): T | undefined {
    return this.stack.pop();
  }

  isEmpty(): T | boolean {
    if (this.stack.length < 1)
      return true;
    else {
      return false;
    }
  }
  
  peek(): T  {
    return this.stack[this.stack.length - 1];
  }
  
  get(index : number) : T{
    return this.stack[index];
  }
  
  size(): number{
    return this.stack.length;
  }
}   