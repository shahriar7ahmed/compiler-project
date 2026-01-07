#include "VirtualMachine.h"
#include <iostream>
#include <stdexcept>

void VirtualMachine::execute(const BytecodeProgram& program) {
    // Reset state
    stack.clear();
    variables.clear();
    instructionCount = 0;
    
    const auto& instructions = program.getInstructions();
    size_t pc = 0; // Program counter
    
    if (traceMode) {
        std::cout << "\n=== VM Execution Trace ===\n";
    }
    
    // Execute until HALT or end of program
    while (pc < instructions.size()) {
        const Instruction& instr = instructions[pc];
        
        if (traceMode) {
            printTrace(pc, instr);
        }
        
        // Check for HALT
        if (instr.opcode == OpCode::HALT) {
            break;
        }
        
        executeInstruction(instr);
        instructionCount++;
        pc++;
    }
    
    if (traceMode) {
        std::cout << "=== Execution Complete ===\n";
        std::cout << "Instructions executed: " << instructionCount << "\n\n";
    }
}

void VirtualMachine::executeInstruction(const Instruction& instr) {
    switch (instr.opcode) {
        // Load/Store operations
        case OpCode::LOAD_CONST:
            push(instr.intOperand);
            break;
            
        case OpCode::LOAD_VAR: {
            if (variables.find(instr.strOperand) == variables.end()) {
                throw std::runtime_error("Runtime error: Variable '" + instr.strOperand + "' not found");
            }
            push(variables[instr.strOperand]);
            break;
        }
            
        case OpCode::STORE_VAR: {
            int value = pop();
            variables[instr.strOperand] = value;
            break;
        }
        
        // Arithmetic operations
        case OpCode::ADD: {
            int b = pop();
            int a = pop();
            push(a + b);
            break;
        }
        
        case OpCode::SUB: {
            int b = pop();
            int a = pop();
            push(a - b);
            break;
        }
        
        case OpCode::MUL: {
            int b = pop();
            int a = pop();
            push(a * b);
            break;
        }
        
        case OpCode::DIV: {
            int b = pop();
            int a = pop();
            if (b == 0) {
                throw std::runtime_error("Runtime error: Division by zero");
            }
            push(a / b);
            break;
        }
        
        case OpCode::MOD: {
            int b = pop();
            int a = pop();
            if (b == 0) {
                throw std::runtime_error("Runtime error: Modulo by zero");
            }
            push(a % b);
            break;
        }
        
        // Comparison operations
        case OpCode::CMP_LT: {
            int b = pop();
            int a = pop();
            push((a < b) ? 1 : 0);
            break;
        }
        
        case OpCode::CMP_GT: {
            int b = pop();
            int a = pop();
            push((a > b) ? 1 : 0);
            break;
        }
        
        case OpCode::CMP_LTE: {
            int b = pop();
            int a = pop();
            push((a <= b) ? 1 : 0);
            break;
        }
        
        case OpCode::CMP_GTE: {
            int b = pop();
            int a = pop();
            push((a >= b) ? 1 : 0);
            break;
        }
        
        case OpCode::CMP_EQ: {
            int b = pop();
            int a = pop();
            push((a == b) ? 1 : 0);
            break;
        }
        
        case OpCode::CMP_NEQ: {
            int b = pop();
            int a = pop();
            push((a != b) ? 1 : 0);
            break;
        }
        
        // I/O operations
        case OpCode::PRINT: {
            int value = pop();
            std::cout << value << "\n";
            break;
        }
        
        case OpCode::HALT:
            // Handled in main loop
            break;
            
        default:
            throw std::runtime_error("Unknown opcode");
    }
}

void VirtualMachine::push(int value) {
    stack.push_back(value);
}

int VirtualMachine::pop() {
    if (stack.empty()) {
        throw std::runtime_error("Stack underflow");
    }
    int value = stack.back();
    stack.pop_back();
    return value;
}

int VirtualMachine::peek() const {
    if (stack.empty()) {
        throw std::runtime_error("Stack is empty");
    }
    return stack.back();
}

void VirtualMachine::printTrace(int pc, const Instruction& instr) {
    std::cout << "[" << pc << "] " << instr;
    
    // Show stack state
    std::cout << " | Stack: [";
    for (size_t i = 0; i < stack.size(); ++i) {
        std::cout << stack[i];
        if (i < stack.size() - 1) std::cout << ", ";
    }
    std::cout << "]";
    
    // Show variables if any
    if (!variables.empty()) {
        std::cout << " | Vars: {";
        bool first = true;
        for (const auto& pair : variables) {
            if (!first) std::cout << ", ";
            std::cout << pair.first << ":" << pair.second;
            first = false;
        }
        std::cout << "}";
    }
    
    std::cout << "\n";
}
