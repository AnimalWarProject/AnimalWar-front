import "../css/Main.css" ;
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const Main = ({ selectedAnimalType }) => {
    const [data, setData] = useState([]);
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const containerRef = useRef();

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/v1/market/all`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            })
    }, []);

    const rows = [];
    for (let i = 0; i < data.length; i ++) {
        rows.push(data.slice(i*itemsPerRow, 3+(i*itemsPerRow)));
    }

    return (
        <div ref={containerRef} className="main-container"s>
            {rows.map((row, rowIndex) => (
                <div className="main-list-wrap" key={rowIndex}>
                    {row.map((item, index) => (
                        <div className="main-list-content" key={index}>
                            <div>{item.name}</div>
                            <div>{item.price}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Main;





