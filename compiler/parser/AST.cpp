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

// ComparisonExpression implementation
ComparisonExpression::ComparisonExpression(std::unique_ptr<Expression> l,
                                         const std::string& operation,
                                         std::unique_ptr<Expression> r)
    : left(std::move(l)), op(operation), right(std::move(r)) {}

void ComparisonExpression::print(int indent) const {
    printIndent(indent);
    std::cout << "ComparisonExpression: " << op << "\n";
    printIndent(indent + 1);
    std::cout << "left:\n";
    left->print(indent + 2);
    printIndent(indent + 1);
    std::cout << "right:\n";
    right->print(indent + 2);
}

// LogicalExpression implementation
LogicalExpression::LogicalExpression(std::unique_ptr<Expression> l,
                                   const std::string& operation,
                                   std::unique_ptr<Expression> r)
    : left(std::move(l)), op(operation), right(std::move(r)) {}

void LogicalExpression::print(int indent) const {
    printIndent(indent);
    std::cout << "LogicalExpression: " << op << "\n";
    printIndent(indent + 1);
    std::cout << "left:\n";
    left->print(indent + 2);
    printIndent(indent + 1);
    std::cout << "right:\n";
    right->print(indent + 2);
}

// UnaryExpression implementation
UnaryExpression::UnaryExpression(const std::string& operation,
                               std::unique_ptr<Expression> operand)
    : op(operation), operand(std::move(operand)) {}

void UnaryExpression::print(int indent) const {
    printIndent(indent);
    std::cout << "UnaryExpression: " << op << "\n";
    printIndent(indent + 1);
    std::cout << "operand:\n";
    operand->print(indent + 2);
}

// IfStatement implementation
IfStatement::IfStatement(std::unique_ptr<Expression> cond,
                       std::vector<std::unique_ptr<Statement>> thenStmts,
                       std::vector<std::unique_ptr<Statement>> elseStmts)
    : condition(std::move(cond)), 
      thenBlock(std::move(thenStmts)), 
      elseBlock(std::move(elseStmts)) {}

void IfStatement::print(int indent) const {
    printIndent(indent);
    std::cout << "IfStatement\n";
    printIndent(indent + 1);
    std::cout << "condition:\n";
    condition->print(indent + 2);
    printIndent(indent + 1);
    std::cout << "thenBlock:\n";
    for (const auto& stmt : thenBlock) {
        stmt->print(indent + 2);
    }
    if (!elseBlock.empty()) {
        printIndent(indent + 1);
        std::cout << "elseBlock:\n";
        for (const auto& stmt : elseBlock) {
            stmt->print(indent + 2);
        }
    }
}

// ForStatement implementation
ForStatement::ForStatement(const std::string& var,
                         std::unique_ptr<Expression> startExpr,
                         std::unique_ptr<Expression> endExpr,
                         std::vector<std::unique_ptr<Statement>> bodyStmts)
    : variable(var),
      start(std::move(startExpr)),
      end(std::move(endExpr)),
      body(std::move(bodyStmts)) {}

void ForStatement::print(int indent) const {
    printIndent(indent);
    std::cout << "ForStatement\n";
    printIndent(indent + 1);
    std::cout << "variable: " << variable << "\n";
    printIndent(indent + 1);
    std::cout << "start:\n";
    start->print(indent + 2);
    printIndent(indent + 1);
    std::cout << "end:\n";
    end->print(indent + 2);
    printIndent(indent + 1);
    std::cout << "body:\n";
    for (const auto& stmt : body) {
        stmt->print(indent + 2);
    }
}

