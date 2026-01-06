#ifndef AST_H
#define AST_H

#include <string>
#include <memory>
#include <vector>

// Forward declarations
class ASTNode;
class Statement;
class Expression;

// Base class for all AST nodes
class ASTNode {
public:
    virtual ~ASTNode() = default;
    virtual void print(int indent = 0) const = 0;
};

// Base class for statements
class Statement : public ASTNode {
public:
    virtual ~Statement() = default;
};

// Base class for expressions
class Expression : public ASTNode {
public:
    virtual ~Expression() = default;
};

// Statement: let identifier = expression;
class LetStatement : public Statement {
public:
    std::string identifier;
    std::unique_ptr<Expression> expression;
    
    LetStatement(const std::string& id, std::unique_ptr<Expression> expr);
    void print(int indent = 0) const override;
};

// Statement: print expression;
class PrintStatement : public Statement {
public:
    std::unique_ptr<Expression> expression;
    
    explicit PrintStatement(std::unique_ptr<Expression> expr);
    void print(int indent = 0) const override;
};

// Expression: integer literal
class IntegerLiteral : public Expression {
public:
    int value;
    
    explicit IntegerLiteral(int val);
    void print(int indent = 0) const override;
};

// Expression: variable reference
class Variable : public Expression {
public:
    std::string name;
    
    explicit Variable(const std::string& n);
    void print(int indent = 0) const override;
};

// Expression: binary operation (left op right)
class BinaryOperation : public Expression {
public:
    std::unique_ptr<Expression> left;
    std::string op;
    std::unique_ptr<Expression> right;
    
    BinaryOperation(std::unique_ptr<Expression> l, const std::string& operation, 
                    std::unique_ptr<Expression> r);
    void print(int indent = 0) const override;
};

#endif
