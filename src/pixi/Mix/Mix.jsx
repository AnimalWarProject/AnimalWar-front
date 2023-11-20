import classes from '../../common/components/Mix.module.css';
import { api } from "../../network/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const Mix = () => {
    const INVImg = `${process.env.PUBLIC_URL}/objectImgs`;
    const [data, setData] = useState([]);
    const [potImgUrl, setPotImgUrl] = useState([]);
    const [initialOwnedQuantity, setInitialOwnedQuantity] = useState([]) // TODO ownedQuantity을 초기화 해주기 위해서
    const [ownedQuantity, setOwnedQuantity] = useState([initialOwnedQuantity]);
    const [selectedAnimal, setSelectedAnimal] = useState([[]]);

    const [englishGrade, setEnglishGrade] = useState('NORMAL');
    const [entityType , setEntityType] = useState('animals')
    const [gradeTap, setGradeTap] = useState(['노말', '레어','슈퍼레어','유니크', '레전드'])

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

    // Feat : 선택한 동물 항아리에 넣기
    const getPotHandler = (idx) => {

        const selectedAnimal = data[idx];


        const imgUrl = entityType === 'animals'
            ? `${INVImg}/${entityType}/${data[idx].animal.species}/${data[idx].animal.imagePath}`
            : `${INVImg}/${entityType}/${data[idx].building.imagePath}`


        const ownedQuantityMinus1 = data[idx].ownedQuantity = data[idx].ownedQuantity -1

        if(data[idx].ownedQuantity !== 0 && selectedAnimal.length < 4) {
            setSelectedAnimal((preAnimal) => [...preAnimal, selectedAnimal])
            // setPotImgUrl((prevPotImgUrl) => [...prevPotImgUrl, imgUrl]);
            // setOwnedQuantity((preOwnedQuantity) => [...preOwnedQuantity, ownedQuantityMinus1])
            selectedAnimal.ownedQuantity[idx] = selectedAnimal.ownedQuantity[idx]-1
            console.log(selectedAnimal)
        }

        // TODO 클릭한 동물에 대한 정보를 저장해서 맵돌려서 보여주기(이미지주소랑 ownedQuantity만 저장하면 나중에 다시 인벤토리에서 삭제해줄 때 동물id 찾기 어렵기 때문에.. 전체 동물 데이터를 가지고 있어야해)
        //  항아리와 합성 결과값에 사용

        console.log(ownedQuantity);
    }

    const deletePotHandler = () => {
        setPotImgUrl([]);
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
                    <div className={classes.btn}>
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
                                <div key={idx} className={classes.invItem} onClick={() => getPotHandler(idx)}>
                                    <p>{data[idx].ownedQuantity}</p>
                                    <img
                                        src={
                                            entityType === 'animals'
                                                ? `${INVImg}/${entityType}/${data[idx].animal.species}/${data[idx].animal.imagePath}`
                                                : `${INVImg}/${entityType}/${data[idx].building.imagePath}`
                                        }/>
                                </div>
                                ))}
                        </div>

                        <div className={classes.potBox} onClick={() => deletePotHandler()}>
                            <div className={classes.potBoxItemWrap}>
                                {/* Feat : 선택한 동물 항아리에 나옴..*/}
                                {potImgUrl.map((item, idx) => (
                                    <div key={idx} className={classes.potBoxItem}>
                                        <img src={item} alt={`pot-item-${idx}`} />
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
