#include "Bytecode.h"

// Instruction constructors
Instruction::Instruction() 
    : opcode(OpCode::HALT), intOperand(0), strOperand("") {}

Instruction::Instruction(OpCode op) 
    : opcode(op), intOperand(0), strOperand("") {}

Instruction::Instruction(OpCode op, int operand) 
    : opcode(op), intOperand(operand), strOperand("") {}

Instruction::Instruction(OpCode op, const std::string& operand) 
    : opcode(op), intOperand(0), strOperand(operand) {}

// Convert opcode to string for debugging
std::string opcodeToString(OpCode opcode) {
    switch (opcode) {
        case OpCode::LOAD_CONST: return "LOAD_CONST";
        case OpCode::LOAD_VAR:   return "LOAD_VAR";
        case OpCode::STORE_VAR:  return "STORE_VAR";
        case OpCode::ADD:        return "ADD";
        case OpCode::SUB:        return "SUB";
        case OpCode::MUL:        return "MUL";
        case OpCode::DIV:        return "DIV";
        case OpCode::MOD:        return "MOD";
        case OpCode::CMP_LT:     return "CMP_LT";
        case OpCode::CMP_GT:     return "CMP_GT";
        case OpCode::CMP_LTE:    return "CMP_LTE";
        case OpCode::CMP_GTE:    return "CMP_GTE";
        case OpCode::CMP_EQ:     return "CMP_EQ";
        case OpCode::CMP_NEQ:    return "CMP_NEQ";
        case OpCode::AND:        return "AND";
        case OpCode::OR:         return "OR";
        case OpCode::NOT:        return "NOT";
        case OpCode::JUMP:       return "JUMP";
        case OpCode::JUMP_IF_FALSE: return "JUMP_IF_FALSE";
        case OpCode::JUMP_IF_TRUE:  return "JUMP_IF_TRUE";
        case OpCode::POP:        return "POP";
        case OpCode::DUP:        return "DUP";
        case OpCode::PRINT:      return "PRINT";
        case OpCode::HALT:       return "HALT";
        default:                 return "UNKNOWN";
    }
}

// Print instruction
std::ostream& operator<<(std::ostream& os, const Instruction& instr) {
    os << opcodeToString(instr.opcode);
    
    // Add operands if present
    if (instr.opcode == OpCode::LOAD_CONST) {
        os << " " << instr.intOperand;
    } else if (instr.opcode == OpCode::LOAD_VAR || instr.opcode == OpCode::STORE_VAR) {
        os << " \"" << instr.strOperand << "\"";
    } else if (instr.opcode == OpCode::JUMP || 
               instr.opcode == OpCode::JUMP_IF_FALSE || 
               instr.opcode == OpCode::JUMP_IF_TRUE) {
        os << " " << instr.intOperand;  // Jump address
    }
    
    return os;
}
