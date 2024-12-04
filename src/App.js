import React, {useState} from "react";

import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import HistoryBox from "./components/HistoryBox";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [["C", "+-", "%", "/"], [7, 8, 9, "X"], [4, 5, 6, "-"], [1, 2, 3, "+"], [0, ".", "="],];

const toLocaleString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const App = () => {
    const [calc, setCalc] = useState({
        currentInput: "0",
        operationStack: [],
        lastInputType: null // 'number' or 'operation'
    });

    //-----Code for calculating result from stack--------------------------------------------------------
    const calculateResult = (stack) => {
        let result = 0;
        let currentOperation = '+';

        stack.forEach(item => {
            if (item.type === 'number') {
                switch (currentOperation) {
                    case '+':
                        result += item.value;
                        break;
                    case '-':
                        result -= item.value;
                        break;
                    case 'X':
                        result *= item.value;
                        break;
                    case '/':
                        result /= item.value;
                        break;
                }
            } else {
                currentOperation = item.value;
            }
        });
        console.log(stack);
        return result
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
        setCalc(prevCalc => {
            const finalStack = [...prevCalc.operationStack];

            if (prevCalc.lastInputType === 'number') {
                finalStack.push({ type: 'number', value: parseFloat(prevCalc.currentInput) });
            }

            // Perform calculation here (implement PEMDAS)
            const result = calculateResult(finalStack);

            return {
                currentInput: result.toString(),
                operationStack: [],
                lastInputType: 'number'
            };
        });
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
            currentInput: "0",
            operationStack: [],
            lastInputType: null
        });
    };

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
            <HistoryBox>
            </HistoryBox>
        </div>
    </div>

</Wrapper>);
};

export default App;