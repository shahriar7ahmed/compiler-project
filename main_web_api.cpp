#include "compiler/vm/VirtualMachine.h"
#include "compiler/codegen/CodeGenerator.h"
#include "compiler/optimizer/Optimizer.h"
#include "compiler/semantic/SemanticAnalyzer.h"
#include "compiler/parser/Parser.h"
#include "compiler/lexer/Lexer.h"
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

// Helper function to escape JSON strings
std::string escapeJSON(const std::string& str) {
    std::string escaped;
    for (char c : str) {
        switch (c) {
            case '"': escaped += "\\\""; break;
            case '\\': escaped += "\\\\"; break;
            case '\b': escaped += "\\b"; break;
            case '\f': escaped += "\\f"; break;
            case '\n': escaped += "\\n"; break;
            case '\r': escaped += "\\r"; break;
            case '\t': escaped += "\\t"; break;
            default:
                if (c < 32) {
                    // Control character - escape as unicode
                    char buf[8];
                    snprintf(buf, sizeof(buf), "\\u%04x", (unsigned char)c);
                    escaped += buf;
                } else {
                    escaped += c;
                }
        }
    }
    return escaped;
}

// Convert tokens to JSON array
std::string tokensToJSON(const std::vector<Token>& tokens) {
    std::ostringstream json;
    json << "[";
    for (size_t i = 0; i < tokens.size(); ++i) {
        if (i > 0) json << ",";
        json << "\n    {";
        json << "\"type\":\"" << escapeJSON(tokenTypeToString(tokens[i].type)) << "\",";
        json << "\"value\":\"" << escapeJSON(tokens[i].lexeme) << "\",";
        json << "\"line\":" << tokens[i].line << ",";
        json << "\"column\":" << tokens[i].column;
        json << "}";
    }
    json << "\n  ]";
    return json.str();
}

// Convert AST to JSON (simplified tree structure)

std::string expressionToJSON(const Expression* expr) {
    if (!expr) return "null";
    
    if (auto* intLit = dynamic_cast<const IntegerLiteral*>(expr)) {
        std::ostringstream json;
        json << "{\"type\":\"IntegerLiteral\",\"value\":" << intLit->value << "}";
        return json.str();
    }
    else if (auto* ident = dynamic_cast<const Variable*>(expr)) {
        std::ostringstream json;
        json << "{\"type\":\"Identifier\",\"name\":\"" << escapeJSON(ident->name) << "\"}";
        return json.str();
    }
    else if (auto* binOp = dynamic_cast<const BinaryOperation*>(expr)) {
        std::ostringstream json;
        json << "{\"type\":\"BinaryOperation\",";
        json << "\"operator\":\"" << escapeJSON(binOp->op) << "\",";
        json << "\"left\":" << expressionToJSON(binOp->left.get()) << ",";
        json << "\"right\":" << expressionToJSON(binOp->right.get()) << "}";
        return json.str();
    }
    else if (auto* compExpr = dynamic_cast<const ComparisonExpression*>(expr)) {
        std::ostringstream json;
        json << "{\"type\":\"ComparisonExpression\",";
        json << "\"operator\":\"" << escapeJSON(compExpr->op) << "\",";
        json << "\"left\":" << expressionToJSON(compExpr->left.get()) << ",";
        json << "\"right\":" << expressionToJSON(compExpr->right.get()) << "}";
        return json.str();
    }
    else if (auto* logicExpr = dynamic_cast<const LogicalExpression*>(expr)) {
        std::ostringstream json;
        json << "{\"type\":\"LogicalExpression\",";
        json << "\"operator\":\"" << escapeJSON(logicExpr->op) << "\",";
        json << "\"left\":" << expressionToJSON(logicExpr->left.get()) << ",";
        json << "\"right\":" << expressionToJSON(logicExpr->right.get()) << "}";
        return json.str();
    }
    else if (auto* unaryExpr = dynamic_cast<const UnaryExpression*>(expr)) {
        std::ostringstream json;
        json << "{\"type\":\"UnaryExpression\",";
        json << "\"operator\":\"" << escapeJSON(unaryExpr->op) << "\",";
        json << "\"operand\":" << expressionToJSON(unaryExpr->operand.get()) << "}";
        return json.str();
    }
    
    return "{\"type\":\"Unknown\"}";
}

