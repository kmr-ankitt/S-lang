![slangBanner](https://github.com/user-attachments/assets/787387f0-07e0-4912-ab34-7e89b3aa8ebb)

# S-lang

S-lang is a dynamically typed Language designed for simplicity and ease of use.

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
example: `main.zlt`


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







