# 🎓 Educational Compiler Project

A complete **6-stage educational compiler** built from scratch in C++ to demonstrate how compilers work. This project takes source code through lexical analysis, parsing, semantic validation, optimization, code generation, and execution on a stack-based virtual machine.

![Main Menu](file:///C:/Users/User/.gemini/antigravity/brain/394838c2-c935-43ce-9ec9-4cab7a6438fd/demo_main_menu_1767771998318.png)

## 🌟 Features

- ✅ **Complete Compilation Pipeline** - All 6 major compiler stages implemented
- ✅ **Interactive Demo** - Step-by-step visualization of compilation process
- ✅ **Code Optimization** - Constant folding and constant propagation
- ✅ **Error Detection** - Comprehensive semantic and syntax error handling
- ✅ **87 Test Cases** - Thoroughly tested across all components
- ✅ **Educational** - Perfect for learning compiler construction

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Compilation Stages](#compilation-stages)
- [Language Features](#language-features)
- [Project Structure](#project-structure)
- [How to Build](#how-to-build)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Architecture](#architecture)
- [Screenshots](#screenshots)

## 🚀 Quick Start

### Prerequisites
- C++ compiler with C++17 support (g++ recommended)
- Windows/Linux/macOS

### Build and Run

```bash
# Clone the repository
cd compiler-project

# Build the interactive demo
g++ -std=c++17 -I. main_demo.cpp compiler/vm/VirtualMachine.cpp compiler/codegen/CodeGenerator.cpp compiler/optimizer/Optimizer.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp compiler/bytecode/BytecodeProgram.cpp compiler/bytecode/Bytecode.cpp -o compiler_demo.exe

# Run the demo
.\compiler_demo.exe
```

## 🔧 Compilation Stages

Our compiler implements all six fundamental stages of compilation:

### 1. **Lexical Analysis** (Tokenization)
Breaks source code into tokens (keywords, identifiers, operators, literals).

```
Input:  let x = 42;
Output: [LET] [IDENTIFIER:x] [ASSIGN:=] [INTEGER:42] [SEMICOLON:;]
```

### 2. **Syntax Analysis** (Parsing)
Builds an Abstract Syntax Tree (AST) from tokens.

```
AST:
  LetStatement
    ├── identifier: "x"
    └── expression: IntegerLiteral(42)
```

### 3. **Semantic Analysis**
Validates variable usage, detects undefined variables and duplicate declarations.

```
✅ Symbol Table: {x: declared at line 1}
✅ All variables properly declared
```

### 4. **Code Optimization** ⭐
Applies optimizations like constant folding and propagation.

![Optimization](file:///C:/Users/User/.gemini/antigravity/brain/394838c2-c935-43ce-9ec9-4cab7a6438fd/demo_optimization_1767772008860.png)

```
Before: let x = 2 + 3 * 4;  (6 instructions)
After:  let x = 14;          (2 instructions)
Result: 67% reduction!
```

### 5. **Code Generation**
Generates stack-based bytecode instructions.

```
Bytecode:
  0: LOAD_CONST 14
  1: STORE_VAR "x"
  2: HALT
```

### 6. **Execution** (Virtual Machine)
Executes bytecode on a stack-based VM.

![Execution](file:///C:/Users/User/.gemini/antigravity/brain/394838c2-c935-43ce-9ec9-4cab7a6438fd/demo_execution_output_1767772019411.png)

```
Program Output: 14
```

## 💻 Language Features

### Supported Syntax

```javascript
// Variable declarations
let x = 42;
let y = 10 + 5;

// Arithmetic operators
+ - * / %

// Comparison operators
< > <= >= == !=

// Output
print x;
print x + y;
```

### Example Programs

**Basic Variable:**
```javascript
let x = 42;
print x;
```

**Arithmetic:**
```javascript
let a = 10;
let b = 20;
let sum = a + b;
print sum;  // Output: 30
```

**Complex Expression:**
```javascript
let x = 5;
let y = 3;
let result = (x + y) * 2;
print result;  // Output: 16
```

**Comparisons:**
```javascript
let age = 25;
let limit = 18;
let isAdult = age >= limit;
print isAdult;  // Output: 1 (true)
```

## 📁 Project Structure

```
compiler-project/
├── compiler/
│   ├── lexer/          # Tokenization
│   │   ├── Token.h
│   │   ├── Lexer.h
│   │   └── Lexer.cpp
│   ├── parser/         # AST Construction
│   │   ├── AST.h
│   │   ├── AST.cpp
│   │   ├── Parser.h
│   │   └── Parser.cpp
│   ├── semantic/       # Validation
│   │   ├── SymbolTable.h
│   │   ├── SymbolTable.cpp
│   │   ├── SemanticAnalyzer.h
│   │   └── SemanticAnalyzer.cpp
│   ├── optimizer/      # Optimization
│   │   ├── Optimizer.h
│   │   └── Optimizer.cpp
│   ├── bytecode/       # Intermediate Representation
│   │   ├── Bytecode.h
│   │   ├── Bytecode.cpp
│   │   ├── BytecodeProgram.h
│   │   └── BytecodeProgram.cpp
│   ├── codegen/        # Code Generation
│   │   ├── CodeGenerator.h
│   │   └── CodeGenerator.cpp
│   └── vm/             # Virtual Machine
│       ├── VirtualMachine.h
│       └── VirtualMachine.cpp
├── demos/              # Example Programs
│   ├── demo1.txt
│   ├── demo2.txt
│   ├── demo3.txt
│   ├── demo4.txt
│   ├── demo5_optimization.txt
│   ├── demo_error1.txt
│   └── demo_error2.txt
├── main_demo.cpp       # Interactive Demo
├── test_*.cpp          # Test Suites
└── README.md
```

## 🛠️ How to Build

### Build Interactive Demo

```bash
g++ -std=c++17 -I. main_demo.cpp compiler/vm/VirtualMachine.cpp compiler/codegen/CodeGenerator.cpp compiler/optimizer/Optimizer.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp compiler/bytecode/BytecodeProgram.cpp compiler/bytecode/Bytecode.cpp -o compiler_demo.exe
```

### Build Test Suites

```bash
# Lexer tests
g++ -std=c++17 -I. test_lexer.cpp compiler/lexer/Lexer.cpp -o test_lexer.exe

# Parser tests
g++ -std=c++17 -I. test_parser.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp -o test_parser.exe

# Semantic analysis tests
g++ -std=c++17 -I. test_semantic.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp -o test_semantic.exe

# Optimizer tests
g++ -std=c++17 -I. test_optimizer.cpp compiler/optimizer/Optimizer.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp -o test_optimizer.exe

# Code generation tests
g++ -std=c++17 -I. test_codegen.cpp compiler/codegen/CodeGenerator.cpp compiler/optimizer/Optimizer.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp compiler/bytecode/BytecodeProgram.cpp compiler/bytecode/Bytecode.cpp -o test_codegen.exe

# Full pipeline tests
g++ -std=c++17 -I. test_vm.cpp compiler/vm/VirtualMachine.cpp compiler/codegen/CodeGenerator.cpp compiler/optimizer/Optimizer.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp compiler/bytecode/BytecodeProgram.cpp compiler/bytecode/Bytecode.cpp -o test_vm.exe
```

## 📖 Usage Examples

### Interactive Demo

Run `compiler_demo.exe` and choose from:

1. **Write code directly** - Type your own programs
2. **Load demo files** - Try 7 pre-made examples
   - `demo1.txt` - Simple variable
   - `demo2.txt` - Arithmetic with variables
   - `demo3.txt` - Complex expressions
   - `demo4.txt` - Comparisons
   - `demo5_optimization.txt` - Optimization showcase
   - `demo_error1.txt` - Undefined variable error
   - `demo_error2.txt` - Duplicate declaration error

### Programmatic Usage

```cpp
#include "compiler/vm/VirtualMachine.h"
#include "compiler/codegen/CodeGenerator.h"
#include "compiler/optimizer/Optimizer.h"
#include "compiler/semantic/SemanticAnalyzer.h"
#include "compiler/parser/Parser.h"
#include "compiler/lexer/Lexer.h"

int main() {
    std::string source = "let x = 2 + 3; print x;";
    
    // 1. Lexical Analysis
    Lexer lexer(source);
    auto tokens = lexer.getAllTokens();
    
    // 2. Syntax Analysis
    Parser parser(tokens);
    auto program = parser.parse();
    
    // 3. Semantic Analysis
    SemanticAnalyzer analyzer(program);
    analyzer.analyze();
    
    if (!analyzer.hasErrors()) {
        // 4. Optimization
        Optimizer optimizer;
        optimizer.optimize(program);
        
        // 5. Code Generation
        CodeGenerator codegen;
        BytecodeProgram bytecode = codegen.generate(program);
        
        // 6. Execution
        VirtualMachine vm;
        vm.execute(bytecode);
    }
    
    return 0;
}
```

## 🧪 Testing

The project includes comprehensive test suites:

| Component | Test File | Test Cases | Status |
|-----------|-----------|------------|--------|
| Lexer | test_lexer.cpp | 10 | ✅ All passing |
| Parser | test_parser.cpp | 20 | ✅ All passing |
| Semantic | test_semantic.cpp | 15 | ✅ All passing |
| Bytecode | test_bytecode.cpp | 8 | ✅ All passing |
| Optimizer | test_optimizer.cpp | 12 | ✅ All passing |
| CodeGen | test_codegen.cpp | 12 | ✅ All passing |
| VM | test_vm.cpp | 10 | ✅ All passing |
| **Total** | | **87** | **✅ All passing** |

Run all tests:
```bash
.\test_lexer.exe
.\test_parser.exe
.\test_semantic.exe
.\test_optimizer.exe
.\test_codegen.exe
.\test_vm.exe
```

## 🏗️ Architecture

### Stack-Based Virtual Machine

The VM uses a stack for computations:

```
Expression: x + y

Execution:
1. LOAD_VAR "x"    → Stack: [5]
2. LOAD_VAR "y"    → Stack: [5, 3]
3. ADD             → Stack: [8]
4. STORE_VAR "z"   → Stack: []
```

### Bytecode Instruction Set (16 Opcodes)

| Category | Opcodes |
|----------|---------|
| **Variables** | `LOAD_CONST`, `LOAD_VAR`, `STORE_VAR` |
| **Arithmetic** | `ADD`, `SUB`, `MUL`, `DIV`, `MOD` |
| **Comparisons** | `CMP_LT`, `CMP_GT`, `CMP_LTE`, `CMP_GTE`, `CMP_EQ`, `CMP_NEQ` |
| **I/O** | `PRINT`, `HALT` |

### Optimization Techniques

1. **Constant Folding** - Evaluate constant expressions at compile-time
   - `2 + 3` → `5`
   - `10 * 4` → `40`

2. **Constant Propagation** - Replace variables with known constant values
   - `let x = 5; let y = x + 1;` → `let x = 5; let y = 6;`

## 📸 Screenshots

### Main Menu
Interactive menu for choosing input method:

![Main Menu](file:///C:/Users/User/.gemini/antigravity/brain/394838c2-c935-43ce-9ec9-4cab7a6438fd/demo_main_menu_1767771998318.png)

### Code Optimization Stage
Shows before/after AST with optimizations applied:

![Optimization](file:///C:/Users/User/.gemini/antigravity/brain/394838c2-c935-43ce-9ec9-4cab7a6438fd/demo_optimization_1767772008860.png)

### Program Execution
Final stage showing VM execution and output:

![Execution](file:///C:/Users/User/.gemini/antigravity/brain/394838c2-c935-43ce-9ec9-4cab7a6438fd/demo_execution_output_1767772019411.png)

## 🎓 Educational Value

This project demonstrates:

- ✅ **Lexical Analysis** - Pattern recognition and tokenization
- ✅ **Syntax Analysis** - Grammar rules and tree structures  
- ✅ **Semantic Analysis** - Type checking and validation
- ✅ **Optimization** - Compile-time improvements
- ✅ **Code Generation** - Intermediate representations
- ✅ **Virtual Machines** - Stack-based execution

Perfect for:
- Computer Science students learning compilers
- Understanding how programming languages work
- Studying compiler optimization techniques
- Learning about virtual machines

## 📊 Project Statistics

- **Lines of Code**: ~3000+
- **Files Created**: 30+
- **Compilation Stages**: 6
- **Supported Opcodes**: 16
- **Demo Files**: 7
- **Test Cases**: 87 (all passing)

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more optimization techniques
- Extend the language with new features (loops, functions, etc.)
- Improve error messages
- Add more test cases

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Built from scratch as a comprehensive educational compiler demonstration.

---

**🎉 Complete Working Compiler!**

From source code to execution, this project implements all major phases of compilation with optimization and comprehensive testing!
