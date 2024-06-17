TS_DIR = src
OUT_DIR = dist
TS_FILES = $(wildcard $(TS_DIR)/**/*.ts)
JS_FILES = $(TS_FILES:$(TS_DIR)/%.ts=$(OUT_DIR)/%.js)

# Default target
all: build run

# Compile TypeScript to JavaScript
build: $(JS_FILES)
	npx tsc

# Run the project
run: build
	node $(OUT_DIR)/main.js

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
