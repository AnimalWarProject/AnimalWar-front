
import "../css/BattlePoint.css"
import crown from "../imgs/CROWN 1.webp"
import axios from "axios";

import { useState, useEffect } from "react";

const BattlePoint = () => {


x``
    const [data, setData] = useState([]);
    const getData = () =>

        axios.get("http://localhost:8000/api/v1/rank/byBattlePoint").then((response) => {
            console.log(response.data);
            setData(response.data);
        });

    useEffect(() => {
        getData();
    }, []);


    return (<>
        <div className="main">
            <div className="battlePoint">
                <p className="battlePoint__title">배틀포인트순</p>
            </div>

            {/* 내용 */}

            <div className="userList">
                {data.map((el, index) => (
                    <p className="power__title">{index + 1}. {el.nickName}</p>
                ))}
            </div>

        </div>
    </>)
}

export default BattlePoint;