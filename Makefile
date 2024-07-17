# Define directories
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

# Run the project
run: build
	node $(OUT_DIR)/main.js

slang: build
	node $(OUT_DIR)/main.js test.sl

ast: build
	node $(OUT_DIR)/Tools/AstGenerator.js src/Ast

# Watch files and rebuild on changes
watch:
	npx tsc --watch

# Clean the output directory
clean:
	rm -rf $(OUT_DIR)

# Lint the project
lint:
	npx eslint $(TS_DIR) --ext .ts

# Install dependencies
install:
	npm install

# PHONY targets
.PHONY: all build run watch clean lint install
