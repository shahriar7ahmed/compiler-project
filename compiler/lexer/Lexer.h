#ifndef LEXER_H
#define LEXER_H

#include "Token.h"
#include <string>
#include <vector>

class Lexer {
public:
    explicit Lexer(const std::string& source);
    
    // Get the next token from the source
    Token nextToken();
    
    // Peek at the next token without consuming it
    Token peekToken();
    
    // Get all tokens at once
    std::vector<Token> getAllTokens();
    
private:
    std::string source;
    size_t current;
    int line;
    int column;
    
    // Helper methods
    bool isAtEnd() const;
    char advance();
    char peek() const;
    char peekNext() const;
    void skipWhitespace();
    Token readNumber();
    Token readIdentifierOrKeyword();
    Token makeToken(TokenType type, const std::string& lexeme);
    bool isDigit(char c) const;
    bool isAlpha(char c) const;
    bool isAlphaNumeric(char c) const;
};

#endif
