import "../css/Main.css" ;
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const Main = ({ selectedAnimalType, selectedSort }) => {
    const [sortedData, setSortedData] = useState([]);
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const containerRef = useRef();
    let url = "";

    useEffect(() => {
        if (selectedAnimalType === ""){
            axios
                .get(`http://localhost:8000/api/v1/market/all`)
                .then((response) => {
                    if (selectedSort === 'DESC') {
                        setSortedData([...response.data].sort((a, b) => a.price - b.price));
                    } else if (selectedSort === 'ASC') {
                        setSortedData([...response.data].sort((a, b) => b.price - a.price));
                    } else {
                        setSortedData(response.data);
                    }
                })
                .catch((error) => {
                    console.error("데이터 가져오기 실패:", error);
                })
        }else {
            axios
                .post(`http://localhost:8000/api/v1/market/filter/${selectedAnimalType}`)
                .then((response) => {
                    if (selectedSort === 'DESC') {
                        setSortedData([...response.data].sort((a, b) => a.price - b.price));
                    } else if (selectedSort === 'ASC') {
                        setSortedData([...response.data].sort((a, b) => b.price - a.price));
                    } else {
                        setSortedData(response.data);
                    }
                })
                .catch((error) => {
                    console.error("데이터 가져오기 실패:", error);
                })
        }

    }, [selectedAnimalType, selectedSort]);
    const rows = [];
    for (let i = 0; i < sortedData.length; i ++) {
        rows.push(sortedData.slice(i*itemsPerRow, 3+(i*itemsPerRow)));
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





