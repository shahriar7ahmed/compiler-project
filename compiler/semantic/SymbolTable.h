#ifndef SYMBOL_TABLE_H
#define SYMBOL_TABLE_H

#include <string>
#include <unordered_map>

struct VariableInfo {
    std::string name;
    int declarationLine;
    int declarationColumn;
    
    VariableInfo() : name(""), declarationLine(0), declarationColumn(0) {}
    VariableInfo(const std::string& n, int line, int col)
        : name(n), declarationLine(line), declarationColumn(col) {}
};

class SymbolTable {
public:
    SymbolTable() = default;
    
    // Declare a new variable
    void declare(const std::string& name, int line, int column);
    
    // Check if a variable is declared
    bool isDeclared(const std::string& name) const;
    
    // Get variable information
    VariableInfo get(const std::string& name) const;
    
    // Clear all symbols (for testing)
    void clear();
    
private:
    std::unordered_map<std::string, VariableInfo> symbols;
};

#endif
