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
    
    // Arithmetic Operators
    PLUS,
    MINUS,
    MULTIPLY,
    DIVIDE,
    MODULO,
    ASSIGN,
    
    // Comparison Operators
    LESS_THAN,
    GREATER_THAN,
    LESS_EQUAL,
    GREATER_EQUAL,
    EQUAL_EQUAL,
    NOT_EQUAL,
    
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
        case TokenType::MODULO:      return "MODULO";
        case TokenType::ASSIGN:      return "ASSIGN";
        case TokenType::LESS_THAN:   return "LESS_THAN";
        case TokenType::GREATER_THAN: return "GREATER_THAN";
        case TokenType::LESS_EQUAL:  return "LESS_EQUAL";
        case TokenType::GREATER_EQUAL: return "GREATER_EQUAL";
        case TokenType::EQUAL_EQUAL: return "EQUAL_EQUAL";
        case TokenType::NOT_EQUAL:   return "NOT_EQUAL";
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
