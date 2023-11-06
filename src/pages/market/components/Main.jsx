import "../css/Main.css" ;
import {useEffect, useState} from "react";
import axios from "axios";

const Main = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const itemsPerPage = 9; // 한 페이지에 표시할 항목 수

    useEffect(() => {
        axios
            .get("http://localhost:8082/api/v1/exchange/all")
            .then((response) => {
                setData(response.data); // 데이터를 상태에 저장
            })
            .catch((error) => {
                console.error("데이터 가져오기 실패:", error);
            });
    }, []);

    const maxPages = Math.ceil(data.length / itemsPerPage);

    const visibleData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const rows = [];

    for (let i = 0; i < visibleData.length; i += itemsPerRow) {
        rows.push(visibleData.slice(i, i + itemsPerRow));
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="main-container">
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
            <div className="pagination">
                {Array.from({ length: maxPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Main;