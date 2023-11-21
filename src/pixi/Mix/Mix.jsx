import classes from '../../common/components/Mix.module.css';
import { api } from "../../network/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const Mix = () => {
    const [data, setData] = useState([]);
    const [initialOwnedQuantity, setInitialOwnedQuantity] = useState([]) // ownedQuantity을 초기화 해주기 위해서
    const [selectedAnimal, setSelectedAnimal] = useState([]);
    const [englishGrade, setEnglishGrade] = useState('NORMAL');
    const [entityType , setEntityType] = useState('animals')
    const [gradeTap, setGradeTap] = useState(['노말', '레어','슈퍼레어','유니크', '레전드'])
    const navigate = useNavigate();


    const getData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: INVdata } = await api(`http://localhost:8000/api/v1/inventory/${entityType}/grade?grade=${englishGrade}`, 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setData(INVdata);
            setInitialOwnedQuantity(INVdata.map(item => item.ownedQuantity)) // 초기값 : 가지고 있는 동물 수
            // console.log("ownedQuantity   " + INVdata[key].ownedQuantity)
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const goToMixStartHandler = () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            api(`http://localhost:8000/api/v1/mix`, 'POST', {
                accessToken : accessToken,
                entityType : entityType,
                grade : englishGrade,
                // private String accessToken;
                // private EntityType entityType;
                // private Grade grade;
                // selectedAnimal
            }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            navigate('/mix2');
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };




    // Feat : 동물/건물 탭
    const goToEntityType = (entityType) => {
        setEntityType(entityType)
    };

    // Feat : 등급 탭
    const gradeHandler = (e) => {
        switch (e) {
            case '노말':
                setEnglishGrade('NORMAL')
                // 항아리 리셋
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

    // const goToMixStart = () => {
    //
    // }

    // Feat : imgUrl 저장
    const getImgUrl = (item) => {
        return entityType === 'animals'
            ? `${process.env.PUBLIC_URL}/objectImgs/${entityType}/${item.animal.species}/${item.animal.imagePath}`
            : `${process.env.PUBLIC_URL}/objectImgs/${entityType}/${item.building.imagePath}`;
    }
    // Feat : 선택한 동물 항아리에 넣기
    // TOOD
    const getPotHandler = (idx, imgUrl) => {
        if(data[idx].ownedQuantity !== 0 && selectedAnimal.length < 4) {
            // TODO 클릭하면 count -1하고 그 값을 저장
            data[idx].ownedQuantity = data[idx].ownedQuantity -1
            setSelectedAnimal((preAnimal) => [...preAnimal, {data: data[idx], imgUrl} ]) // 선택한거 동물전체 데이터 저장
        }
        console.log("selectedAnimal" + selectedAnimal)
        console.log("data   " + data[idx])
    }

    const deletePotHandler = () => {
        setSelectedAnimal([]); // 선택된 동물 초기화
        const updatedData = data.map((item, idx) => ({ // ownedQuantity 초기화
            ...item,
            ownedQuantity: initialOwnedQuantity[idx],
        }));
        setData(updatedData);
    }



    useEffect(() => {
        getData();
    }, [entityType, englishGrade]);

    return (
        <div className="outlet-container" style={{ width: '960px', height: '640px', borderRadius: '0.5rem' }}>
            <div className={classes.warpBox}>
                <div className={classes.innerBox}>
                    <div className={classes.activeTap}>
                        <div onClick={() => goToEntityType('animals')}><p>동물</p></div>
                        <div onClick={() => goToEntityType('buildings')}><p>건물</p></div>
                    </div>
                    <div className={classes.btn} onClick={() => goToMixStartHandler()}>
                        <div><p>합성하기</p></div>
                    </div>
                    <div className={classes.gradeTap} onClick={() => deletePotHandler()}>
                        {/* Feat : 등급별 조회*/}
                        {gradeTap.map((item, idx) => (
                            <div key={idx}>
                                <div onClick={() => gradeHandler(item)}>{item}</div>
                            </div>
                        ))}
                    </div>
                    <div className={classes.mainBoxWrap}>
                        <div className={classes.invBox}>
                            {data.map((item, idx) => (
                                // Feat : 인벤토리 보여주기
                                <div key={idx} className={classes.invItem} onClick={() => getPotHandler(idx, getImgUrl(item))}>
                                    <p>{item.ownedQuantity}</p>
                                    <img
                                        src={getImgUrl(item)}/>
                                </div>
                                ))}
                        </div>

                        <div className={classes.potBox} onClick={() => deletePotHandler()}>
                            <div className={classes.potBoxItemWrap}>
                                {selectedAnimal.map((item, idx) => (
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
