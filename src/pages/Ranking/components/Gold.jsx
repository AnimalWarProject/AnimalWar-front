import "../css/Gold.css"

import axios from "axios";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from "react";

const Gold = () => {

    const [crown, setCrown] = useState(null);

    const getCrown = async () => {
        const storage = getStorage();
        const searchImageRef = ref(storage, 'CROWN 1.png');
        try {
            const url = await getDownloadURL(searchImageRef);
            setCrown(url);
        } catch (error) {
            console.error('Failed to fetch search image URL:', error);
        }
    }

    useEffect(() => {
        getCrown()
    }, [])



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

                    <p className="power__title">
                        {index === 0 && <img className="clown" src={crown} alt="Crown" />}
                        {index + 1}. {el.nickName}</p>
                ))}

            </div>





        </div>
    </>)
}

export default Gold;