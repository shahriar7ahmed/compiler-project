#ifndef PARSER_H
#define PARSER_H

#include "AST.h"
#include "../lexer/Token.h"
#include <vector>
#include <string>
#include <stdexcept>

// Custom exception for parser errors
class ParserError : public std::runtime_error {
public:
    int line;
    int column;
    
    ParserError(const std::string& message, int ln, int col)
        : std::runtime_error(message), line(ln), column(col) {}
};

// Recursive descent parser
class Parser {
public:
    explicit Parser(const std::vector<Token>& tokens);
    
    // Parse the entire program
    std::vector<std::unique_ptr<Statement>> parse();
    
private:
    std::vector<Token> tokens;
    size_t current;
    
    // Helper methods
    Token peek() const;
    Token previous() const;
    Token advance();
    bool isAtEnd() const;
    bool check(TokenType type) const;
    bool match(TokenType type);
    Token expect(TokenType type, const std::string& message);
    void error(const std::string& message);
    
    // Parsing methods (in order of precedence, lowest to highest)
    std::unique_ptr<Statement> parseStatement();
    std::unique_ptr<Statement> parseLetStatement();
    std::unique_ptr<Statement> parsePrintStatement();
    std::unique_ptr<Statement> parseIfStatement();        // NEW: if-else statements
    std::unique_ptr<Statement> parseForStatement();       // NEW: for loops
    std::vector<std::unique_ptr<Statement>> parseBlock(); // NEW: parse { statements }
    
    std::unique_ptr<Expression> parseExpression();      // Entry point for expressions
    std::unique_ptr<Expression> parseLogical();         // NEW: Logical: &&, ||
    std::unique_ptr<Expression> parseComparison();      // Comparison: <, >, ==, !=, <=, >=
    std::unique_ptr<Expression> parseTerm();            // Addition/Subtraction: +, -
    std::unique_ptr<Expression> parseFactor();          // Multiplication/Division/Modulo: *, /, %
    std::unique_ptr<Expression> parseUnary();           // NEW: Unary: !, and primary (literals, variables, parens)
};

#endif
