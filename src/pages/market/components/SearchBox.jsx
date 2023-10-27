import "../css/SearchBox.css" ;


const SearchBox = () => {
    return <>
        <div className="searchbox-container">
            <div className="searchbox-wrap">
                <input className="searchbox-input" placeholder={"동물/건물을 입력하세요."}/>

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
                                    <a href="">개</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">고양이</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">설치류</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">조류</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">어류</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">공통</a>
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
                                    <a href="">본부</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">동물훈련소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">목공소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">제철소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">식품 저장소</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">동물원</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">토템</a>
                                </div>
                                <div className="searchbox-type-content">
                                    <a href="">울타리</a>
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