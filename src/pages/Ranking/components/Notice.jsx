import "../css/Notice.css"
import clock from "../imgs/CLOCK 1.png"
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from "react";
const Notice = () => {
    const [clock, setClock] = useState(null);

    const getClock = async () => {
        const storage = getStorage();
        const searchImageRef = ref(storage, 'CLOCK 1.png');
        try {
            const url = await getDownloadURL(searchImageRef);
            setClock(url);
        } catch (error) {
            console.error('Failed to fetch search image URL:', error);
        }
    }

    useEffect(() => {
        getClock()
    }, [])


    return (<>
        <div className="notice_container">

            <img className="clock" src={clock}></img>
            <div className="notice_content">
                매주 월요일  <br />
                오전 9시    <br />
                주간보상 지급
            </div>
        </div>
    </>)
}

export default Notice;