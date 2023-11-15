import "../css/SearchBox.css" ;
import {useState} from "react";
const SearchBox = ({ onAnimalTypeSelect, onSearchWord }) => {
    const [word, setWord] = useState("");

    const handleAnimalTypeClick = (animalType) => {
        onAnimalTypeSelect(animalType);
    };
    const onChangeHandler = (e) => {
        setWord(e.target.value)
    }
    const onClickSearchBtn = () => {
        onSearchWord(word);
    }
    return<>
        <div className="searchbox-container">
            <div className="searchbox-wrap">
                <div style={{display:"flex", alignItems:"center"}}>
                    <input onChange={onChangeHandler} className="searchbox-input" placeholder={"동물/건물을 입력하세요."}/>
                    <button onClick={onClickSearchBtn} className="searchbox-input-Btn"><img src="/marketImages/search.webp"  alt="#" className="searchbox-input-image"/></button>
                </div>
                <div className="searchbox-division">
                    <div>
                        <div className="searchbox-animal">동물</div>
                        <div className="searchbox-animal-type">
                            <div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                            </div>
                            <div className="searchbox-type-content-wrap">
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('DOG')}>개</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('CAT')}>고양이</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('GLIRES')}>설치류</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('BIRD')}>조류</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('FISH')}>어류</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('COMMON')}>공통</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="searchbox-building">건물</div>
                        <div className="searchbox-animal-type">
                            <div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                                <div className="searchbox-type-line"></div>
                            </div>
                            <div className="searchbox-type-content-wrap">
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('CommandCenter')}>본부</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('TrainingCenter')}>동물훈련소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('WoodFactory')}>목공소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('SteelMill')}>제철소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('FoodStorage')}>식품 저장소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('Zoo')}>동물원</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('Totem')}>토템</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="#" onClick={() => handleAnimalTypeClick('Fence')}>울타리</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>
}
export default SearchBox;