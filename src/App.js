import React, {useState} from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [["C", "+-", "%", "/"], [7, 8, 9, "X"], [4, 5, 6, "-"], [1, 2, 3, "+"], [0, ".", "="],];

const App = () => {
    const [calc, setCalc] = useState({
        currentInput: "0",
        operationStack: [],
        lastInputType: null, // 'number' or 'operation
        history: []
    });

    //-----Code for calculating result from stack--------------------------------------------------------
    const shuntingYard = (operationStack) => {
        const precedence = {'+': 1, '-': 1, 'X': 2, '/': 2};
        const outputQueue = [];
        const operatorStack = [];

        for (const item of operationStack) {
            if (item.type === 'number') {
                outputQueue.push(item.value);
            } else if (item.type === 'operation') {
                while (operatorStack.length > 0 &&
                precedence[operatorStack[operatorStack.length - 1]] >= precedence[item.value]) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(item.value);
            }
        }

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }

        return outputQueue;
    };

    const calculatePostfix = (postfixExpression) => {
        const stack = [];

        for (const token of postfixExpression) {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();

                switch (token) {
                    case '+':
                        stack.push(a + b);
                        break;
                    case '-':
                        stack.push(a - b);
                        break;
                    case 'X':
                        stack.push(a * b);
                        break;
                    case '/':
                        stack.push(a / b);
                        break;
                }
            }
        }

        return stack[0];
    };

    const postfixToInfix = (postfixExpression) => {
        const stack = [];
        const precedence = {'+': 1, '-': 1, 'X': 2, '/': 2};

        for (const token of postfixExpression) {
            if (typeof token === 'number') {
                stack.push(token.toString());
            } else {
                const right = stack.pop();
                const left = stack.pop();

                // Determine if parentheses are needed
                const needParens = (op, expr) => {
                    if (typeof expr === 'number') return false;
                    return precedence[op] > precedence[expr[0]] ||
                        (precedence[op] === precedence[expr[0]] && op !== expr[0]);
                };

                const leftWithParens = needParens(token, left) ? `(${left})` : left;
                const rightWithParens = needParens(token, right) ? `(${right})` : right;

                stack.push(`${leftWithParens} ${token} ${rightWithParens}`);
            }
        }

        return stack[0];
    }

    const calculateResult = (stack) => {
        const postfixExpression = shuntingYard(stack);
        return [calculatePostfix(postfixExpression), postfixToInfix(postfixExpression)]
    };

    //-----Code for input handling--------------------------------------------------------
    const numClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc(prevCalc => ({
            ...prevCalc,
            currentInput: prevCalc.currentInput === "0" ? value : prevCalc.currentInput + value,
            lastInputType: 'number',

        }));
    };

    const commaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc(prevCalc => ({
            ...prevCalc,
            currentInput: !prevCalc.currentInput.includes(".") ? prevCalc.currentInput + value : prevCalc.currentInput,
            lastInputType: 'number'
        }));
    };

    const signClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc(prevCalc => {
            const newStack = [...prevCalc.operationStack];
            if (prevCalc.lastInputType === 'number') {
                newStack.push({type: 'number', value: parseFloat(prevCalc.currentInput)});
            }
            newStack.push({type: 'operation', value: value});

            return {
                ...prevCalc,
                operationStack: newStack,
                currentInput: "0",
                lastInputType: 'operation'
            };
        });
    };


    const equalsClickHandler = () => {
        if (calc.lastInputType) {
            setCalc(prevCalc => {
                const finalStack = [...prevCalc.operationStack];

                if (prevCalc.lastInputType === 'number') {
                    finalStack.push({type: 'number', value: parseFloat(prevCalc.currentInput)});
                }

                const result = calculateResult(finalStack);

                return {
                    currentInput: result[0].toString(),
                    operationStack: [],
                    lastInputType: 'number',
                    history: [...prevCalc.history, result[1]]
                };
            });
        }
    };


    const invertClickHandler = () => {
        setCalc(prevCalc => ({
            ...prevCalc,
            currentInput: (-parseFloat(prevCalc.currentInput)).toString(),
            lastInputType: 'number'
        }));
    };

    const percentClickHandler = () => {
        setCalc(prevCalc => ({
            ...prevCalc,
            currentInput: (parseFloat(prevCalc.currentInput) / 100).toString(),
            lastInputType: 'number'
        }));
    };

    const resetClickHandler = () => {
        setCalc({
            ...calc,
            currentInput: "0",
            operationStack: [],
            lastInputType: null
        });
    };

    const HistoryList = ({expressions}) => (
        <select size="5" className="historyBox">
            {expressions.map((expr, index) => (
                <option key={index}>{expr}</option>
            ))}
        </select>
    );
    return (<Wrapper>
        <Screen value={calc.currentInput}/>
        <div className="container">
            <div className="component">
                <ButtonBox>
                    {btnValues.flat().map((btn, i) => {
                        return (<Button
                            key={i}
                            className={btn === "=" ? "equals" : ""}
                            value={btn}
                            onClick={btn === "C" ? resetClickHandler : btn === "+-" ?
                                invertClickHandler : btn === "%" ? percentClickHandler :
                                    btn === "=" ? equalsClickHandler : btn === "/" || btn === "X" ||
                                    btn === "-" || btn === "+" ? signClickHandler : btn === "." ?
                                        commaClickHandler : numClickHandler}
                        />);
                    })}
                </ButtonBox>
            </div>
            <div className="component">
                <HistoryList expressions={calc.history}>
                </HistoryList>
            </div>
        </div>

    </Wrapper>);
};

export default App;