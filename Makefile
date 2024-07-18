TS_DIR = src
OUT_DIR = dist

# Find all TypeScript files
TS_FILES = $(wildcard $(TS_DIR)/**/*.ts)

# Define corresponding JavaScript output files
JS_FILES = $(TS_FILES:$(TS_DIR)/%.ts=$(OUT_DIR)/%.js)

# Default target
all: build run

# Compile TypeScript to JavaScript
build:
	npx tsc

# Run the project with a user-provided file
slang: build
	node $(OUT_DIR)/main.js $(file)

# Generate AST
ast: build
	node $(OUT_DIR)/Tools/AstGenerator.js src/Ast

# Clean the output directory
clean:
	rm -rf $(OUT_DIR)

# Install dependencies
install:
	npm install

# PHONY targets
.PHONY: all build run watch clean lint install

# Handle arguments
%:
	@$(MAKE) run file=$@