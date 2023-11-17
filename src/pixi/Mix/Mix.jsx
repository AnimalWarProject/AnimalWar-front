import classes from '../../common/components/Mix.module.css';
import { api } from "../../network/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const Mix = () => {
    const testImg = `${process.env.PUBLIC_URL}/objectImgs/animals/dog/AsiaticWildDog.webp`;
    const [data, setData] = useState();
    const { grade } = useParams();
    const [englishGrade, setEnglishGrade] = useState('');
    const [entity , setEntityType] = useState('animals')


    // Feat : 동물/건물 탭
    const goToEntityType = (entityType) => {
        getData(entityType, englishGrade);
    };


    // Feat : 등급 탭
    // const gradeHandler = (e) => {
    //     switch (e) {
    //         case '노말':
    //             setEnglishGrade('NORMAL')
    //             break
    //         case '레어':
    //             setEnglishGrade('RERA')
    //             break
    //         case '슈퍼레어':
    //             setEnglishGrade('SUPERRERA')
    //             break
    //         case '유니크':
    //             setEnglishGrade('UNIQUE')
    //             break
    //         case '레전드':
    //             setEnglishGrade('REGEND')
    //             break
    //         default:
    //             setEnglishGrade('NORMAL');
    //             break;
    //     }
    // }

    const getData = async (entityType = 'animals', englishGrade = 'NORMAL') => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: INVdata } = await api(`http://localhost:8000/api/v1/inventory/${entityType}/${englishGrade}`, 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setData(INVdata);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

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
                    <div className={classes.gradeTap}>
                        <div onClick={() => setEnglishGrade('NORMAL')}>노말</div>
                        <div onClick={() => setEnglishGrade('RERA')}>레어</div>
                        <div onClick={() => setEnglishGrade('SUPERRERA')}>슈퍼레어</div>
                        <div onClick={() => setEnglishGrade('UNIQUE')}>유니크</div>
                        <div onClick={() => setEnglishGrade('REGEND')}>레전드</div>
                    </div>
                    <div className={classes.mainBoxWrap}>
                        <div className={classes.invBox}>
                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>

                            <div className={classes.invItem}>
                                <p>3</p>
                                <img src={testImg} />
                            </div>



                        </div>
                        <div className={classes.potBox}>
                            <div className={classes.potBoxItemWrap}>
                                <div className={classes.potBoxItem}>
                                    <img src={testImg} />
                                </div>
                                <div className={classes.potBoxItem}>
                                    <img src={testImg} />
                                </div>
                                <div className={classes.potBoxItem}>
                                    <img src={testImg} />
                                </div>
                                <div className={classes.potBoxItem}>
                                    <img src={testImg} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default Mix;
