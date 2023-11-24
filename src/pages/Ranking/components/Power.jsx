import axios from "axios";

import { useState, useEffect } from "react";
import "../css/Power.css"

const Power = () => {


    const [data, setData] = useState([]);
    const getData = () =>

        axios.get("http://localhost:8000/api/v1/rank/byPower").then((response) => {
            console.log(response.data);
            setData(response.data);
        });

    useEffect(() => {
        getData();
    }, []);


    return (<>
        <div className="main">
            <div className="power">
                <p className="power__title">전투력순</p>
            </div>

            <div className="userList">
                {data.map((el, index) => (
                    <p className="battlePoint__user">{index + 1}. {el.nickName}</p>
                ))}

            </div>



        </div>
    </>)
}

export default Power;