import React, { useEffect, useState } from 'react';
import '../css/UpGrade.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../network/api';
const UpGrade = () => {
    const [allData, setAllData] = useState([]);
    const accessToken = localStorage.getItem('accessToken');
    const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;
    const [data, setData] = useState([]); // 동물 데이터
    const itemsPerRow = 3; // 한 행당 표시할 항목 수
    const [englishGrade, setEnglishGrade] = useState('NORMAL');
    const gradeTap = ['노말', '레어', '슈퍼레어', '유니크', '레전드'];
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const nav = useNavigate();
    const [sendUserInfo, setSendUserInfo] = useState();
    // Feat : 등급 탭
    const gradeHandler = (e) => {
        let grade;
        switch (e) {
            case '노말':
                grade = 'NORMAL';
                break;
            case '레어':
                grade = 'RARE';
                break;
            case '슈퍼레어':
                grade = 'SUPERRARE';
                break;
            case '유니크':
                grade = 'UNIQUE';
                break;
            case '레전드':
                grade = 'LEGEND';
                break;
            default:
                grade = 'NORMAL';
                break;
        }
        setEnglishGrade(grade);
    };


    const getInfo = async () => {
        try {
            const { data: response } = await api(`/api/v1/user`, 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setSendUserInfo(response.uuid)
        } catch (error) {
        }
    };
    useEffect(() => {
        const filteredData = allData.filter((item) => {
            switch (englishGrade) {
                case 'NORMAL':
                    return item.animal.grade === 'NORMAL';
                case 'RARE':
                    return item.animal.grade === 'RARE';
                case 'SUPERRARE':
                    return item.animal.grade === 'SUPERRARE';
                case 'UNIQUE':
                    return item.animal.grade === 'UNIQUE';
                case 'LEGEND':
                    return item.animal.grade === 'LEGEND';
                default:
                    return true;
            }
        });
        setData(filteredData);
    }, [englishGrade, allData]);

    const getData = async () => {
        try {
            const { data: response } = await api(`/api/v1/inventory/animals`, 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setAllData(response); // 모든 데이터를 한 번에 저장
        } catch (error) {
            console.log(error + '에러발생');
        }
    };

    useEffect(() => {
        getData();
        getInfo();
    }, []);

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

    const onClickUpgrade = () => {
        if (selectedItem.upgrade < 9) {
            nav('/upgrade/loading', { state: { selectedItem, sendUserInfo } });
        } else {
            alert('강화 최고치.');
        }
    };

    const rows = [];
    const filteredData = data.filter((item) => item.animal.grade === englishGrade);
    for (let i = 0; i < filteredData.length; i++) {
        rows.push(filteredData.slice(i * itemsPerRow, itemsPerRow + i * itemsPerRow));
    }

    return (
        <div className="outlet-container" style={{ width: '960px', height: '640px', borderRadius: '0.5rem' }}>
            <div className="outlet-container-wrapBox">
                <div className="outlet-container-innerBox">
                    <div className="outlet-container-activeTap">동물</div>
                    <button onClick={onClickUpgrade} className="btn">
                        강화하기
                    </button>
                    <div className="gradeTap">
                        {gradeTap.map((item, idx) => (
                            <div key={idx}>
                                <div onClick={() => gradeHandler(item)}>{item}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className="upgrade_invBox">
                            <div className="mainBoxWrap">
                                {rows.map((row, rowIndex) => (
                                    <div className="mainBoxWrap-invItem" key={rowIndex}>
                                        {row.map((item, index) => (
                                            <div
                                                className={`upgrade-inven-content ${
                                                    selectedItem === item ? 'selected' : ''
                                                }`}
                                                key={index}
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <img
                                                    className="upgrade-inven-content-image"
                                                    src={`${INVImg}/animals/${item.animal.species}/${item.animal.imagePath}`}
                                                    alt={item.name}
                                                />
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
                                    <img
                                        className="potBox-image"
                                        onClick={() => deletePotHandler()}
                                        src={`${INVImg}/animals/${selectedItem.animal.species}/${selectedItem.animal.imagePath}`}
                                        alt={`pot-item-${selectedItemIndex}`}
                                    />
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
