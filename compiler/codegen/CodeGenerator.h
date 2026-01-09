#ifndef CODE_GENERATOR_H
#define CODE_GENERATOR_H

#include "../parser/AST.h"
#include "../bytecode/BytecodeProgram.h"
#include <vector>
#include <memory>

class CodeGenerator {
public:
    CodeGenerator() = default;
    
    // Generate bytecode from AST program
    BytecodeProgram generate(const std::vector<std::unique_ptr<Statement>>& program);
    
private:
    BytecodeProgram bytecode;
    
    // Statement code generation
    void generateStatement(Statement* stmt);
    void generateLetStatement(LetStatement* stmt);
    void generatePrintStatement(PrintStatement* stmt);
    void generateIfStatement(IfStatement* stmt);          // NEW
    void generateForStatement(ForStatement* stmt);        // NEW
    
    // Expression code generation (emits code to push result onto stack)
    void generateExpression(Expression* expr);
    void generateBinaryOperation(BinaryOperation* expr);
    void generateComparisonExpression(ComparisonExpression* expr);  // NEW
    void generateLogicalExpression(LogicalExpression* expr);        // NEW
    void generateUnaryExpression(UnaryExpression* expr);            // NEW
    void generateIntegerLiteral(IntegerLiteral* expr);
    void generateVariable(Variable* expr);
};

#endif
