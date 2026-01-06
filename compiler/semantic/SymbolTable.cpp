#include "SymbolTable.h"

void SymbolTable::declare(const std::string& name, int line, int column) {
    symbols[name] = VariableInfo(name, line, column);
}

bool SymbolTable::isDeclared(const std::string& name) const {
    return symbols.find(name) != symbols.end();
}

VariableInfo SymbolTable::get(const std::string& name) const {
    auto it = symbols.find(name);
    if (it != symbols.end()) {
        return it->second;
    }
    return VariableInfo(); // Return empty if not found
}

void SymbolTable::clear() {
    symbols.clear();
}
