#include "Lexer.h"
#include <cctype>

Lexer::Lexer(const std::string& source) 
    : source(source), current(0), line(1), column(1) {}

bool Lexer::isAtEnd() const {
    return current >= source.length();
}

char Lexer::advance() {
    if (isAtEnd()) return '\0';
    char c = source[current++];
    column++;
    return c;
}

char Lexer::peek() const {
    if (isAtEnd()) return '\0';
    return source[current];
}

char Lexer::peekNext() const {
    if (current + 1 >= source.length()) return '\0';
    return source[current + 1];
}

void Lexer::skipWhitespace() {
    while (!isAtEnd()) {
        char c = peek();
        switch (c) {
            case ' ':
            case '\r':
            case '\t':
                advance();
                break;
            case '\n':
                advance();
                line++;
                column = 1;
                break;
            default:
                return;
        }
    }
}

bool Lexer::isDigit(char c) const {
    return c >= '0' && c <= '9';
}

bool Lexer::isAlpha(char c) const {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

bool Lexer::isAlphaNumeric(char c) const {
    return isAlpha(c) || isDigit(c);
}

Token Lexer::makeToken(TokenType type, const std::string& lexeme) {
    return Token(type, lexeme, line, column - lexeme.length());
}

Token Lexer::readNumber() {
    int startColumn = column;
    std::string number;
    
    while (isDigit(peek())) {
        number += advance();
    }
    
    return Token(TokenType::INTEGER, number, line, startColumn);
}

Token Lexer::readIdentifierOrKeyword() {
    int startColumn = column;
    std::string identifier;
    
    while (isAlphaNumeric(peek())) {
        identifier += advance();
    }
    
    // Check for keywords
    TokenType type = TokenType::IDENTIFIER;
    if (identifier == "let") {
        type = TokenType::LET;
    } else if (identifier == "print") {
        type = TokenType::PRINT;
    }
    
    return Token(type, identifier, line, startColumn);
}

Token Lexer::nextToken() {
    skipWhitespace();
    
    if (isAtEnd()) {
        return Token(TokenType::END_OF_FILE, "", line, column);
    }
    
    char c = peek();
    int startColumn = column;
    
    // Numbers
    if (isDigit(c)) {
        return readNumber();
    }
    
    // Identifiers and keywords
    if (isAlpha(c)) {
        return readIdentifierOrKeyword();
    }
    
    // Operators and punctuation
    advance();
    switch (c) {
        case '+': return Token(TokenType::PLUS, "+", line, startColumn);
        case '-': return Token(TokenType::MINUS, "-", line, startColumn);
        case '*': return Token(TokenType::MULTIPLY, "*", line, startColumn);
        case '/': return Token(TokenType::DIVIDE, "/", line, startColumn);
        case '%': return Token(TokenType::MODULO, "%", line, startColumn);
        case '(': return Token(TokenType::LPAREN, "(", line, startColumn);
        case ')': return Token(TokenType::RPAREN, ")", line, startColumn);
        case ';': return Token(TokenType::SEMICOLON, ";", line, startColumn);
        
        // Two-character operators
        case '=':
            if (peek() == '=') {
                advance();
                return Token(TokenType::EQUAL_EQUAL, "==", line, startColumn);
            }
            return Token(TokenType::ASSIGN, "=", line, startColumn);
        
        case '<':
            if (peek() == '=') {
                advance();
                return Token(TokenType::LESS_EQUAL, "<=", line, startColumn);
            }
            return Token(TokenType::LESS_THAN, "<", line, startColumn);
        
        case '>':
            if (peek() == '=') {
                advance();
                return Token(TokenType::GREATER_EQUAL, ">=", line, startColumn);
            }
            return Token(TokenType::GREATER_THAN, ">", line, startColumn);
        
        case '!':
            if (peek() == '=') {
                advance();
                return Token(TokenType::NOT_EQUAL, "!=", line, startColumn);
            }
            return Token(TokenType::INVALID, "!", line, startColumn);
        
        default:
            return Token(TokenType::INVALID, std::string(1, c), line, startColumn);
    }
}

Token Lexer::peekToken() {
    // Save current state
    size_t savedCurrent = current;
    int savedLine = line;
    int savedColumn = column;
    
    // Get next token
    Token token = nextToken();
    
    // Restore state
    current = savedCurrent;
    line = savedLine;
    column = savedColumn;
    
    return token;
}

std::vector<Token> Lexer::getAllTokens() {
    std::vector<Token> tokens;
    
    while (true) {
        Token token = nextToken();
        tokens.push_back(token);
        
        if (token.type == TokenType::END_OF_FILE) {
            break;
        }
    }
    
    return tokens;
}
