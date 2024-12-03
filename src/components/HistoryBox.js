// Screen where calculation history is displayed
import "./HistoryBox.css"
import { Textfit } from "react-textfit";

const HistoryBox = ({ value }) => {
    return (
        <Textfit className="historyBox" mode="single" max={70}>
            {value}
        </Textfit>
    );
};

export default HistoryBox;