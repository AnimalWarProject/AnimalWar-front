import classes from "./Chatting.module.css"
import Rectangle4 from "../imgs/Rectangle 4.png"
import sendIcon from "../imgs/send.png"
import plusIcon from "../imgs/plusIcon.png"
import {useState} from "react";

const Chatting = () => {
    const [inputText, setInputText] = useState('');
    const maxLength = 100; // 최대 글자 수

    const handleInputChange = (event) => {
        const text = event.target.value;

        // 입력된 텍스트 길이가 최대 길이를 초과하지 않도록 확인
        if (text.length <= maxLength) {
            setInputText(text);
        } else {
            alert('100자를 초과하였습니다.'); // 100자를 초과한 경우 알림
        }
    };


    return (
        <section className={classes.Wrap}>
            <div className={classes.box}>
                <div className={classes.title}>CHATTING</div>
                <div className={classes.message}>
                    <div className={classes.message_container}>
                        <img className={classes.profileImg} src={Rectangle4}/>
                        <div className={classes.profileNickname}>Cat:</div>
                        <div className={classes.messageRecord}>유례없는 흉작으로 사과 생산량이 감소해 가격이 치솟자</div>
                    </div>
                </div>


                <div className={classes.send_box}>
                    <dutton lassName={classes.send_plus_button}>
                        <img src={plusIcon}/>
                    </dutton>

                    <input className={classes.send_input} value={inputText}
                           onChange={handleInputChange}
                           maxLength={maxLength}>
                    </input>

                    <button className={classes.send_button}>
                        <img src={sendIcon}/>
                    </button>
                </div>




            </div>
        </section>
    );
}



export default Chatting;