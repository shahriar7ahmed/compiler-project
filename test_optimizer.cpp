#include "compiler/optimizer/Optimizer.h"
#include "compiler/parser/Parser.h"
#include "compiler/lexer/Lexer.h"
#include <iostream>

void printAST(const std::vector<std::unique_ptr<Statement>>& program, const std::string& title) {
    std::cout << title << "\n";
    std::cout << "Program\n";
    for (const auto& stmt : program) {
        stmt->print(1);
    }
    std::cout << "\n";
}

void testOptimization(const std::string& testName, const std::string& source, bool expectOptimization = true) {
    std::cout << "════════════════════════════════════════\n";
    std::cout << "Test: " << testName << "\n";
    std::cout << "════════════════════════════════════════\n";
    std::cout << "Source:\n" << source << "\n\n";
    
    try {
        // Parse
        Lexer lexer(source);
        auto tokens = lexer.getAllTokens();
        Parser parser(tokens);
        auto program = parser.parse();
        
        // Print original AST
        printAST(program, "Original AST:");
        
        // Optimize
        Optimizer optimizer;
        optimizer.optimize(program);
        
        // Print optimized AST
        printAST(program, "Optimized AST:");
        
        int count = optimizer.getOptimizationCount();
        if (expectOptimization) {
            if (count > 0) {
                std::cout << "✅ " << count << " optimization(s) applied!\n";
            } else {
                std::cout << "⚠️  Expected optimization but none applied\n";
            }
        } else {
            if (count == 0) {
                std::cout << "✅ No optimization needed (as expected)\n";
            } else {
                std::cout << "⚠️  Unexpected optimization: " << count << "\n";
            }
        }
        
    } catch (const std::exception& e) {
        std::cout << "❌ Error: " << e.what() << "\n";
    }
    
    std::cout << "\n";
}

int main() {
    std::cout << "╔════════════════════════════════════════════╗\n";
    std::cout << "║  Educational Compiler - Optimizer Tests   ║\n";
    std::cout << "╚════════════════════════════════════════════╝\n\n";
    
    // Test 1: Simple constant folding
    testOptimization(
        "Constant Folding: Addition",
        "let x = 2 + 3;"
    );
    
    // Test 2: Constant folding with multiplication
    testOptimization(
        "Constant Folding: Multiplication",
        "let y = 4 * 5;"
    );
    
    // Test 3: Complex expression
    testOptimization(
        "Constant Folding: Complex Expression",
        "let z = 2 + 3 * 4;"
    );
    
    // Test 4: Nested operations
    testOptimization(
        "Constant Folding: Nested Operations",
        "let result = (10 + 5) * (8 - 3);"
    );
    
    // Test 5: Constant propagation
    testOptimization(
        "Constant Propagation",
        "let a = 10;\n"
        "let b = a + 5;"
    );
    
    // Test 6: Multiple constant propagation
    testOptimization(
        "Multiple Constant Propagation",
        "let x = 5;\n"
        "let y = 3;\n"
        "let sum = x + y;\n"
        "print sum;"
    );
    
    // Test 7: Comparison operators
    testOptimization(
        "Constant Folding: Comparisons",
        "let flag = 10 > 5;\n"
        "let check = 3 == 3;"
    );
    
    // Test 8: Modulo operation
    testOptimization(
        "Constant Folding: Modulo",
        "let remainder = 10 % 3;"
    );
    
    // Test 9: No optimization needed (already optimized)
    testOptimization(
        "No Optimization Needed",
        "let x = 42;",
        false
    );
    
    // Test 10: Mixed - some optimizable, some not
    testOptimization(
        "Mixed Optimization",
        "let a = 2 + 3;\n"
        "let b = a;\n"
        "print b;"
    );
    
    // Test 11: Division
    testOptimization(
        "Constant Folding: Division",
        "let quotient = 20 / 4;"
    );
    
    // Test 12: Subtraction
    testOptimization(
        "Constant Folding: Subtraction",
        "let diff = 100 - 42;"
    );
    
    std::cout << "╔════════════════════════════════════════════╗\n";
    std::cout << "║          All Tests Completed!              ║\n";
    std::cout << "╚════════════════════════════════════════════╝\n";
    
    return 0;
}
