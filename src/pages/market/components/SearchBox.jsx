import '../css/SearchBox.css';
const SearchBox = ({ onAnimalTypeSelect }) => {
    const handleAnimalTypeClick = (animalType) => {
        onAnimalTypeSelect(animalType);
    };
    return (
        <>
            <div className="searchbox-container">
                <div className="searchbox-wrap">
                    <input className="searchbox-input" placeholder={'동물/건물을 입력하세요.'} />

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
                                        <a href="#" onClick={() => handleAnimalTypeClick('DOG')}>
                                            개
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('CAT')}>
                                            고양이
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('GLIRES')}>
                                            설치류
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('BIRD')}>
                                            조류
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('FISH')}>
                                            어류
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('COMMON')}>
                                            공통
                                        </a>
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
                                        <a href="#" onClick={() => handleAnimalTypeClick('CommandCenter')}>
                                            본부
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('TrainingCenter')}>
                                            동물훈련소
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('WoodFactory')}>
                                            목공소
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('SteelMill')}>
                                            제철소
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('FoodStorage')}>
                                            식품 저장소
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('Zoo')}>
                                            동물원
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('Totem')}>
                                            토템
                                        </a>
                                    </div>
                                    <div className="searchbox-type-content">
                                        <a href="#" onClick={() => handleAnimalTypeClick('Fence')}>
                                            울타리
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SearchBox;
