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
    int line;
    int column;
    
    LetStatement(const std::string& id, std::unique_ptr<Expression> expr, int ln, int col);
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
    int line;
    int column;
    
    Variable(const std::string& n, int ln, int col);
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

// Expression: comparison operation (left op right) - ==, !=, <, <=, >, >=
class ComparisonExpression : public Expression {
public:
    std::unique_ptr<Expression> left;
    std::string op;  // ==, !=, <, <=, >, >=
    std::unique_ptr<Expression> right;
    
    ComparisonExpression(std::unique_ptr<Expression> l, const std::string& operation,
                        std::unique_ptr<Expression> r);
    void print(int indent = 0) const override;
};

// Expression: logical operation (left op right) - &&, ||
class LogicalExpression : public Expression {
public:
    std::unique_ptr<Expression> left;
    std::string op;  // &&, ||
    std::unique_ptr<Expression> right;
    
    LogicalExpression(std::unique_ptr<Expression> l, const std::string& operation,
                     std::unique_ptr<Expression> r);
    void print(int indent = 0) const override;
};

// Expression: unary operation (op operand) - !
class UnaryExpression : public Expression {
public:
    std::string op;  // !
    std::unique_ptr<Expression> operand;
    
    UnaryExpression(const std::string& operation, std::unique_ptr<Expression> operand);
    void print(int indent = 0) const override;
};

// Statement: if (condition) { thenBlock } else { elseBlock }
class IfStatement : public Statement {
public:
    std::unique_ptr<Expression> condition;
    std::vector<std::unique_ptr<Statement>> thenBlock;
    std::vector<std::unique_ptr<Statement>> elseBlock;  // optional
    
    IfStatement(std::unique_ptr<Expression> cond,
               std::vector<std::unique_ptr<Statement>> thenStmts,
               std::vector<std::unique_ptr<Statement>> elseStmts = {});
    void print(int indent = 0) const override;
};

// Statement: for variable = start to end { body }
class ForStatement : public Statement {
public:
    std::string variable;
    std::unique_ptr<Expression> start;
    std::unique_ptr<Expression> end;
    std::vector<std::unique_ptr<Statement>> body;
    
    ForStatement(const std::string& var,
                std::unique_ptr<Expression> startExpr,
                std::unique_ptr<Expression> endExpr,
                std::vector<std::unique_ptr<Statement>> bodyStmts);
    void print(int indent = 0) const override;
};

#endif
