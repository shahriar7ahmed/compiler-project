#include "compiler/vm/VirtualMachine.h"
#include "compiler/codegen/CodeGenerator.h"
#include "compiler/optimizer/Optimizer.h"
#include "compiler/semantic/SemanticAnalyzer.h"
#include "compiler/parser/Parser.h"
#include "compiler/lexer/Lexer.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cstdlib>
#include <limits>

// Helper functions for beautiful output
void printHeader(const std::string& title) {
    std::cout << "\n";
    std::cout << "════════════════════════════════════════════════════════════\n";
    std::cout << "                    " << title << "\n";
    std::cout << "════════════════════════════════════════════════════════════\n\n";
}

void printStage(int stageNum, const std::string& stageName) {
    std::cout << "\n";
    std::cout << "════════════════════════════════════════════════════════════\n";
    std::cout << "                   STAGE " << stageNum << " of 6\n";
    std::cout << "              " << stageName << "\n";
    std::cout << "════════════════════════════════════════════════════════════\n\n";
}

void printSeparator() {
    std::cout << "──────────────────────────────────────────────────────────\n";
}

void waitForUser() {
    std::cout << "\nPress Enter to continue to next stage...";
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

std::string readFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open file: " + filename);
    }
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

int main() {
    std::cout << "╔═══════════════════════════════════════════════════════════╗\n";
    std::cout << "║                                                           ║\n";
    std::cout << "║        EDUCATIONAL COMPILER DEMONSTRATION                 ║\n";
    std::cout << "║        Step-by-Step Compilation Process                   ║\n";
    std::cout << "║                                                           ║\n";
    std::cout << "╚═══════════════════════════════════════════════════════════╝\n";
    
    while (true) {
        printHeader("Choose your input method");
        std::cout << "  [1] Write code directly\n";
        std::cout << "  [2] Load from demo file\n";
        std::cout << "  [3] Exit\n\n";
        std::cout << "Enter your choice (1, 2, or 3): ";
        
        int choice;
        std::cin >> choice;
        std::cin.ignore(); // Clear newline
        
        if (choice == 3) {
            std::cout << "\nThank you for using the Educational Compiler!\n";
            break;
        }
        
        std::string source;
        
        if (choice == 1) {
            printHeader("Direct Code Input");
            std::cout << "Enter your code (type 'END' on a new line when done):\n";
            std::string line;
            while (std::getline(std::cin, line)) {
                if (line == "END") break;
                source += line + "\n";
            }
        }
        else if (choice == 2) {
            printHeader("Available Demo Files");
            std::cout << "  [1] demo1.txt                 - Simple variable declaration\n";
            std::cout << "  [2] demo2.txt                 - Arithmetic expressions\n";
            std::cout << "  [3] demo3.txt                 - Complex expression\n";
            std::cout << "  [4] demo4.txt                 - Comparison operators\n";
            std::cout << "  [5] demo5_optimization.txt    - Optimization showcase\n";
            std::cout << "  [6] demo_error1.txt           - Undefined variable error\n";
            std::cout << "  [7] demo_error2.txt           - Duplicate declaration error\n\n";
            std::cout << "Select file (1-7): ";
            
            int fileChoice;
            std::cin >> fileChoice;
            std::cin.ignore();
            
            std::string filename;
            switch (fileChoice) {
                case 1: filename = "demos/demo1.txt"; break;
                case 2: filename = "demos/demo2.txt"; break;
                case 3: filename = "demos/demo3.txt"; break;
                case 4: filename = "demos/demo4.txt"; break;
                case 5: filename = "demos/demo5_optimization.txt"; break;
                case 6: filename = "demos/demo_error1.txt"; break;
                case 7: filename = "demos/demo_error2.txt"; break;
                default:
                    std::cout << "Invalid choice!\n";
                    continue;
            }
            
            try {
                source = readFile(filename);
                std::cout << "\nLoading: " << filename << "\n";
            } catch (const std::exception& e) {
                std::cout << "Error: " << e.what() << "\n";
                continue;
            }
        }
        else {
            std::cout << "Invalid choice!\n";
            continue;
        }
        
        // Show source code
        printSeparator();
        std::cout << source;
        printSeparator();
        std::cout << "\nPress Enter to start compilation...";
        std::cin.get();
        
        try {
            // === STAGE 1: LEXICAL ANALYSIS ===
            printStage(1, "LEXICAL ANALYSIS (Tokenizer)");
            std::cout << "What happens here:\n";
            std::cout << "→ Source code is broken into tokens (smallest meaningful units)\n";
            std::cout << "→ Keywords, identifiers, operators, and literals are recognized\n\n";
            
            std::cout << "Source Code:\n";
            printSeparator();
            std::cout << source;
            printSeparator();
            std::cout << "\n";
            
            Lexer lexer(source);
            auto tokens = lexer.getAllTokens();
            
            std::cout << "Tokens Generated (" << tokens.size() << " tokens):\n";
            for (size_t i = 0; i < tokens.size(); ++i) {
                std::cout << "  [" << (i+1) << "] " << tokens[i] << "\n";
            }
            
            std::cout << "\n✅ Lexical Analysis Complete - " << tokens.size() << " tokens generated\n";
            waitForUser();
            
            // === STAGE 2: SYNTAX ANALYSIS ===
            printStage(2, "SYNTAX ANALYSIS (Parser)");
            std::cout << "What happens here:\n";
            std::cout << "→ Tokens are analyzed for grammatical structure\n";
            std::cout << "→ Abstract Syntax Tree (AST) is built\n";
            std::cout << "→ Syntax errors are detected\n\n";
            
            Parser parser(tokens);
            auto program = parser.parse();
            
            std::cout << "AST Structure:\n";
            std::cout << "Program\n";
            for (const auto& stmt : program) {
                stmt->print(1);
            }
            
            std::cout << "\n✅ Parsing Complete - AST successfully built\n";
            std::cout << "   No syntax errors found!\n";
            waitForUser();
            
            // === STAGE 3: SEMANTIC ANALYSIS ===
            printStage(3, "SEMANTIC ANALYSIS");
            std::cout << "What happens here:\n";
            std::cout << "→ Variable declarations are tracked in symbol table\n";
            std::cout << "→ Variable usage is validated (defined before use)\n";
            std::cout << "→ Semantic errors are detected\n\n";
            
            SemanticAnalyzer analyzer(program);
            analyzer.analyze();
            
            if (analyzer.hasErrors()) {
                std::cout << "❌ SEMANTIC ERRORS DETECTED!\n\n";
                printSeparator();
                for (const auto& error : analyzer.getErrors()) {
                    std::cout << "  Error: " << error.what() << "\n";
                    std::cout << "  Location: Line " << error.line << ", Column " << error.column << "\n\n";
                }
                printSeparator();
                
                std::cout << "\nHow compilers handle this:\n";
                std::cout << "  → Error detected during semantic analysis\n";
                std::cout << "  → Compilation STOPS here\n";
                std::cout << "  → Code generation and execution are skipped\n";
                std::cout << "  → User must fix the error and recompile\n\n";
                
                std::cout << "Compilation failed. Please fix errors and try again.\n";
                continue; // Back to menu
            }
            
            std::cout << "Symbol Table: (variables declared)\n";
            // Simple display - we know variables from LetStatements
            int varCount = 0;
            for (const auto& stmt : program) {
                if (auto* letStmt = dynamic_cast<LetStatement*>(stmt.get())) {
                    std::cout << "  • " << letStmt->identifier 
                              << " (declared at line " << letStmt->line << ")\n";
                    varCount++;
                }
            }
            if (varCount == 0) {
                std::cout << "  (no variables declared)\n";
            }
            
            std::cout << "\n✅ Semantic Analysis Complete\n";
            std::cout << "   No semantic errors found!\n";
            waitForUser();
            
            // === STAGE 4: CODE OPTIMIZATION ===
            printStage(4, "CODE OPTIMIZATION");
            std::cout << "What happens here:\n";
            std::cout << "→ Constant expressions are evaluated at compile-time\n";
            std::cout << "→ Variable values are propagated when possible\n";
            std::cout << "→ Code efficiency is improved\n\n";
            
            Optimizer optimizer;
            optimizer.optimize(program);
            
            int optCount = optimizer.getOptimizationCount();
            if (optCount > 0) {
                std::cout << "Optimizations Applied: " << optCount << "\n\n";
                std::cout << "Optimized AST:\n";
                std::cout << "Program\n";
                for (const auto& stmt : program) {
                    stmt->print(1);
                }
                std::cout << "\n✅ " << optCount << " optimization(s) applied\n";
            } else {
                std::cout << "✅ No optimizations needed (code already optimal)\n";
            }
            waitForUser();
            
            // === STAGE 5: CODE GENERATION ===
            printStage(5, "CODE GENERATION");
            std::cout << "What happens here:\n";
            std::cout << "→ AST is traversed and converted to bytecode\n";
            std::cout << "→ Bytecode is intermediate representation for the VM\n";
            std::cout << "→ Stack-based instructions are generated\n\n";
            
            CodeGenerator codegen;
            BytecodeProgram bytecode = codegen.generate(program);
            
            std::cout << "Generated Bytecode (Intermediate Code):\n";
            bytecode.print();
            
            std::cout << "\n✅ Code Generation Complete\n";
            std::cout << "   " << bytecode.size() << " instructions generated\n";
            waitForUser();
            
            // === STAGE 6: EXECUTION ===
            printStage(6, "BYTECODE EXECUTION (Virtual Machine)");
            std::cout << "What happens here:\n";
            std::cout << "→ Bytecode is executed by the virtual machine\n";
            std::cout << "→ Stack-based operations are performed\n";
            std::cout << "→ Results are produced\n\n";
            
            VirtualMachine vm;
            
            std::cout << "Program Output:\n";
            printSeparator();
            vm.execute(bytecode);
            printSeparator();
            
            std::cout << "\n✅ Execution Complete!\n";
            std::cout << "   " << vm.getInstructionCount() << " instructions executed\n\n";
            
            // === SUMMARY ===
            printHeader("COMPILATION SUMMARY");
            std::cout << "All Stages Completed Successfully! ✅\n\n";
            std::cout << "  ✓ Stage 1: Lexical Analysis   - " << tokens.size() << " tokens\n";
            std::cout << "  ✓ Stage 2: Syntax Analysis    - AST built\n";
            std::cout << "  ✓ Stage 3: Semantic Analysis  - Validated\n";
            std::cout << "  ✓ Stage 4: Optimization        - " << optCount << " optimization(s)\n";
            std::cout << "  ✓ Stage 5: Code Generation     - " << bytecode.size() << " instructions\n";
            std::cout << "  ✓ Stage 6: Execution           - " << vm.getInstructionCount() << " instructions executed\n\n";
            printSeparator();
            
        } catch (const ParserError& e) {
            std::cout << "\n❌ SYNTAX ERROR!\n";
            std::cout << "Error: " << e.what() << "\n";
            std::cout << "Location: Line " << e.line << ", Column " << e.column << "\n";
        } catch (const std::exception& e) {
            std::cout << "\n❌ ERROR!\n";
            std::cout << e.what() << "\n";
        }
        
        std::cout << "\n";
    }
    
    return 0;
}
