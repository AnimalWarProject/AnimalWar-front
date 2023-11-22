import React, {useEffect, useState} from "react";
import "../css/UpGrade.css";
import axios from "axios";
const UpGrade = () => {
    const accessToken = localStorage.getItem('accessToken');
    const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;
    const [data, setData] = useState([]); // 동물 데이터
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const [englishGrade, setEnglishGrade] = useState('NORMAL');
    const gradeTap = ['노말', '레어','슈퍼레어','유니크', '레전드']
    const [selectedItemIndex, setSelectedItemIndex] = useState(null); // 선택된 아이템의 인덱스
    const [selectedItem, setSelectedItem] = useState(null);

    // Feat : 등급 탭
    const gradeHandler = (e) => {
        switch (e) {
            case '노말':
                setEnglishGrade('NORMAL')
                break
            case '레어':
                setEnglishGrade('RARE')
                break
            case '슈퍼레어':
                setEnglishGrade('SUPERRARE')
                break
            case '유니크':
                setEnglishGrade('UNIQUE')
                break
            case '레전드':
                setEnglishGrade('LEGEND')
                break
            default:
                setEnglishGrade('NORMAL');
                break;
        }
    }

    const getData = async () => {// todo : api 교체
        axios.get(`http://localhost:8000/api/v1/inventory/animals`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                setData(response.data)
            }).catch((err) => {
            console.log(err + "에러발생")
        })
    };
    const handleItemClick = (item, idx) => {
        if (item.ownedQuantity !== 0 && !item.selected) {
            const updatedData = [...data];
            updatedData[idx] = { ...item, ownedQuantity: item.ownedQuantity - 1 };
            setData(updatedData);
            setSelectedItem(updatedData[idx]);
            setSelectedItemIndex(idx);
            updatedData[idx].selected = true;
        }
    };
    const deletePotHandler = () => {
        if (selectedItem) {
            const updatedData = [...data];
            updatedData[selectedItemIndex] = {
                ...selectedItem,
                ownedQuantity: selectedItem.ownedQuantity + 1,
            };

            setData(updatedData);
            setSelectedItem(null);
            setSelectedItemIndex(null);
            updatedData[selectedItemIndex].selected = false;
        }
    };

    useEffect(() => {
        getData();
    }, [englishGrade]);

    const rows = [];
    for (let i = 0; i < data.length; i ++) {
        rows.push(data.slice(i * itemsPerRow, 3 + (i * itemsPerRow)));
    }

    return (
        <div className="outlet-container" style={{ width: '960px', height: '640px', borderRadius: '0.5rem' }}>
            <div className="outlet-container-wrapBox">
                <div className="outlet-container-innerBox">
                    <div className="outlet-container-activeTap">
                        동물
                    </div>
                    <button className="btn">강화하기</button>
                    <div className="gradeTap" >
                        {gradeTap.map((item, idx) => (
                            <div key={idx}>
                                <div onClick={() => gradeHandler(item)}>{item}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{display:"flex"}}>
                        <div className="upgrade_invBox">
                            <div className="mainBoxWrap">
                                {rows.map((row, rowIndex) => (
                                    <div className="mainBoxWrap-invItem" key={rowIndex} >
                                        {row.map((item, index) => (
                                            <div
                                                className={`upgrade-inven-content ${selectedItem === item ? 'selected' : ''}`}
                                                key={index}
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <img className="upgrade-inven-content-image" src={`${INVImg}/animals/${item.animal.species}/${item.animal.imagePath}`} alt={item.name} />
                                                <div>강화 : {item.upgrade}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="potBox" onClick={() => deletePotHandler()}>
                            {selectedItem && (
                                <div className="potBoxItem">
                                    <img className="potBox-image" onClick={() => deletePotHandler()} src={`${INVImg}/animals/${selectedItem.animal.species}/${selectedItem.animal.imagePath}`} alt={`pot-item-${selectedItemIndex}`} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpGrade;