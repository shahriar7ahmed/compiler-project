#include "Parser.h"
#include <sstream>

Parser::Parser(const std::vector<Token>& tokens) 
    : tokens(tokens), current(0) {}

// ===== Helper Methods =====

Token Parser::peek() const {
    return tokens[current];
}

Token Parser::previous() const {
    return tokens[current - 1];
}

Token Parser::advance() {
    if (!isAtEnd()) current++;
    return previous();
}

bool Parser::isAtEnd() const {
    return peek().type == TokenType::END_OF_FILE;
}

bool Parser::check(TokenType type) const {
    if (isAtEnd()) return false;
    return peek().type == type;
}

bool Parser::match(TokenType type) {
    if (check(type)) {
        advance();
        return true;
    }
    return false;
}

Token Parser::expect(TokenType type, const std::string& message) {
    if (check(type)) return advance();
    error(message);
    return peek(); // Never reached due to exception
}

void Parser::error(const std::string& message) {
    Token current = peek();
    std::ostringstream oss;
    oss << message << " at line " << current.line << ", column " << current.column;
    throw ParserError(oss.str(), current.line, current.column);
}

// ===== Main Parse Method =====

std::vector<std::unique_ptr<Statement>> Parser::parse() {
    std::vector<std::unique_ptr<Statement>> statements;
    
    while (!isAtEnd()) {
        statements.push_back(parseStatement());
    }
    
    return statements;
}

// ===== Statement Parsing =====

std::unique_ptr<Statement> Parser::parseStatement() {
    if (match(TokenType::LET)) {
        return parseLetStatement();
    }
    if (match(TokenType::PRINT)) {
        return parsePrintStatement();
    }
    
    error("Expected statement (let or print)");
    return nullptr; // Never reached
}

std::unique_ptr<Statement> Parser::parseLetStatement() {
    Token identifier = expect(TokenType::IDENTIFIER, "Expected variable name after 'let'");
    expect(TokenType::ASSIGN, "Expected '=' after variable name");
    
    auto expression = parseExpression();
    
    expect(TokenType::SEMICOLON, "Expected ';' after expression");
    
    return std::make_unique<LetStatement>(identifier.lexeme, std::move(expression));
}

std::unique_ptr<Statement> Parser::parsePrintStatement() {
    auto expression = parseExpression();
    expect(TokenType::SEMICOLON, "Expected ';' after expression");
    
    return std::make_unique<PrintStatement>(std::move(expression));
}

// ===== Expression Parsing (Precedence Climbing) =====

std::unique_ptr<Expression> Parser::parseExpression() {
    return parseComparison();
}

std::unique_ptr<Expression> Parser::parseComparison() {
    auto expr = parseTerm();
    
    while (match(TokenType::LESS_THAN) || match(TokenType::GREATER_THAN) ||
           match(TokenType::LESS_EQUAL) || match(TokenType::GREATER_EQUAL) ||
           match(TokenType::EQUAL_EQUAL) || match(TokenType::NOT_EQUAL)) {
        
        std::string op = previous().lexeme;
        auto right = parseTerm();
        expr = std::make_unique<BinaryOperation>(std::move(expr), op, std::move(right));
    }
    
    return expr;
}

std::unique_ptr<Expression> Parser::parseTerm() {
    auto expr = parseFactor();
    
    while (match(TokenType::PLUS) || match(TokenType::MINUS)) {
        std::string op = previous().lexeme;
        auto right = parseFactor();
        expr = std::make_unique<BinaryOperation>(std::move(expr), op, std::move(right));
    }
    
    return expr;
}

std::unique_ptr<Expression> Parser::parseFactor() {
    auto expr = parseUnary();
    
    while (match(TokenType::MULTIPLY) || match(TokenType::DIVIDE) || match(TokenType::MODULO)) {
        std::string op = previous().lexeme;
        auto right = parseUnary();
        expr = std::make_unique<BinaryOperation>(std::move(expr), op, std::move(right));
    }
    
    return expr;
}

std::unique_ptr<Expression> Parser::parseUnary() {
    // Integer literal
    if (match(TokenType::INTEGER)) {
        int value = std::stoi(previous().lexeme);
        return std::make_unique<IntegerLiteral>(value);
    }
    
    // Variable
    if (match(TokenType::IDENTIFIER)) {
        return std::make_unique<Variable>(previous().lexeme);
    }
    
    // Parenthesized expression
    if (match(TokenType::LPAREN)) {
        auto expr = parseExpression();
        expect(TokenType::RPAREN, "Expected ')' after expression");
        return expr;
    }
    
    error("Expected expression");
    return nullptr; // Never reached
}
