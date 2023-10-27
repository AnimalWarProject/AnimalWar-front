import './Background.css';

const Background = ({ children, className }) => {
    return (
        <div className={`outer-box ${className}`}>
            <div className="second-box">
                <div className="third-box">
                    <div className="inner-box">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Background;