std::string astToJSON(const std::vector<std::unique_ptr<Statement>>& program) {
    std::ostringstream json;
    json << "[";
    for (size_t i = 0; i < program.size(); ++i) {
        if (i > 0) json << ",";
        json << "\n    ";
        
        if (auto* letStmt = dynamic_cast<LetStatement*>(program[i].get())) {
            json << "{\"type\":\"LetStatement\",";
            json << "\"identifier\":\"" << escapeJSON(letStmt->identifier) << "\",";
            json << "\"expression\":" << expressionToJSON(letStmt->expression.get()) << "}";
        }
        else if (auto* printStmt = dynamic_cast<PrintStatement*>(program[i].get())) {
            json << "{\"type\":\"PrintStatement\",";
            json << "\"expression\":" << expressionToJSON(printStmt->expression.get()) << "}";
        }
        else if (auto* ifStmt = dynamic_cast<IfStatement*>(program[i].get())) {
            json << "{\"type\":\"IfStatement\",";
            json << "\"condition\":" << expressionToJSON(ifStmt->condition.get()) << ",";
            json << "\"thenBlock\":[";
            for (size_t j = 0; j < ifStmt->thenBlock.size(); ++j) {
                if (j > 0) json << ",";
                // Recursively serialize nested statements (simplified)
                if (auto* nestedLet = dynamic_cast<LetStatement*>(ifStmt->thenBlock[j].get())) {
                    json << "{\"type\":\"LetStatement\",\"identifier\":\"" << escapeJSON(nestedLet->identifier) << "\",\"expression\":" << expressionToJSON(nestedLet->expression.get()) << "}";
                } else if (auto* nestedPrint = dynamic_cast<PrintStatement*>(ifStmt->thenBlock[j].get())) {
                    json << "{\"type\":\"PrintStatement\",\"expression\":" << expressionToJSON(nestedPrint->expression.get()) << "}";
                }
            }
            json << "],";
            json << "\"elseBlock\":[";
            for (size_t j = 0; j < ifStmt->elseBlock.size(); ++j) {
                if (j > 0) json << ",";
                if (auto* nestedLet = dynamic_cast<LetStatement*>(ifStmt->elseBlock[j].get())) {
                    json << "{\"type\":\"LetStatement\",\"identifier\":\"" << escapeJSON(nestedLet->identifier) << "\",\"expression\":" << expressionToJSON(nestedLet->expression.get()) << "}";
                } else if (auto* nestedPrint = dynamic_cast<PrintStatement*>(ifStmt->elseBlock[j].get())) {
                    json << "{\"type\":\"PrintStatement\",\"expression\":" << expressionToJSON(nestedPrint->expression.get()) << "}";
                }
            }
            json << "]}";
        }
        else if (auto* forStmt = dynamic_cast<ForStatement*>(program[i].get())) {
            json << "{\"type\":\"ForStatement\",";
            json << "\"variable\":\"" << escapeJSON(forStmt->variable) << "\",";
            json << "\"start\":" << expressionToJSON(forStmt->start.get()) << ",";
            json << "\"end\":" << expressionToJSON(forStmt->end.get()) << ",";
            json << "\"body\":[";
            for (size_t j = 0; j < forStmt->body.size(); ++j) {
                if (j > 0) json << ",";
                if (auto* nestedLet = dynamic_cast<LetStatement*>(forStmt->body[j].get())) {
                    json << "{\"type\":\"LetStatement\",\"identifier\":\"" << escapeJSON(nestedLet->identifier) << "\",\"expression\":" << expressionToJSON(nestedLet->expression.get()) << "}";
                } else if (auto* nestedPrint = dynamic_cast<PrintStatement*>(forStmt->body[j].get())) {
                    json << "{\"type\":\"PrintStatement\",\"expression\":" << expressionToJSON(nestedPrint->expression.get()) << "}";
                }
            }
            json << "]}";
        }
        else {
            json << "{\"type\":\"Unknown\"}";
        }
    }
    json << "\n  ]";
    return json.str();
}

