import classes from "./Chatting.module.css"
import Rectangle3 from "../imgs/Rectangle 3.png"
import Rectangle4 from "../imgs/Rectangle 4.png"
import Rectangle5 from "../imgs/Rectangle 5.png"
import Rectangle6 from "../imgs/Rectangle 6.png"
import Rectangle7 from "../imgs/Rectangle 7.png"
import sendIcon from "../imgs/send.png"
import plusIcon from "../imgs/plusIcon.png"
import {useState} from "react";

const Chatting = () => {
    const [inputText, setInputText] = useState('');
    const maxLength = 100; // 최대 글자 수
    const randomColorClass = 'random-color'; // 랜덤 색상 클래스 이름

    const handleInputChange = (event) => {
        const text = event.target.value;

        // 입력된 텍스트 길이가 최대 길이를 초과하지 않도록 확인
        if (text.length <= maxLength) {
            setInputText(text);
        } else {
            alert('100자를 초과하였습니다.'); // 100자를 초과한 경우 알림
        }
    };




// 랜덤한 16진수 색상 코드를 생성하는 함수
    const randomColor = getRandomColor(); // 랜덤한 색상 코드를 가져옵니다
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }





    return (
        <section className={classes.Wrap}>
            <div className={classes.box}>
                <div className={classes.title}>CHATTING</div>
                <div className={classes.message}>
                    <div className={classes.message_title}>GOOD CHATTING PLZ!</div>
                    <div className={classes.message_container}>
                        <img className={classes.profileImg} src={Rectangle4}/>
                        <div className={classes.profileNickname} style={{ color: randomColor }}>Cat:</div>
                        <div className={classes.messageRecord}>유례없는 흉작으로 사과 생산량이 감소해 가격이 치솟자</div>
                    </div>
                    <div className={classes.message_container}>
                        <img className={classes.profileImg} src={Rectangle5}/>
                        <div className={classes.profileNickname} style={{ color: randomColor }}>Cat:</div>
                        <div className={classes.messageRecord}>유례없는 흉작으로 사과 생산량이 감소해 가격이 치솟자</div>
                    </div>
                    <div className={classes.message_container}>
                        <img className={classes.profileImg} src={Rectangle3}/>
                        <div className={classes.profileNickname} style={{ color: randomColor }}>Cat:</div>
                        <div className={classes.messageRecord}>유례없는 흉작으로 사과 생산량이 감소해 가격이 치솟자</div>
                    </div>
                    <div className={classes.message_container}>
                        <img className={classes.profileImg} src={Rectangle6}/>
                        <div className={classes.profileNickname} style={{ color: randomColor }}>Cat:</div>
                        <div className={classes.messageRecord}>유례없는 흉작으로 사과 생산량이 감소해 가격이 치솟자</div>
                    </div>
                    <div className={classes.message_container}>
                        <img className={classes.profileImg} src={Rectangle7}/>
                        <div className={classes.profileNickname} style={{ color: randomColor }}>Cat:</div>
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