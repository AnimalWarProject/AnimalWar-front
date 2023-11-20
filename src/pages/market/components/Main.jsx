import "../css/Main.css" ;
import {useEffect, useRef, useState} from "react";
import axios from "axios";

const Main = ({ selectedAnimalType, selectedSort, searchWord, selectedGrade }) => {
    const [sortedData, setSortedData] = useState([]);
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const containerRef = useRef();
    const [userInfo, setUserInfo] = useState({})
    const accessToken = localStorage.getItem('accessToken');

    const onClickBuy = (item) => {
        if (userInfo.gold >= item.price){
            const buyInfo = { // request
                userUUID: item.userId,
                itemId: item.itemId,
                name: item.name,
                grade: item.grade,
                type: item.type,
                buff: item.buff,
                price: item.price
            };

            axios.post(`http://localhost:8000/api/v1/user/buyitem`, buyInfo,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then((response) => {
                alert("구매완료")
            }).catch((err) => {
                console.log("오류 발생 : " + err)
            })
        }
    };
    const onClickCancel = (item) => { // 취소버튼
        if (userInfo.gold >= item.price){
            const cancelInfo = { // request
                userUUID: item.userId,
                itemId: item.itemId,
                name: item.name,
                grade: item.grade,
                type: item.type,
                buff: item.buff,
                price: item.price
            };

            axios.post(`http://localhost:8000/api/v1/user/cancelitem`, cancelInfo,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then((response) => {
                alert("취소완료")
            }).catch((err) => {
                console.log("오류 발생 : " + err)
            })
        }

    }
    const onClickTake = () => { // 수령버튼

    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            setUserInfo(response.data)
        }).catch((err) => {
            console.log(err + "에러 발생 유저인포")
        })
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
    for (let i = 0; i < sortedData.length; i++) {
        rows.push(sortedData.slice(i * itemsPerRow, 3 + (i * itemsPerRow)));
    }

    return (
        <div ref={containerRef} className="main-container">
            {rows.map((row, rowIndex) => (
                <div className="main-list-wrap" key={rowIndex}>
                    {row.map((item, index) => {
                        const showButtons = userInfo.uuid === item.userId; // 유저id와 아이템에 등록된유저 id가 같으면 표시됨.
                        const showBuyBtn = item.btnState;

                        return (
                            <div className="main-list-content" key={index}>
                                <div>{item.name}</div>
                                <div>{item.price}</div>
                                {showBuyBtn &&
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button onClick={() => onClickBuy(item)}>구매</button>
                                    </div>
                                }
                                {showButtons && (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <button onClick={onClickCancel}>취소</button>
                                        <button onClick={onClickTake}>수령</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
export default Main;





