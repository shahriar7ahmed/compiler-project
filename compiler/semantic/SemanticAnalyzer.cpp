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
    } else if (auto* ifStmt = dynamic_cast<IfStatement*>(stmt)) {
        visitIfStatement(ifStmt);
    } else if (auto* forStmt = dynamic_cast<ForStatement*>(stmt)) {
        visitForStatement(forStmt);
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
    } else if (auto* compExpr = dynamic_cast<ComparisonExpression*>(expr)) {
        visitComparisonExpression(compExpr);
    } else if (auto* logicExpr = dynamic_cast<LogicalExpression*>(expr)) {
        visitLogicalExpression(logicExpr);
    } else if (auto* unaryExpr = dynamic_cast<UnaryExpression*>(expr)) {
        visitUnaryExpression(unaryExpr);
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

// NEW: Visit if statement
void SemanticAnalyzer::visitIfStatement(IfStatement* stmt) {
    // Visit condition
    visitExpression(stmt->condition.get());
    
    // Visit then block
    for (const auto& s : stmt->thenBlock) {
        visitStatement(s.get());
    }
    
    // Visit else block if present
    for (const auto& s : stmt->elseBlock) {
        visitStatement(s.get());
    }
}

// NEW: Visit for statement
void SemanticAnalyzer::visitForStatement(ForStatement* stmt) {
    // Visit start and end expressions
    visitExpression(stmt->start.get());
    visitExpression(stmt->end.get());
    
    // Add loop variable to symbol table
    symbolTable.declare(stmt->variable, 0, 0);  // Loop variables don't have specific line/col
    
    // Visit body
    for (const auto& s : stmt->body) {
        visitStatement(s.get());
    }
}

// NEW: Visit comparison expression
void SemanticAnalyzer::visitComparisonExpression(ComparisonExpression* expr) {
    visitExpression(expr->left.get());
    visitExpression(expr->right.get());
}

// NEW: Visit logical expression
void SemanticAnalyzer::visitLogicalExpression(LogicalExpression* expr) {
    visitExpression(expr->left.get());
    visitExpression(expr->right.get());
}

// NEW: Visit unary expression
void SemanticAnalyzer::visitUnaryExpression(UnaryExpression* expr) {
    visitExpression(expr->operand.get());
}
