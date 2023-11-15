import "../css/Main.css" ;
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const Main = ({ selectedAnimalType, selectedSort, searchWord, selectedGrade }) => {
    const [sortedData, setSortedData] = useState([]);
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const containerRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            let response = [];

            try {
                if (selectedAnimalType === "" && searchWord === "") {
                    response = await axios.get(`http://localhost:8000/api/v1/market/all`);
                } else if (searchWord !== "") {
                    response = await axios.post(`http://localhost:8000/api/v1/market/search/${searchWord}`);
                } else if (selectedAnimalType !== "") {
                    response = await axios.post(`http://localhost:8000/api/v1/market/filter/${selectedAnimalType}`);
                }

                // Filter data based on selectedGrade
                if (selectedGrade) {
                    const filteredData = response.data.filter(item => item.grade === selectedGrade);

                    if (selectedSort === 'DESC') {
                        setSortedData([...filteredData].sort((a, b) => a.price - b.price));
                    } else if (selectedSort === 'ASC') {
                        setSortedData([...filteredData].sort((a, b) => b.price - a.price));
                    } else {
                        setSortedData(filteredData);
                    }
                } else {
                    // If selectedGrade is not set, apply sorting without filtering
                    if (selectedSort === 'DESC') {
                        setSortedData([...response.data].sort((a, b) => a.price - b.price));
                    } else if (selectedSort === 'ASC') {
                        setSortedData([...response.data].sort((a, b) => b.price - a.price));
                    } else {
                        setSortedData(response.data);
                    }
                }
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };

        fetchData();
    }, [selectedAnimalType, selectedSort, searchWord, selectedGrade]);
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





