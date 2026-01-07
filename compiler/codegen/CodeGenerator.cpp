#include "CodeGenerator.h"

BytecodeProgram CodeGenerator::generate(const std::vector<std::unique_ptr<Statement>>& program) {
    bytecode.clear();
    
    // Generate code for each statement
    for (const auto& stmt : program) {
        generateStatement(stmt.get());
    }
    
    // Add HALT instruction at the end
    bytecode.emit(OpCode::HALT);
    
    return bytecode;
}

void CodeGenerator::generateStatement(Statement* stmt) {
    if (auto* letStmt = dynamic_cast<LetStatement*>(stmt)) {
        generateLetStatement(letStmt);
    } else if (auto* printStmt = dynamic_cast<PrintStatement*>(stmt)) {
        generatePrintStatement(printStmt);
    }
}

void CodeGenerator::generateLetStatement(LetStatement* stmt) {
    // Generate code to evaluate the expression (result pushed to stack)
    generateExpression(stmt->expression.get());
    
    // Store the value from stack into the variable
    bytecode.emit(OpCode::STORE_VAR, stmt->identifier);
}

void CodeGenerator::generatePrintStatement(PrintStatement* stmt) {
    // Generate code to evaluate the expression (result pushed to stack)
    generateExpression(stmt->expression.get());
    
    // Print the value from the top of the stack
    bytecode.emit(OpCode::PRINT);
}

void CodeGenerator::generateExpression(Expression* expr) {
    if (auto* intLit = dynamic_cast<IntegerLiteral*>(expr)) {
        generateIntegerLiteral(intLit);
    } else if (auto* var = dynamic_cast<Variable*>(expr)) {
        generateVariable(var);
    } else if (auto* binOp = dynamic_cast<BinaryOperation*>(expr)) {
        generateBinaryOperation(binOp);
    }
}

void CodeGenerator::generateIntegerLiteral(IntegerLiteral* expr) {
    // Push constant value onto stack
    bytecode.emit(OpCode::LOAD_CONST, expr->value);
}

void CodeGenerator::generateVariable(Variable* expr) {
    // Push variable value onto stack
    bytecode.emit(OpCode::LOAD_VAR, expr->name);
}

void CodeGenerator::generateBinaryOperation(BinaryOperation* expr) {
    // Generate code for left operand (pushes to stack)
    generateExpression(expr->left.get());
    
    // Generate code for right operand (pushes to stack)
    generateExpression(expr->right.get());
    
    // Emit the appropriate operation instruction
    // This pops two values from stack and pushes result
    if (expr->op == "+") {
        bytecode.emit(OpCode::ADD);
    } else if (expr->op == "-") {
        bytecode.emit(OpCode::SUB);
    } else if (expr->op == "*") {
        bytecode.emit(OpCode::MUL);
    } else if (expr->op == "/") {
        bytecode.emit(OpCode::DIV);
    } else if (expr->op == "%") {
        bytecode.emit(OpCode::MOD);
    } else if (expr->op == "<") {
        bytecode.emit(OpCode::CMP_LT);
    } else if (expr->op == ">") {
        bytecode.emit(OpCode::CMP_GT);
    } else if (expr->op == "<=") {
        bytecode.emit(OpCode::CMP_LTE);
    } else if (expr->op == ">=") {
        bytecode.emit(OpCode::CMP_GTE);
    } else if (expr->op == "==") {
        bytecode.emit(OpCode::CMP_EQ);
    } else if (expr->op == "!=") {
        bytecode.emit(OpCode::CMP_NEQ);
    }
}
