# Educational Compiler Web Interface

This is the web-based frontend for the Educational Compiler project. It provides an interactive interface to write code, load demos, and visualize the compilation process step-by-step.

## Prerequisites

- **Node.js** (v14 or higher)
- **C++ Compiler** (g++) - To build the backend executable
- The backend `compiler_web_api.exe` must be built and located in the project root (one level up).

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    cd web-app
    npm install
    ```

2.  **Build the Backend**:
    From the project root directory (parent of `web-app`), run:
    ```bash
    g++ -std=c++17 -I. main_web_api.cpp compiler/lexer/Lexer.cpp compiler/parser/AST.cpp compiler/parser/Parser.cpp compiler/semantic/SemanticAnalyzer.cpp compiler/semantic/SymbolTable.cpp compiler/codegen/CodeGenerator.cpp compiler/bytecode/Bytecode.cpp compiler/bytecode/BytecodeProgram.cpp compiler/vm/VirtualMachine.cpp compiler/optimizer/Optimizer.cpp -o compiler_web_api.exe
    ```

3.  **Start the Server**:
    ```bash
    npm start
    ```

4.  **Access the Application**:
    Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

## Features

- **Interactive Editor**: Write code directly in the browser.
- **Stage Visualization**: View the output of Lexer, Parser (AST), Semantic Analyzer, Optimizer, Code Generator, and VM Execution.
- **Control Flow Support**: Full support for `if-else` and `for` loops.
- **Demo Library**: Includes 12 pre-loaded examples covering variables, arithmetic, logic, and errors.

## Screenshots

### Interface & Stages
![Compiler Interface](../images/Screenshot%202026-01-10%20190644.png)

### Execution Output
![Execution Result](../images/Screenshot%202026-01-10%20190843.png)

## Troubleshooting

- **Server fails to start?**
    - Check if port 3000 is in use.
    - Ensure `compiler_web_api.exe` exists in the root directory.
- **Compilation errors?**
    - Check the console logs for detailed error messages.
    - Ensure the backend was rebuilt if you modified C++ files.
