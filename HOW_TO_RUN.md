# 🚀 How to Run the Compiler

## Option 1: Web Interface (Recommended)

The easiest way to explore the compiler is through the modern web interface.

1.  **Build the Backend** (if not already built):
    ```bash
    g++ -std=c++17 -I. main_web_api.cpp compiler/lexer/Lexer.cpp compiler/parser/AST.cpp compiler/parser/Parser.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/codegen/CodeGenerator.cpp compiler/bytecode/Bytecode.cpp compiler/bytecode/BytecodeProgram.cpp compiler/vm/VirtualMachine.cpp compiler/optimizer/Optimizer.cpp -o compiler_web_api.exe
    ```

2.  **Start the Server**:
    ```bash
    cd web-app
    npm start
    ```

3.  **Open Browser**:
    Go to [http://localhost:3000](http://localhost:3000)

## Option 2: Desktop CLI (Classic)

You can also run the standard desktop console version:

```bash
.\compiler_demo.exe
```

## Quick Start (Already Compiled!)

Since the project is already compiled, you can run it immediately:

```bash
.\compiler_demo.exe
```

## Interactive Menu Options

When you run the demo, you'll see three options:

### Option 1: Write Code Directly
- Type your own code
- End input by typing `END` on a new line
- Great for experimenting with your own programs!

### Option 2: Load from Demo Files
Choose from 7 pre-made examples:

1. **demo1.txt** - Simple variable declaration (`let x = 42;`)
2. **demo2.txt** - Arithmetic expressions with variables
3. **demo3.txt** - Complex nested expressions
4. **demo4.txt** - Comparison operators
5. **demo5_optimization.txt** - **⭐ RECOMMENDED!** Shows optimization (2 + 3 * 4)
6. **demo_error1.txt** - Demonstrates undefined variable error
7. **demo_error2.txt** - Demonstrates duplicate declaration error

### Option 3: Exit
- Exits the program

## What You'll See

The compiler walks you through all **6 stages**:

1. **Lexical Analysis** - Breaking code into tokens
2. **Syntax Analysis** - Building the Abstract Syntax Tree (AST)
3. **Semantic Analysis** - Validating variable usage
4. **Code Optimization** - Constant folding and propagation
5. **Code Generation** - Creating bytecode instructions
6. **Execution** - Running on the virtual machine

## Example Demo Run

For the best demonstration, I recommend:
1. Run `.\compiler_demo.exe`
2. Choose option `2` (Load from demo file)
3. Select demo `5` (demo5_optimization.txt)
4. Press Enter to walk through each stage

You'll see how the compiler optimizes `2 + 3 * 4` from a complex expression tree to a simple constant `14`!

## If You Need to Rebuild

If you make changes to the code and need to rebuild:

```bash
g++ -std=c++17 -I. main_demo.cpp compiler/vm/VirtualMachine.cpp compiler/codegen/CodeGenerator.cpp compiler/optimizer/Optimizer.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/parser/Parser.cpp compiler/parser/AST.cpp compiler/lexer/Lexer.cpp compiler/bytecode/BytecodeProgram.cpp compiler/bytecode/Bytecode.cpp -o compiler_demo.exe
```

## Writing Your Own Programs

When using Option 1, you can write programs like:

```javascript
let x = 10;
let y = 20;
let sum = x + y;
print sum;
END
```

## Viewing Demo Files

All demo files are in the `demos/` folder. You can view them with any text editor to see what code they contain before running them.

## Tips

- **Press Enter** to move between stages during the demo
- Try the **optimization demo** (demo5) to see constant folding in action
- Try the **error demos** (demo_error1 and demo_error2) to see how the compiler catches mistakes
- The compiler shows detailed explanations at each stage!

---

Enjoy exploring how compilers work! 🎓
