#ifndef VIRTUAL_MACHINE_H
#define VIRTUAL_MACHINE_H

#include "../bytecode/BytecodeProgram.h"
#include <vector>
#include <unordered_map>
#include <string>

class VirtualMachine {
public:
    VirtualMachine() = default;
    
    // Execute a bytecode program
    void execute(const BytecodeProgram& program);
    
    // Get execution statistics
    int getInstructionCount() const { return instructionCount; }
    
    // Enable/disable step-by-step trace
    void setTraceMode(bool enabled) { traceMode = enabled; }
    
private:
    std::vector<int> stack;                          // Value stack
    std::unordered_map<std::string, int> variables;  // Variable storage
    int instructionCount = 0;                        // Instructions executed
    bool traceMode = false;                          // Show execution trace
    
    // Execute single instruction
    void executeInstruction(const Instruction& instr);
    
    // Stack operations
    void push(int value);
    int pop();
    int peek() const;
    
    // Helper for trace output
    void printTrace(int pc, const Instruction& instr);
};

#endif
