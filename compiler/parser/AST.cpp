#include "AST.h"
#include <iostream>
#include <string>

// Helper function to print indentation
static void printIndent(int indent) {
    for (int i = 0; i < indent; ++i) {
        std::cout << "  ";
    }
}

// LetStatement implementation
LetStatement::LetStatement(const std::string& id, std::unique_ptr<Expression> expr, int ln, int col)
    : identifier(id), expression(std::move(expr)), line(ln), column(col) {}

void LetStatement::print(int indent) const {
    printIndent(indent);
    std::cout << "LetStatement\n";
    printIndent(indent + 1);
    std::cout << "identifier: " << identifier << "\n";
    printIndent(indent + 1);
    std::cout << "expression:\n";
    expression->print(indent + 2);
}

// PrintStatement implementation
PrintStatement::PrintStatement(std::unique_ptr<Expression> expr)
    : expression(std::move(expr)) {}

void PrintStatement::print(int indent) const {
    printIndent(indent);
    std::cout << "PrintStatement\n";
    printIndent(indent + 1);
    std::cout << "expression:\n";
    expression->print(indent + 2);
}

// IntegerLiteral implementation
IntegerLiteral::IntegerLiteral(int val) : value(val) {}

void IntegerLiteral::print(int indent) const {
    printIndent(indent);
    std::cout << "IntegerLiteral: " << value << "\n";
}

// Variable implementation
Variable::Variable(const std::string& n, int ln, int col) 
    : name(n), line(ln), column(col) {}

void Variable::print(int indent) const {
    printIndent(indent);
    std::cout << "Variable: " << name << "\n";
}

// BinaryOperation implementation
BinaryOperation::BinaryOperation(std::unique_ptr<Expression> l, 
                                 const std::string& operation,
                                 std::unique_ptr<Expression> r)
    : left(std::move(l)), op(operation), right(std::move(r)) {}

void BinaryOperation::print(int indent) const {
    printIndent(indent);
    std::cout << "BinaryOperation: " << op << "\n";
    printIndent(indent + 1);
    std::cout << "left:\n";
    left->print(indent + 2);
    printIndent(indent + 1);
    std::cout << "right:\n";
    right->print(indent + 2);
}
