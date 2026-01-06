#ifndef OPTIMIZER_H
#define OPTIMIZER_H

#include "../parser/AST.h"
#include <vector>
#include <memory>
#include <unordered_map>

class Optimizer {
public:
    Optimizer() = default;
    
    // Optimize a program (vector of statements)
    void optimize(std::vector<std::unique_ptr<Statement>>& program);
    
    // Get statistics
    int getOptimizationCount() const { return optimizationCount; }
    void resetStats() { optimizationCount = 0; }
    
private:
    int optimizationCount = 0;
    std::unordered_map<std::string, int> constantValues; // For constant propagation
    
    // Optimization passes
    void optimizeStatement(Statement* stmt);
    void optimizeLetStatement(LetStatement* stmt);
    void optimizePrintStatement(PrintStatement* stmt);
    
    // Expression optimization
    std::unique_ptr<Expression> optimizeExpression(Expression* expr);
    std::unique_ptr<Expression> optimizeBinaryOperation(BinaryOperation* expr);
    
    // Helper functions
    bool isConstant(Expression* expr);
    int evaluateConstant(Expression* expr);
    std::unique_ptr<Expression> foldConstants(BinaryOperation* expr);
};

#endif
