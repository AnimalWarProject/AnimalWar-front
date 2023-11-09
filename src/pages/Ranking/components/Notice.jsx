import "../css/Notice.css"
import clock from "../imgs/CLOCK 1.webp"
const Notice = () => {


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