![slangBanner](https://github.com/user-attachments/assets/787387f0-07e0-4912-ab34-7e89b3aa8ebb)

# S-lang

S-lang is a Dynamically typed Language Object Oriented programming language designed for simplicity and ease of use.

## Why

S-lang is designed in such a way that it is easy to learn and use for Gen-z newbies to programming world.

 I know It's a weird descision to build a TypeScript based Interpreter. But ok.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- Make (Optional)

## Installation

1. Clone `S-lang` offical repository:

```bash
git clone https://github.com/kmr-ankitt/S-lang.git 
cd S-lang
```

2. Install `S-lang` dependencies:
```bash
npm install
```

3. Run `S-lang` REPL:

```bash
npm run slang
```
You can also run `S-lang` through Makefile:

```bash
make slang
```

4. Compile and run `.sx` file :

```ts
npm run slang FILE_DIRECTORY/FILE_NAME.sx
```

## S-lang Documentation

### File extension

S-lang supports only `.sx` file extension.
example: `main.sx`


### Hello, world!
A simple hello world program in S-lang:
```python
echo "Hello, World!";
```
**Semi-colons at the end of every line is mandatory in S-lang.**

### Datatypes
S-lang has following datatypes

#### Numbers
There can be number literals which can be both integers and floating point numbers.

examples: `1`, `2.5`, `9`

#### Strings
These are string literals defined inside `"`

examples: `"S-lang"`, `"Strings are easy"`

### Booleans
These are boolean literals which can be either `real` or `noi`.

examples: `real`, `noi`

### Null Type
S-lang has null datatype. It can be defined using the `void` keyword. All uninitialized variables are given the value of `void`. 

examples: `void`


### Operators

S-lang has following operators:

#### Assignment
`=` - equals

#### Unary operators
`-` - Unary negation

### Logical operators
`nd` - logical AND

`or`  - logical OR

`!`   - logical NOT


#### Arithmetic operators
`+` - sum

`-` - difference

`*` - product 

`/` - division 

`%` - mod


#### Comparison operators
`==` - is equals

`!=` - is not equals

`>`  - is less than

`>=` - is less than or equals

`>`  - is greater than

`>=` - is greater than or equals


### Comments
S-lang support both single line and multi line comment.

- Single line comment
```c
// This is a single line comment.
// The Lexer completely ignores any line starting with // 
```

- Multiline comment
```c
/*This is a mulit line comment in S-lang similar to that of C.*/
```

### Variables 

```rust
let num = 15; // number
let name = "radiohead"; // string
let goat = real; // booleans
let noob = noi; // booleans
let nullable = void; // null type
```


### Logical operators
```rust
!real;  // false.
!noi; // true.
real nd noi; // false.
real nd real;  // true.
noi or noi; // false.
real or noi;  // true.
```

### Control flow
```rust
let num = 15;

iffy(num > 0){
    echo "num is positive";
}oof {
    echo "num is negative";
}
```

### Loops 
```rust
roll(let i = 0; i < 10; i = i + 1){
    echo i;
}

let num = 1;
loop(num > 0){
    echo num;
    num = num - 1;
}
```

### Functions
```rust
fun add(a, b){
    return a + b;
}

echo add(5, 10);
```


### Closures
```rust
fun addPair(a, b) {
return a + b;
}

fun identity(a) {
return a;
}

echo identity(addPair)(1, 2); // Prints "3".

fun makeCounter(){
    let c = 0;
    fun counter(){
        c = c + 1;
        echo c;
    }
    return counter;
}

let counter1 = makeCounter();
let counter2 = makeCounter();

counter1(); // 1
counter2(); // 1
```

## Classes
S-lang has classes. It's a group of functions that can be used to create objects.

- keywords: `fam` for class, `here` for current context or this keyword in other langs.

```rust
fam Bacon {
  eat() {
    echo "Crunch crunch crunch!";
  }
}

Bacon().eat(); // Prints "Crunch crunch crunch!".

fam Thing {
  getCallback() {
    fun localFunction() {
      echo this;
    }

    return localFunction;
  }
}

let callback = Thing().getCallback();
callback();
``` 








