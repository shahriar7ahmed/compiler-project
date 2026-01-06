#include "BytecodeProgram.h"
#include <iostream>
#include <iomanip>

void BytecodeProgram::addInstruction(const Instruction& instr) {
    instructions.push_back(instr);
}

void BytecodeProgram::emit(OpCode opcode) {
    instructions.emplace_back(opcode);
}

void BytecodeProgram::emit(OpCode opcode, int operand) {
    instructions.emplace_back(opcode, operand);
}

void BytecodeProgram::emit(OpCode opcode, const std::string& operand) {
    instructions.emplace_back(opcode, operand);
}

const std::vector<Instruction>& BytecodeProgram::getInstructions() const {
    return instructions;
}

const Instruction& BytecodeProgram::operator[](size_t index) const {
    return instructions[index];
}

size_t BytecodeProgram::size() const {
    return instructions.size();
}

void BytecodeProgram::print() const {
    std::cout << "Bytecode Program (" << instructions.size() << " instructions):\n";
    std::cout << "----------------------------------------\n";
    
    for (size_t i = 0; i < instructions.size(); ++i) {
        std::cout << std::setw(4) << i << ": " << instructions[i] << "\n";
    }
    
    std::cout << "----------------------------------------\n";
}

void BytecodeProgram::clear() {
    instructions.clear();
}