// Convert bytecode to JSON
std::string bytecodeToJSON(const BytecodeProgram& bytecode) {
    std::ostringstream json;
    json << "[";
    
    const auto& instructions = bytecode.getInstructions();
    for (size_t i = 0; i < instructions.size(); ++i) {
        if (i > 0) json << ",";
        json << "\n    {";
        json << "\"index\":" << i << ",";
        
        const Instruction& instr = instructions[i];
        json << "\"opcode\":\"" << opcodeToString(instr.opcode) << "\"";
        
        if (instr.opcode == OpCode::LOAD_CONST) {
            json << ",\"operand\":" << instr.intOperand;
        }
        else if (instr.opcode == OpCode::STORE_VAR || instr.opcode == OpCode::LOAD_VAR) {
            json << ",\"variable\":\"" << escapeJSON(instr.strOperand) << "\"";
        }
        
        json << "}";
    }
    
    json << "\n  ]";
    return json.str();
}

int main() {
    // Read source code from stdin
    std::string source;
    std::string line;
    while (std::getline(std::cin, line)) {
        source += line + "\n";
    }
    
    // Start JSON output
    std::cout << "{\n";
    std::cout << "  \"success\": ";
    
    try {
        // Stage 1: Lexical Analysis
        Lexer lexer(source);
        auto tokens = lexer.getAllTokens();
        
        // Stage 2: Parsing
        Parser parser(tokens);
        auto program = parser.parse();
        
        // Stage 3: Semantic Analysis
        SemanticAnalyzer analyzer(program);
        analyzer.analyze();
        
        if (analyzer.hasErrors()) {
            // Handle semantic errors
            std::cout << "false,\n";
            std::cout << "  \"stage\": \"semantic\",\n";
            std::cout << "  \"errors\": [\n";
            
            const auto& errors = analyzer.getErrors();
            for (size_t i = 0; i < errors.size(); ++i) {
                if (i > 0) std::cout << ",\n";
                std::cout << "    {";
                std::cout << "\"message\":\"" << escapeJSON(errors[i].what()) << "\",";
                std::cout << "\"line\":" << errors[i].line << ",";
                std::cout << "\"column\":" << errors[i].column;
                std::cout << "}";
            }
            std::cout << "\n  ],\n";
            
            // Still output tokens and AST for debugging
            std::cout << "  \"tokens\": " << tokensToJSON(tokens) << ",\n";
            std::cout << "  \"ast\": " << astToJSON(program) << "\n";
        }
        else {
            // Stage 4: Optimization
            Optimizer optimizer;
            optimizer.optimize(program);
            int optimizationCount = optimizer.getOptimizationCount();
            
            // Stage 5: Code Generation
            CodeGenerator codegen;
            BytecodeProgram bytecode = codegen.generate(program);
            
            // Stage 6: Execution
            VirtualMachine vm;
            
            // Capture output
            std::ostringstream capturedOutput;
            std::streambuf* oldCoutBuf = std::cout.rdbuf();
            std::cout.rdbuf(capturedOutput.rdbuf());
            
            vm.execute(bytecode);
            
            std::cout.rdbuf(oldCoutBuf);
            std::string output = capturedOutput.str();
            
            // Output all stages
            std::cout << "true,\n";
            std::cout << "  \"tokens\": " << tokensToJSON(tokens) << ",\n";
            std::cout << "  \"ast\": " << astToJSON(program) << ",\n";
            std::cout << "  \"optimizations\": " << optimizationCount << ",\n";
            std::cout << "  \"bytecode\": " << bytecodeToJSON(bytecode) << ",\n";
            std::cout << "  \"output\": \"" << escapeJSON(output) << "\",\n";
            std::cout << "  \"instructionsExecuted\": " << vm.getInstructionCount() << "\n";
        }
    }
    catch (const ParserError& e) {
        std::cout << "false,\n";
        std::cout << "  \"stage\": \"parser\",\n";
        std::cout << "  \"errors\": [{\n";
        std::cout << "    \"message\":\"" << escapeJSON(e.what()) << "\",";
        std::cout << "\"line\":" << e.line << ",";
        std::cout << "\"column\":" << e.column;
        std::cout << "\n  }]\n";
    }
    catch (const std::exception& e) {
        std::cout << "false,\n";
        std::cout << "  \"stage\": \"unknown\",\n";
        std::cout << "  \"errors\": [{\n";
        std::cout << "    \"message\":\"" << escapeJSON(e.what()) << "\"";
        std::cout << "\n  }]\n";
    }
    
    std::cout << "}\n";
    
    return 0;
}
