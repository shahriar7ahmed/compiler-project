#include "SemanticAnalyzer.h"
#include <sstream>

SemanticAnalyzer::SemanticAnalyzer(const std::vector<std::unique_ptr<Statement>>& program)
    : program(program) {}

void SemanticAnalyzer::analyze() {
    errors.clear();
    symbolTable.clear();
    
    // Visit each statement in the program
    for (const auto& stmt : program) {
        visitStatement(stmt.get());
    }
}

void SemanticAnalyzer::addError(const std::string& message, int line, int column) {
    errors.emplace_back(message, line, column);
}

// ===== Visitor Methods =====

void SemanticAnalyzer::visitStatement(Statement* stmt) {
    if (auto* letStmt = dynamic_cast<LetStatement*>(stmt)) {
        visitLetStatement(letStmt);
    } else if (auto* printStmt = dynamic_cast<PrintStatement*>(stmt)) {
        visitPrintStatement(printStmt);
    }
}

void SemanticAnalyzer::visitLetStatement(LetStatement* stmt) {
    // Check for duplicate declaration
    if (symbolTable.isDeclared(stmt->identifier)) {
        VariableInfo existing = symbolTable.get(stmt->identifier);
        std::ostringstream oss;
        oss << "Variable '" << stmt->identifier << "' already declared at line " 
            << existing.declarationLine << ", column " << existing.declarationColumn 
            << ". Redeclaration attempt";
        addError(oss.str(), stmt->line, stmt->column);
        return; // Don't add to symbol table again
    }
    
    // Visit the expression first to check for undefined variables
    visitExpression(stmt->expression.get());
    
    // Add variable to symbol table
    symbolTable.declare(stmt->identifier, stmt->line, stmt->column);
}

void SemanticAnalyzer::visitPrintStatement(PrintStatement* stmt) {
    visitExpression(stmt->expression.get());
}

void SemanticAnalyzer::visitExpression(Expression* expr) {
    if (auto* binOp = dynamic_cast<BinaryOperation*>(expr)) {
        visitBinaryOperation(binOp);
    } else if (auto* var = dynamic_cast<Variable*>(expr)) {
        visitVariable(var);
    } else if (auto* intLit = dynamic_cast<IntegerLiteral*>(expr)) {
        visitIntegerLiteral(intLit);
    }
}

void SemanticAnalyzer::visitBinaryOperation(BinaryOperation* expr) {
    visitExpression(expr->left.get());
    visitExpression(expr->right.get());
}

void SemanticAnalyzer::visitVariable(Variable* expr) {
    // Check if variable is declared
    if (!symbolTable.isDeclared(expr->name)) {
        std::ostringstream oss;
        oss << "Undefined variable '" << expr->name << "'";
        addError(oss.str(), expr->line, expr->column);
    }
}

void SemanticAnalyzer::visitIntegerLiteral(IntegerLiteral* expr) {
    // Integer literals are always valid
    (void)expr; // Suppress unused parameter warning
}
