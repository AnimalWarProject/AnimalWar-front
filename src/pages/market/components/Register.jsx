import React, {useState} from "react";
import "../css/Resister.css";

const Resister = () => {
    // const[item, setItem] = useState({}) // 우 클릭시 아이템이 등록되게
    //
    // const onRightClick = (e) => {
    //     e.preventDefault()
    //     setItem(e.target.value);
    // }


    return <>
        <div className="register-container">
            <div className="register-wrap">
                <div className="register-wrap-item">
                {/*    아이템 등록 구간*/}
                </div>
                <div>
                    이름 : 동물 or 건물 이름
                </div>
                <div>
                    등급 : 동물 or 건물 등급
                </div>
                <div>
                    강화 수 : ?
                </div>
                <div>
                    <input placeholder="판매 금액" type="text"/>
                </div>
            </div>
            <div className="register-btnWrap">
                <button className="register-btn">등록하기</button>
                <button className="register-btn">취소</button>
            </div>
        </div>
    </>;
};

export default Resister;