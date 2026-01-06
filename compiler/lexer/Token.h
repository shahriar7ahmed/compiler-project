#ifndef TOKEN_H
#define TOKEN_H

#include <string>
#include <ostream>

enum class TokenType {
    // Literals
    INTEGER,
    IDENTIFIER,
    
    // Keywords
    LET,
    PRINT,
    
    // Operators
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    ASSIGN,
    
    // Punctuation
    LPAREN,
    RPAREN,
    SEMICOLON,
    
    // Special
    END_OF_FILE,
    INVALID
};

struct Token {
    TokenType type;
    std::string lexeme;
    int line;
    int column;
    
    Token(TokenType t, const std::string& lex, int ln, int col)
        : type(t), lexeme(lex), line(ln), column(col) {}
    
    Token() : type(TokenType::INVALID), lexeme(""), line(0), column(0) {}
};

inline std::string tokenTypeToString(TokenType type) {
    switch (type) {
        case TokenType::INTEGER:     return "INTEGER";
        case TokenType::IDENTIFIER:  return "IDENTIFIER";
        case TokenType::LET:         return "LET";
        case TokenType::PRINT:       return "PRINT";
        case TokenType::PLUS:        return "PLUS";
        case TokenType::MINUS:       return "MINUS";
        case TokenType::MULTIPLY:    return "MULTIPLY";
        case TokenType::DIVIDE:      return "DIVIDE";
        case TokenType::ASSIGN:      return "ASSIGN";
        case TokenType::LPAREN:      return "LPAREN";
        case TokenType::RPAREN:      return "RPAREN";
        case TokenType::SEMICOLON:   return "SEMICOLON";
        case TokenType::END_OF_FILE: return "EOF";
        case TokenType::INVALID:     return "INVALID";
        default:                     return "UNKNOWN";
    }
}

inline std::ostream& operator<<(std::ostream& os, const Token& token) {
    os << "[" << tokenTypeToString(token.type) 
       << " '" << token.lexeme << "' "
       << "(" << token.line << ":" << token.column << ")]";
    return os;
}

#endif
