#ifndef BYTECODE_H
#define BYTECODE_H

#include <string>
#include <iostream>

// Opcode enumeration for all VM instructions
enum class OpCode {
    // Literal and variable operations
    LOAD_CONST,    // Push constant to stack
    LOAD_VAR,      // Push variable value to stack
    STORE_VAR,     // Pop from stack and store in variable
    
    // Arithmetic operations
    ADD,           // Pop two values, push sum
    SUB,           // Pop two values, push difference
    MUL,           // Pop two values, push product
    DIV,           // Pop two values, push quotient
    MOD,           // Pop two values, push remainder
    
    // Comparison operations
    CMP_LT,        // Pop two values, push (a < b)
    CMP_GT,        // Pop two values, push (a > b)
    CMP_LTE,       // Pop two values, push (a <= b)
    CMP_GTE,       // Pop two values, push (a >= b)
    CMP_EQ,        // Pop two values, push (a == b)
    CMP_NEQ,       // Pop two values, push (a != b)
    
    // I/O operations
    PRINT,         // Pop and print value
    HALT           // Stop execution
};

// Single bytecode instruction
struct Instruction {
    OpCode opcode;
    int intOperand;           // For LOAD_CONST
    std::string strOperand;   // For LOAD_VAR, STORE_VAR
    
    // Constructor for instructions without operands
    explicit Instruction(OpCode op);
    
    // Constructor for instructions with integer operand
    Instruction(OpCode op, int operand);
    
    // Constructor for instructions with string operand
    Instruction(OpCode op, const std::string& operand);
    
    // Default constructor
    Instruction();
};

// Helper functions
std::string opcodeToString(OpCode opcode);
std::ostream& operator<<(std::ostream& os, const Instruction& instr);

#endif
