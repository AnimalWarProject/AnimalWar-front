import "../css/Gold.css"

import axios from "axios";

import { useState, useEffect } from "react";

const Gold = () => {



    const [data, setData] = useState([]);
    const getData = () =>

        axios.get("http://localhost:8000/api/v1/rank/byGold").then((response) => {
            console.log(response.data);
            setData(response.data);
        });

    useEffect(() => {
        getData();
    }, []);

    return (<>
        <div className="main">
            <div className="gold">
                <p className="gold__title">골드보유순</p>
            </div>

            <div className="userList">

                {data.map((el, index) => (
                    <p className="battlePoint__user">{index + 1}. {el.nickName}</p>
                ))}

            </div>





        </div>
    </>)
}

export default Gold;