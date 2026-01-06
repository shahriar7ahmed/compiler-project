#include "compiler/lexer/Lexer.h"
#include <iostream>
#include <vector>

void testLexer(const std::string& testName, const std::string& source) {
    std::cout << "\n=== Test: " << testName << " ===\n";
    std::cout << "Source: " << source << "\n";
    std::cout << "Tokens:\n";
    
    Lexer lexer(source);
    std::vector<Token> tokens = lexer.getAllTokens();
    
    for (const auto& token : tokens) {
        std::cout << "  " << token << "\n";
    }
}

int main() {
    std::cout << "Educational Compiler - Lexer Test Suite\n";
    std::cout << "========================================\n";
    
    // Test 1: Simple variable declaration
    testLexer("Variable Declaration", "let x = 42;");
    
    // Test 2: Print statement
    testLexer("Print Statement", "print x;");
    
    // Test 3: Arithmetic expression
    testLexer("Arithmetic Expression", "let result = (a + b) * 2;");
    
    // Test 4: Multiple statements
    testLexer("Multiple Statements", 
        "let x = 10;\n"
        "let y = 20;\n"
        "print x + y;");
    
    // Test 5: Complex expression
    testLexer("Complex Expression", "let z = (100 - 50) / (3 + 2);");
    
    // Test 6: Keywords vs identifiers
    testLexer("Keywords vs Identifiers", "let letter = 1; print printer;");
    
    // Test 7: Invalid character
    testLexer("Invalid Character", "let x = 42 @ 10;");
    
    // Test 8: Empty input
    testLexer("Empty Input", "");
    
    // Test 9: Whitespace handling
    testLexer("Whitespace Handling", "let   x  =   42  ;");
    
    // Test 10: All operators
    testLexer("All Operators", "a + b - c * d / e = f;");
    
    std::cout << "\n========================================\n";
    std::cout << "All tests completed!\n";
    
    return 0;
}
