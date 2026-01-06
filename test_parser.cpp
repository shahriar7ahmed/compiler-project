#include "compiler/parser/Parser.h"
#include "compiler/lexer/Lexer.h"
#include <iostream>
#include <vector>

void testParser(const std::string& testName, const std::string& source, bool shouldFail = false) {
    std::cout << "\n========================================\n";
    std::cout << "Test: " << testName << "\n";
    std::cout << "========================================\n";
    std::cout << "Source:\n" << source << "\n\n";
    
    try {
        // Tokenize
        Lexer lexer(source);
        std::vector<Token> tokens = lexer.getAllTokens();
        
        // Parse
        Parser parser(tokens);
        auto statements = parser.parse();
        
        if (shouldFail) {
            std::cout << "❌ FAILED: Expected parser error but succeeded\n";
            return;
        }
        
        std::cout << "✅ Parsing succeeded!\n";
        std::cout << "\nAST:\n";
        std::cout << "Program\n";
        for (const auto& stmt : statements) {
            stmt->print(1);
        }
        
    } catch (const ParserError& e) {
        if (shouldFail) {
            std::cout << "✅ Expected error caught: " << e.what() << "\n";
        } else {
            std::cout << "❌ Parser Error: " << e.what() << "\n";
        }
    } catch (const std::exception& e) {
        std::cout << "❌ Unexpected Error: " << e.what() << "\n";
    }
}

int main() {
    std::cout << "╔════════════════════════════════════════╗\n";
    std::cout << "║  Educational Compiler - Parser Tests  ║\n";
    std::cout << "╚════════════════════════════════════════╝\n";
    
    // Test 1: Simple variable declaration
    testParser(
        "Simple Variable Declaration",
        "let x = 42;"
    );
    
    // Test 2: Variable with addition
    testParser(
        "Addition Expression",
        "let y = 10 + 20;"
    );
    
    // Test 3: Operator precedence (multiplication before addition)
    testParser(
        "Operator Precedence: 2 + 3 * 4",
        "let z = 2 + 3 * 4;"
    );
    
    // Test 4: Parentheses override precedence
    testParser(
        "Parentheses: (2 + 3) * 4",
        "let a = (2 + 3) * 4;"
    );
    
    // Test 5: Modulo operator
    testParser(
        "Modulo Operator",
        "let m = 10 % 3;"
    );
    
    // Test 6: Division
    testParser(
        "Division",
        "let d = 100 / 5;"
    );
    
    // Test 7: Comparison operators - less than
    testParser(
        "Comparison: Less Than",
        "let result = x < 10;"
    );
    
    // Test 8: Comparison operators - equal
    testParser(
        "Comparison: Equal",
        "let flag = a == b;"
    );
    
    // Test 9: Comparison operators - not equal
    testParser(
        "Comparison: Not Equal",
        "let check = x != 0;"
    );
    
    // Test 10: Greater than or equal
    testParser(
        "Comparison: Greater or Equal",
        "let valid = age >= 18;"
    );
    
    // Test 11: Print statement
    testParser(
        "Print Statement",
        "print x + 10;"
    );
    
    // Test 12: Multiple statements
    testParser(
        "Multiple Statements",
        "let x = 10;\n"
        "let y = 20;\n"
        "print x + y;"
    );
    
    // Test 13: Complex nested expression
    testParser(
        "Complex Expression",
        "let result = (100 - 50) / (3 + 2) * 4;"
    );
    
    // Test 14: Mixed operators with precedence
    testParser(
        "Mixed Operators",
        "let value = 2 + 3 * 4 - 5 / 2 + 1;"
    );
    
    // Test 15: Comparison with arithmetic
    testParser(
        "Comparison with Arithmetic",
        "let test = x + 5 > y * 2;"
    );
    
    // === Error Cases ===
    
    // Test 16: Missing semicolon
    testParser(
        "Error: Missing Semicolon",
        "let x = 42",
        true  // Should fail
    );
    
    // Test 17: Missing expression
    testParser(
        "Error: Missing Expression after =",
        "let x = ;",
        true  // Should fail
    );
    
    // Test 18: Missing closing parenthesis
    testParser(
        "Error: Unclosed Parenthesis",
        "let x = (10 + 5;",
        true  // Should fail
    );
    
    // Test 19: Invalid statement
    testParser(
        "Error: Invalid Statement",
        "42 + 10;",
        true  // Should fail
    );
    
    // Test 20: Missing variable name
    testParser(
        "Error: Missing Variable Name",
        "let = 42;",
        true  // Should fail
    );
    
    std::cout << "\n╔════════════════════════════════════════╗\n";
    std::cout << "║          All Tests Completed!          ║\n";
    std::cout << "╚════════════════════════════════════════╝\n";
    
    return 0;
}
