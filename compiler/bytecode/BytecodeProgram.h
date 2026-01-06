#ifndef BYTECODE_PROGRAM_H
#define BYTECODE_PROGRAM_H

#include "Bytecode.h"
#include <vector>

class BytecodeProgram {
public:
    BytecodeProgram() = default;
    
    // Add instruction to program
    void addInstruction(const Instruction& instr);
    
    // Add instruction using emplace (for efficiency)
    void emit(OpCode opcode);
    void emit(OpCode opcode, int operand);
    void emit(OpCode opcode, const std::string& operand);
    
    // Access instructions
    const std::vector<Instruction>& getInstructions() const;
    const Instruction& operator[](size_t index) const;
    size_t size() const;
    
    // Pretty-print bytecode
    void print() const;
    
    // Clear all instructions
    void clear();
    
private:
    std::vector<Instruction> instructions;
};

#endif
