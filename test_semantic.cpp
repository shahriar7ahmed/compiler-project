#include "compiler/semantic/SemanticAnalyzer.h"
#include "compiler/parser/Parser.h"
#include "compiler/lexer/Lexer.h"
#include <iostream>

void testSemantic(const std::string& testName, const std::string& source, bool shouldFail = false) {
    std::cout << "\n========================================\n";
    std::cout << "Test: " << testName << "\n";
    std::cout << "========================================\n";
    std::cout << "Source:\n" << source << "\n\n";
    
    try {
        // Tokenize
        Lexer lexer(source);
        auto tokens = lexer.getAllTokens();
        
        // Parse
        Parser parser(tokens);
        auto program = parser.parse();
        
        // Semantic Analysis
        SemanticAnalyzer analyzer(program);
        analyzer.analyze();
        
        if (analyzer.hasErrors()) {
            if (shouldFail) {
                std::cout << "✅ Semantic errors detected as expected:\n";
            } else {
                std::cout << "❌ Unexpected semantic errors:\n";
            }
            
            for (const auto& error : analyzer.getErrors()) {
                std::cout << "  • " << error.what() 
                         << " at line " << error.line 
                         << ", column " << error.column << "\n";
            }
        } else {
            if (shouldFail) {
                std::cout << "❌ FAILED: Expected semantic errors but none found\n";
            } else {
                std::cout << "✅ Semantic analysis passed! No errors.\n";
            }
        }
        
    } catch (const ParserError& e) {
        std::cout << "❌ Parser Error: " << e.what() << "\n";
    } catch (const std::exception& e) {
        std::cout << "❌ Unexpected Error: " << e.what() << "\n";
    }
}

int main() {
    std::cout << "╔════════════════════════════════════════════╗\n";
    std::cout << "║  Educational Compiler - Semantic Tests    ║\n";
    std::cout << "╚════════════════════════════════════════════╝\n";
    
    // ===== Valid Programs =====
    
    // Test 1: Simple variable declaration and use
    testSemantic(
        "Valid: Simple Declaration and Use",
        "let x = 42;\n"
        "print x;"
    );
    
    // Test 2: Multiple variables
    testSemantic(
        "Valid: Multiple Variables",
        "let a = 10;\n"
        "let b = 20;\n"
        "print a + b;"
    );
    
    // Test 3: Variable used in expression
    testSemantic(
        "Valid: Variable in Expression",
        "let x = 10;\n"
        "let y = x + 5;\n"
        "print y;"
    );
    
    // Test 4: Complex expression with multiple variables
    testSemantic(
        "Valid: Complex Expression",
        "let a = 5;\n"
        "let b = 10;\n"
        "let c = 3;\n"
        "let result = (a + b) * c - 2;\n"
        "print result;"
    );
    
    // Test 5: Arithmetic with all operators
    testSemantic(
        "Valid: All Operators",
        "let x = 100;\n"
        "let y = 7;\n"
        "let z = x / y;\n"
        "let m = x % y;\n"
        "print z + m;"
    );
    
    // Test 6: Comparison operators
    testSemantic(
        "Valid: Comparisons",
        "let age = 25;\n"
        "let limit = 18;\n"
        "let isAdult = age >= limit;\n"
        "print isAdult;"
    );
    
    // ===== Semantic Error Cases =====
    
    // Test 7: Undefined variable
    testSemantic(
        "Error: Undefined Variable",
        "print x;",
        true  // Should fail
    );
    
    // Test 8: Variable used before declaration
    testSemantic(
        "Error: Use Before Declaration",
        "let y = x + 1;\n"
        "let x = 5;",
        true  // Should fail
    );
    
    // Test 9: Duplicate declaration
    testSemantic(
        "Error: Duplicate Declaration",
        "let x = 10;\n"
        "let x = 20;",
        true  // Should fail
    );
    
    // Test 10: Multiple undefined variables
    testSemantic(
        "Error: Multiple Undefined Variables",
        "print a + b + c;",
        true  // Should fail
    );
    
    // Test 11: Mixed valid and invalid
    testSemantic(
        "Error: Mixed Valid/Invalid",
        "let x = 10;\n"
        "print x + y;",
        true  // Should fail (y undefined)
    );
    
    // Test 12: Undefined in complex expression
    testSemantic(
        "Error: Undefined in Expression",
        "let a = 5;\n"
        "let result = (a + b) * c;",
        true  // Should fail (b and c undefined)
    );
    
    // Test 13: Redeclaration with usage
    testSemantic(
        "Error: Redeclare After Use",
        "let x = 5;\n"
        "print x;\n"
        "let x = 10;",
        true  // Should fail
    );
    
    // Test 14: Only declaration, no error
    testSemantic(
        "Valid: Declaration Without Use",
        "let x = 42;\n"
        "let y = 100;"
    );
    
    // Test 15: Undefined in nested expression
    testSemantic(
        "Error: Undefined in Nested Expression",
        "let x = 5;\n"
        "let y = (x + z) * 2;",
        true  // Should fail (z undefined)
    );
    
    std::cout << "\n╔════════════════════════════════════════════╗\n";
    std::cout << "║          All Tests Completed!              ║\n";
    std::cout << "╚════════════════════════════════════════════╝\n";
    
    return 0;
}
