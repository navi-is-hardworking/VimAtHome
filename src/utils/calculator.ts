

type Precedence = {
    [key: string]: number;
};

export class Calculator {
    private precedence: Precedence;

    constructor() {
        this.precedence = {
            '^': 4,
            '*': 3,
            '/': 3,
            '+': 2,
            '-': 2
        };
    }

    calculate(expression: string): string {
        try {
            expression = expression.replace(/\s+/g, '').toLowerCase();
            
            expression = expression.replace(/^-/, '0-');
            
            expression = expression.replace(/(\d+|\))\(/g, '$1*(');
            expression = expression.replace(/\)(\d+)/g, ')*$1');

            return this.evaluateExpression(expression);
        } catch (error) {
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    private evaluateExpression(expression: string): string {
        if (!expression) return '0';

        while (expression.includes('(')) {
            expression = expression.replace(/\(([^()]+)\)/g, (match, group) => {
                return this.evaluateExpression(group);
            });
        }

        expression = this.handleSpecialFunctions(expression);

        const tokens = this.tokenize(expression);
        
        const postfix = this.infixToPostfix(tokens);
        
        const result = this.evaluatePostfix(postfix);
        return result.toString();
    }

    private handleSpecialFunctions(expression: string): string {
        while (expression.includes('sqrt')) {
            expression = expression.replace(/sqrt\(([^()]+)\)/g, (match, group) => {
                const value = this.evaluateExpression(group);
                const numValue = parseFloat(value);
                if (numValue < 0) throw new Error('Cannot calculate square root of negative number');
                return Math.sqrt(numValue).toString();
            });
        }
        return expression;
    }

    private tokenize(expression: string): string[] {
        const tokens: string[] = [];
        let current = '';
        
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            if ('0123456789.'.includes(char)) {
                current += char;
            } else {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                if ('+-*/^'.includes(char)) {
                    if (char === '-' && (i === 0 || '+-*/^('.includes(expression[i-1]))) {
                        current = '-';
                    } else {
                        tokens.push(char);
                    }
                }
            }
        }
        
        if (current) {
            tokens.push(current);
        }
        
        return tokens;
    }

    private infixToPostfix(tokens: string[]): string[] {
        const output: string[] = [];
        const operators: string[] = [];
        
        for (const token of tokens) {
            if (!isNaN(Number(token))) {
                output.push(token);
            } else {
                while (
                    operators.length > 0 &&
                    this.precedence[operators[operators.length - 1]] >= this.precedence[token]
                ) {
                    const op = operators.pop();
                    if (op) output.push(op);
                }
                operators.push(token);
            }
        }
        
        while (operators.length > 0) {
            const op = operators.pop();
            if (op) output.push(op);
        }
        
        return output;
    }

    private evaluatePostfix(tokens: string[]): number {
        const stack: number[] = [];
        
        for (const token of tokens) {
            if (!isNaN(Number(token))) {
                stack.push(parseFloat(token));
            } else {
                const b = stack.pop();
                const a = stack.pop();
                
                if (typeof a === 'undefined' || typeof b === 'undefined') {
                    throw new Error('Invalid expression');
                }
                
                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case '*':
                        stack.push(a * b);
                        break;
                    case '/':
                        if (b === 0) throw new Error('Division by zero');
                        stack.push(a / b);
                        break;
                    case '^':
                        stack.push(Math.pow(a, b));
                        break;
                    default:
                        throw new Error('Invalid operator');
                }
            }
        }
        
        const result = stack.pop();
        if (typeof result === 'undefined') {
            throw new Error('Invalid expression');
        }
        
        return result;
    }
}
