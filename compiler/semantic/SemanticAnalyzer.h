#ifndef SEMANTIC_ANALYZER_H
#define SEMANTIC_ANALYZER_H

#include "../parser/AST.h"
#include "SymbolTable.h"
#include <vector>
#include <string>
#include <stdexcept>

// Custom exception for semantic errors
class SemanticError : public std::runtime_error {
public:
    int line;
    int column;
    
    SemanticError(const std::string& message, int ln, int col)
        : std::runtime_error(message), line(ln), column(col) {}
};

class SemanticAnalyzer {
public:
    explicit SemanticAnalyzer(const std::vector<std::unique_ptr<Statement>>& program);
    
    // Analyze the program and collect errors
    void analyze();
    
    // Get all collected errors
    const std::vector<SemanticError>& getErrors() const { return errors; }
    
    // Check if analysis found any errors
    bool hasErrors() const { return !errors.empty(); }
    
private:
    const std::vector<std::unique_ptr<Statement>>& program;
    SymbolTable symbolTable;
    std::vector<SemanticError> errors;
    
    // Visitor methods
    void visitStatement(Statement* stmt);
    void visitLetStatement(LetStatement* stmt);
    void visitPrintStatement(PrintStatement* stmt);
    void visitIfStatement(IfStatement* stmt);          // NEW
    void visitForStatement(ForStatement* stmt);        // NEW
    void visitExpression(Expression* expr);
    void visitBinaryOperation(BinaryOperation* expr);
    void visitComparisonExpression(ComparisonExpression* expr);  // NEW
    void visitLogicalExpression(LogicalExpression* expr);        // NEW
    void visitUnaryExpression(UnaryExpression* expr);            // NEW
    void visitVariable(Variable* expr);
    void visitIntegerLiteral(IntegerLiteral* expr);
    
    // Helper to add errors
    void addError(const std::string& message, int line, int column);
};

#endif
