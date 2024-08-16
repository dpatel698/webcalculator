// Frame holding all the calculator components together
import "./Wrapper.css";

const Wrapper = ({ children }) => {
    return <div className="wrapper">{children}</div>;
};

export default Wrapper;