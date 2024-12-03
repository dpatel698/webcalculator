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
        sign: "",
        num: 0,
        res: 0,
        operationStack: []
    });

    //-----Code for calculating result from stack--------------------------------------------------------
    const calculateResult = () => {
        let result = 0;
        let currentOperation = '+';

        calc.operationStack.forEach(item => {
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
        console.log(result);
        setCalc({
            ...calc,
            operationStack: [],
            sign: "",
            num: toLocaleString(Number(removeSpaces(result))),
            res: result
        });
    };

    //-----Code for input handling--------------------------------------------------------
    const numClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        if (removeSpaces(calc.num).length < 16) {
            setCalc({
                num: calc.num === 0 && value === "0" ? "0" : removeSpaces(calc.num) % 1 === 0 ? toLocaleString(Number(removeSpaces(calc.num + value))) : toLocaleString(calc.num + value),
                res: !calc.sign ? 0 : calc.res,
                operationStack: [
                    ...calc.operationStack,
                    {type: 'number', value: calc.num === 0 && value === "0" ? "0" : calc.num % 1 === 0 ? Number(removeSpaces(calc.num + value)) : calc.num + value},
                ]
            });
        }
    };

    const commaClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc, num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
        });
    };

    const signClickHandler = (e) => {
        e.preventDefault();
        const value = e.target.innerHTML;

        setCalc({
            ...calc,
            operationStack: [
                ...calc.operationStack,
                {type: 'number', value: Number(removeSpaces(calc.num))},
                {type: 'operation', value: value}
            ],
            sign: value,
            num: 0
        });
    };

    const equalsClickHandler = () => {
        if (calc.num) {
            // Add the final number to stack before calculating
            setCalc({
                ...calc,
                operationStack: [
                    ...calc.operationStack,
                    {type: 'number', value: Number(removeSpaces(calc.num))},
                ],
            });
        }
        console.log(calc.operationStack);
        calculateResult();
    };

    const invertClickHandler = () => {
        setCalc({
            ...calc,
            num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
            res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
            sign: "",
        });
    };

    const percentClickHandler = () => {
        let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
        let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

        setCalc({
            ...calc, num: (num /= Math.pow(100, 1)), res: (res /= Math.pow(100, 1)), sign: "",
        });
    };

    const resetClickHandler = () => {
        setCalc({
            ...calc, sign: "", num: 0, res: 0,
        });
    };

    return (<Wrapper>
        <Screen value={calc.num ? calc.num : calc.res}/>
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