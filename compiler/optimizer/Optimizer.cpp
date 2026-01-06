#include "Optimizer.h"
#include <iostream>

void Optimizer::optimize(std::vector<std::unique_ptr<Statement>>& program) {
    resetStats();
    constantValues.clear();
    
    // Optimize each statement
    for (auto& stmt : program) {
        optimizeStatement(stmt.get());
    }
}

void Optimizer::optimizeStatement(Statement* stmt) {
    if (auto* letStmt = dynamic_cast<LetStatement*>(stmt)) {
        optimizeLetStatement(letStmt);
    } else if (auto* printStmt = dynamic_cast<PrintStatement*>(stmt)) {
        optimizePrintStatement(printStmt);
    }
}

void Optimizer::optimizeLetStatement(LetStatement* stmt) {
    // Optimize the expression
    auto optimized = optimizeExpression(stmt->expression.get());
    
    if (optimized) {
        stmt->expression = std::move(optimized);
    }
    
    // Track constant values for propagation
    if (auto* intLit = dynamic_cast<IntegerLiteral*>(stmt->expression.get())) {
        constantValues[stmt->identifier] = intLit->value;
    }
}

void Optimizer::optimizePrintStatement(PrintStatement* stmt) {
    // Optimize the expression
    auto optimized = optimizeExpression(stmt->expression.get());
    
    if (optimized) {
        stmt->expression = std::move(optimized);
    }
}

std::unique_ptr<Expression> Optimizer::optimizeExpression(Expression* expr) {
    if (auto* binOp = dynamic_cast<BinaryOperation*>(expr)) {
        return optimizeBinaryOperation(binOp);
    } else if (auto* var = dynamic_cast<Variable*>(expr)) {
        // Constant propagation: replace variable with constant if known
        if (constantValues.find(var->name) != constantValues.end()) {
            optimizationCount++;
            return std::make_unique<IntegerLiteral>(constantValues[var->name]);
        }
    }
    
    return nullptr; // No optimization possible
}

std::unique_ptr<Expression> Optimizer::optimizeBinaryOperation(BinaryOperation* expr) {
    // First, recursively optimize operands
    auto leftOpt = optimizeExpression(expr->left.get());
    if (leftOpt) {
        expr->left = std::move(leftOpt);
    }
    
    auto rightOpt = optimizeExpression(expr->right.get());
    if (rightOpt) {
        expr->right = std::move(rightOpt);
    }
    
    // Then try constant folding
    if (isConstant(expr->left.get()) && isConstant(expr->right.get())) {
        return foldConstants(expr);
    }
    
    return nullptr;
}

bool Optimizer::isConstant(Expression* expr) {
    return dynamic_cast<IntegerLiteral*>(expr) != nullptr;
}

int Optimizer::evaluateConstant(Expression* expr) {
    if (auto* intLit = dynamic_cast<IntegerLiteral*>(expr)) {
        return intLit->value;
    }
    return 0; // Should not reach here if isConstant() was checked
}

std::unique_ptr<Expression> Optimizer::foldConstants(BinaryOperation* expr) {
    int left = evaluateConstant(expr->left.get());
    int right = evaluateConstant(expr->right.get());
    int result = 0;
    
    // Evaluate the operation
    if (expr->op == "+") {
        result = left + right;
    } else if (expr->op == "-") {
        result = left - right;
    } else if (expr->op == "*") {
        result = left * right;
    } else if (expr->op == "/") {
        if (right != 0) {
            result = left / right;
        } else {
            return nullptr; // Don't optimize division by zero
        }
    } else if (expr->op == "%") {
        if (right != 0) {
            result = left % right;
        } else {
            return nullptr;
        }
    } else if (expr->op == "<") {
        result = (left < right) ? 1 : 0;
    } else if (expr->op == ">") {
        result = (left > right) ? 1 : 0;
    } else if (expr->op == "<=") {
        result = (left <= right) ? 1 : 0;
    } else if (expr->op == ">=") {
        result = (left >= right) ? 1 : 0;
    } else if (expr->op == "==") {
        result = (left == right) ? 1 : 0;
    } else if (expr->op == "!=") {
        result = (left != right) ? 1 : 0;
    } else {
        return nullptr; // Unknown operation
    }
    
    optimizationCount++;
    return std::make_unique<IntegerLiteral>(result);
}
