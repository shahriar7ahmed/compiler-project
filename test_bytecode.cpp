#include "compiler/bytecode/BytecodeProgram.h"
#include <iostream>

void testBytecodeCreation() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Bytecode Instruction Creation\n";
    std::cout << "========================================\n";
    
    // Test creating individual instructions
    Instruction i1(OpCode::LOAD_CONST, 42);
    Instruction i2(OpCode::LOAD_VAR, "x");
    Instruction i3(OpCode::ADD);
    Instruction i4(OpCode::STORE_VAR, "result");
    Instruction i5(OpCode::HALT);
    
    std::cout << "✅ Created instructions:\n";
    std::cout << "  " << i1 << "\n";
    std::cout << "  " << i2 << "\n";
    std::cout << "  " << i3 << "\n";
    std::cout << "  " << i4 << "\n";
    std::cout << "  " << i5 << "\n";
}

void testSimpleProgram() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Simple Program - let x = 42;\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    program.emit(OpCode::LOAD_CONST, 42);
    program.emit(OpCode::STORE_VAR, "x");
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ Program created with " << program.size() << " instructions\n";
}

void testArithmeticProgram() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Arithmetic - let z = 5 + 3;\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    program.emit(OpCode::LOAD_CONST, 5);
    program.emit(OpCode::LOAD_CONST, 3);
    program.emit(OpCode::ADD);
    program.emit(OpCode::STORE_VAR, "z");
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ Arithmetic program created\n";
}

void testComplexExpression() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Complex - let result = x + y * 2;\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    program.emit(OpCode::LOAD_VAR, "x");
    program.emit(OpCode::LOAD_VAR, "y");
    program.emit(OpCode::LOAD_CONST, 2);
    program.emit(OpCode::MUL);        // y * 2
    program.emit(OpCode::ADD);        // x + (y * 2)
    program.emit(OpCode::STORE_VAR, "result");
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ Complex expression bytecode created\n";
}

void testAllArithmeticOps() {
    std::cout << "\n========================================\n";
    std::cout << "Test: All Arithmetic Operations\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    
    // Test each arithmetic operation
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::LOAD_CONST, 3);
    program.emit(OpCode::ADD);       // 10 + 3
    program.emit(OpCode::PRINT);
    
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::LOAD_CONST, 3);
    program.emit(OpCode::SUB);       // 10 - 3
    program.emit(OpCode::PRINT);
    
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::LOAD_CONST, 3);
    program.emit(OpCode::MUL);       // 10 * 3
    program.emit(OpCode::PRINT);
    
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::LOAD_CONST, 3);
    program.emit(OpCode::DIV);       // 10 / 3
    program.emit(OpCode::PRINT);
    
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::LOAD_CONST, 3);
    program.emit(OpCode::MOD);       // 10 % 3
    program.emit(OpCode::PRINT);
    
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ All arithmetic operations represented\n";
}

void testComparisonOps() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Comparison Operations\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    
    // let flag = a < b;
    program.emit(OpCode::LOAD_VAR, "a");
    program.emit(OpCode::LOAD_VAR, "b");
    program.emit(OpCode::CMP_LT);
    program.emit(OpCode::STORE_VAR, "flag");
    
    // let check = x == y;
    program.emit(OpCode::LOAD_VAR, "x");
    program.emit(OpCode::LOAD_VAR, "y");
    program.emit(OpCode::CMP_EQ);
    program.emit(OpCode::STORE_VAR, "check");
    
    // let result = a >= 10;
    program.emit(OpCode::LOAD_VAR, "a");
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::CMP_GTE);
    program.emit(OpCode::STORE_VAR, "result");
    
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ Comparison operations represented\n";
}

void testPrintStatement() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Print Statement - print x + 10;\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    program.emit(OpCode::LOAD_VAR, "x");
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::ADD);
    program.emit(OpCode::PRINT);
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ Print statement bytecode created\n";
}

void testMultipleStatements() {
    std::cout << "\n========================================\n";
    std::cout << "Test: Multiple Statements\n";
    std::cout << "  let x = 10;\n";
    std::cout << "  let y = 20;\n";
    std::cout << "  print x + y;\n";
    std::cout << "========================================\n";
    
    BytecodeProgram program;
    
    // let x = 10;
    program.emit(OpCode::LOAD_CONST, 10);
    program.emit(OpCode::STORE_VAR, "x");
    
    // let y = 20;
    program.emit(OpCode::LOAD_CONST, 20);
    program.emit(OpCode::STORE_VAR, "y");
    
    // print x + y;
    program.emit(OpCode::LOAD_VAR, "x");
    program.emit(OpCode::LOAD_VAR, "y");
    program.emit(OpCode::ADD);
    program.emit(OpCode::PRINT);
    
    program.emit(OpCode::HALT);
    
    program.print();
    std::cout << "✅ Multi-statement program created\n";
}

int main() {
    std::cout << "╔════════════════════════════════════════════╗\n";
    std::cout << "║  Educational Compiler - Bytecode Tests    ║\n";
    std::cout << "╚════════════════════════════════════════════╝\n";
    
    testBytecodeCreation();
    testSimpleProgram();
    testArithmeticProgram();
    testComplexExpression();
    testAllArithmeticOps();
    testComparisonOps();
    testPrintStatement();
    testMultipleStatements();
    
    std::cout << "\n╔════════════════════════════════════════════╗\n";
    std::cout << "║          All Tests Completed!              ║\n";
    std::cout << "╚════════════════════════════════════════════╝\n";
    
    return 0;
}
