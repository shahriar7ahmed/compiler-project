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
    } else if (auto* ifStmt = dynamic_cast<IfStatement*>(stmt)) {
        generateIfStatement(ifStmt);
    } else if (auto* forStmt = dynamic_cast<ForStatement*>(stmt)) {
        generateForStatement(forStmt);
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
    } else if (auto* compExpr = dynamic_cast<ComparisonExpression*>(expr)) {
        generateComparisonExpression(compExpr);
    } else if (auto* logicExpr = dynamic_cast<LogicalExpression*>(expr)) {
        generateLogicalExpression(logicExpr);
    } else if (auto* unaryExpr = dynamic_cast<UnaryExpression*>(expr)) {
        generateUnaryExpression(unaryExpr);
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
    }
}

// NEW: Generate comparison expression (separate from BinaryOperation)
void CodeGenerator::generateComparisonExpression(ComparisonExpression* expr) {
    generateExpression(expr->left.get());
    generateExpression(expr->right.get());
    
    if (expr->op == "<") {
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

// NEW: Generate logical expression
void CodeGenerator::generateLogicalExpression(LogicalExpression* expr) {
    generateExpression(expr->left.get());
    generateExpression(expr->right.get());
    
    if (expr->op == "&&") {
        bytecode.emit(OpCode::AND);
    } else if (expr->op == "||") {
        bytecode.emit(OpCode::OR);
    }
}

// NEW: Generate unary expression
void CodeGenerator::generateUnaryExpression(UnaryExpression* expr) {
    generateExpression(expr->operand.get());
    
    if (expr->op == "!") {
        bytecode.emit(OpCode::NOT);
    }
}

// NEW: Generate if statement
void CodeGenerator::generateIfStatement(IfStatement* stmt) {
    // if condition { then_block } else { else_block }
    // Bytecode pattern:
    //   <condition code>
    //   JUMP_IF_FALSE else_label
    //   <then_block code>
    //   JUMP end_label
    // else_label:
    //   <else_block code>
    // end_label:
    
    // Generate condition
    generateExpression(stmt->condition.get());
    
    // Emit JUMP_IF_FALSE (we'll backpatch the address later)
    int jumpToElse = bytecode.size();
    bytecode.emit(OpCode::JUMP_IF_FALSE, 0);  // Placeholder address
    
    // Generate then block
    for (const auto& s : stmt->thenBlock) {
        generateStatement(s.get());
    }
    
    // Emit JUMP to skip else block (only if there is an else block)
    int jumpToEnd = -1;
    if (!stmt->elseBlock.empty()) {
        jumpToEnd = bytecode.size();
        bytecode.emit(OpCode::JUMP, 0);  // Placeholder address
    }
    
    // Backpatch JUMP_IF_FALSE to point here (start of else or end)
    int elseLabel = bytecode.size();
    bytecode.patchInstruction(jumpToElse, elseLabel);
    
    // Generate else block if present
    if (!stmt->elseBlock.empty()) {
        for (const auto& s : stmt->elseBlock) {
            generateStatement(s.get());
        }
    }
    
    // Backpatch JUMP to point here (end of if statement)
    if (jumpToEnd != -1) {
        int endLabel = bytecode.size();
        bytecode.patchInstruction(jumpToEnd, endLabel);
    }
}

// NEW: Generate for loop
void CodeGenerator::generateForStatement(ForStatement* stmt) {
    // for var = start to end { body }
    // Bytecode pattern:
    //   <start code>
    //   STORE_VAR var
    // loop_start:
    //   LOAD_VAR var
    //   <end code>
    //   CMP_LTE
    //   JUMP_IF_FALSE loop_end
    //   <body code>
    //   LOAD_VAR var
    //   LOAD_CONST 1
    //   ADD
    //   STORE_VAR var
    //   JUMP loop_start
    // loop_end:
    
    // Initialize loop variable
    generateExpression(stmt->start.get());
    bytecode.emit(OpCode::STORE_VAR, stmt->variable);
    
    // loop_start:
    int loopStart = bytecode.size();
    
    // Check condition: var <= end
    bytecode.emit(OpCode::LOAD_VAR, stmt->variable);
    generateExpression(stmt->end.get());
    bytecode.emit(OpCode::CMP_LTE);
    
    // JUMP_IF_FALSE to loop_end
    int jumpToEnd = bytecode.size();
    bytecode.emit(OpCode::JUMP_IF_FALSE, 0);  // Placeholder
    
    // Generate body
    for (const auto& s : stmt->body) {
        generateStatement(s.get());
    }
    
    // Increment: var = var + 1
    bytecode.emit(OpCode::LOAD_VAR, stmt->variable);
    bytecode.emit(OpCode::LOAD_CONST, 1);
    bytecode.emit(OpCode::ADD);
    bytecode.emit(OpCode::STORE_VAR, stmt->variable);
    
    // JUMP back to loop_start
    bytecode.emit(OpCode::JUMP, loopStart);
    
    // loop_end: (backpatch JUMP_IF_FALSE)
    int loopEnd = bytecode.size();
    bytecode.patchInstruction(jumpToEnd, loopEnd);
}
