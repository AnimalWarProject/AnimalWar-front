import classes from '../../common/components/Mix.module.css';
import { api } from '../../network/api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { DebugUtils } from 'pixi-spine';
import { tab } from '@testing-library/user-event/dist/tab';

const Mix = () => {
    const [allData, setAllData] = useState({ animals: [], buildings: [] });
    const [displayedData, setDisplayedData] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [englishGrade, setEnglishGrade] = useState('NORMAL');
    const [entityType, setEntityType] = useState('animals');
    const [gradeTap, setGradeTap] = useState(['노말', '레어', '슈퍼레어', '유니크', '레전드']);
    const navigate = useNavigate();

    // 데이터를 한 번에 불러오고 필터링하는 함수
    const loadData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const animalsResponse = await api('/api/v1/inventory/animals', 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const buildingsResponse = await api('/api/v1/inventory/buildings', 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            // 동물 데이터에 mixableQuantity 추가
            const updatedAnimals = animalsResponse.data.map((item) => ({
                ...item,
                mixableQuantity: Math.max(item.ownedQuantity - 1 - item.placedQuantity, 0),
            }));
            // 건물 데이터에 mixableQuantity 추가
            const updatedBuildings = buildingsResponse.data.map((item) => ({
                ...item,
                mixableQuantity: Math.max(item.ownedQuantity - 1 - item.placedQuantity, 0),
            }));

            setAllData({
                animals: updatedAnimals,
                buildings: updatedBuildings,
            });

            filterData('animals', 'NORMAL');
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    // 필터링 로직
    const filterData = (entityType, grade) => {
        const newData = allData[entityType].filter((item) => {
            const itemGrade = item.animal ? item.animal.grade : item.building ? item.building.grade : null;
            return item.mixableQuantity > 0 && itemGrade && itemGrade.toUpperCase() === grade.toUpperCase();
        });
        setDisplayedData(newData);
    };

    const mapGradeToEnglish = (grade) => {
        const gradeMapping = {
            노말: 'NORMAL',
            레어: 'RARE',
            슈퍼레어: 'SUPERRARE',
            유니크: 'UNIQUE',
            레전드: 'LEGEND',
        };
        return gradeMapping[grade] || 'NORMAL';
    };

    // 탭 변경 핸들러
    const entityTypeHandler = (type) => {
        setEntityType(type);
        filterData(type, englishGrade);
    };

    const gradeHandler = (grade) => {
        const englishGrade = mapGradeToEnglish(grade);
        setEnglishGrade(englishGrade);
        filterData(entityType, englishGrade);
    };

    // Feat : imgUrl 저장
    const getImgUrl = (item) => {
        if (entityType === 'animals' && item.animal) {
            // 동물 이미지 URL 생성
            return `${process.env.PUBLIC_URL}/objectImgs/${entityType}/${item.animal.species}/${item.animal.imagePath}`;
        } else if (entityType === 'buildings' && item.building) {
            // 건물 이미지 URL 생성
            return `${process.env.PUBLIC_URL}/objectImgs/buildings/${item.building.imagePath}`;
        } else {
            return 'defaultImagePathOrLoadingIndicator';
        }
    };

    // 합성 시작 핸들러
    const goToMixStartHandler = () => {
        const accessToken = localStorage.getItem('accessToken');
        const modifiedEntityType = entityType.slice(0, -1).toUpperCase(); // 맨 마지막 -s를 빼고 대문자로 변환

        // selectedItems 배열에서 필요한 ID 추출
        const selectedArr = selectedItems.map((selectedData) =>
            modifiedEntityType === 'ANIMAL' ? selectedData.animal.animalId : selectedData.building.buildingId
        );

        api(
            `/api/v1/mix`,
            'POST',
            {
                accessToken: accessToken,
                entityType: modifiedEntityType,
                grade: englishGrade,
                selectedList: selectedArr,
            },
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        )
            .then((res) => {
                if (res.status == 200) {
                    // 실패면 1.. 성공이면 2
                    const data = res.data.data == null ? 1 : 2;
                    const result = JSON.stringify(res.data.data);

                    localStorage.setItem('result', result);
                    navigate(`/mix2?data=${data}`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // 항아리에 아이템 넣기 핸들러
    const getPotHandler = (idx, imgUrl) => {
        if (selectedItems.length >= 4) {
            alert('항아리에는 최대 4개의 아이템만 넣을 수 있습니다.');
            return;
        }

        const item = displayedData[idx];
        const itemType = item.animal ? 'ANIMAL' : 'BUILDING';

        // 첫 번째 아이템 선택 또는 동일한 유형의 아이템 선택인 경우
        if (!selectedType || selectedType === itemType) {
            if (item.mixableQuantity > 0) {
                setSelectedItems((prevItems) => [...prevItems, { ...item, imgUrl }]);
                setSelectedType(itemType);

                // allData 업데이트
                const updatedAllData = { ...allData };
                updatedAllData[entityType] = updatedAllData[entityType].map((dataItem, dataIdx) => {
                    if (dataItem === item) {
                        return { ...dataItem, mixableQuantity: dataItem.mixableQuantity - 1 };
                    }
                    return dataItem;
                });
                setAllData(updatedAllData);
            } else {
                alert('이 아이템은 항아리에 넣을 수 없습니다.');
            }
        } else {
            alert(`이미 ${selectedType === 'ANIMAL' ? '동물' : '건물'}이 선택되었습니다.`);
        }
    };

    // 항아리 초기화 핸들러
    const deletePotHandler = () => {
        setSelectedItems([]);
        setSelectedType(null);
        loadData();
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterData(entityType, englishGrade);
    }, [allData, entityType, englishGrade]);

    return (
        <div className="outlet-container" style={{ width: '960px', height: '640px', borderRadius: '0.5rem' }}>
            <div className={classes.warpBox}>
                <div className={classes.innerBox}>
                    <div className={classes.activeTap}>
                        <div onClick={() => entityTypeHandler('animals')}>
                            <p>동물</p>
                        </div>
                        <div onClick={() => entityTypeHandler('buildings')}>
                            <p>건물</p>
                        </div>
                    </div>
                    <div
                        className={classes.btn}
                        onClick={selectedItems.length === 4 ? () => goToMixStartHandler() : null}
                    >
                        <div>
                            <p>합성하기</p>
                        </div>
                    </div>
                    <div className={classes.gradeTap}>
                        {gradeTap.map((item, idx) => (
                            <div key={idx} onClick={() => gradeHandler(item)}>
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                    <div className={classes.mainBoxWrap}>
                        <div className={classes.invBox}>
                            {displayedData.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={classes.invItem}
                                    onClick={() => getPotHandler(idx, getImgUrl(item))}
                                >
                                    <p>{item.mixableQuantity}</p>
                                    <img src={getImgUrl(item)} alt={`item-${idx}`} />
                                </div>
                            ))}
                        </div>

                        <div className={classes.potBox} onClick={() => deletePotHandler()}>
                            <div className={classes.potBoxItemWrap}>
                                {selectedItems.map((item, idx) => (
                                    <div key={idx} className={classes.potBoxItem}>
                                        <img src={item.imgUrl} alt={`pot-item-${idx}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Mix;
