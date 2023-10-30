import { useState } from "react"
import "../css/BattlePoint.css"
import crown from "../imgs/CROWN.png"
import axios from "axios";

const BattlePoint = () => {

    const [battleRank, setBattleRank] = useState();

    const getData = () => axios.get


    return (<>
        <div className="main">
            <div className="battlePoint">
                <p className="battlePoint__title">배틀포인트순</p>
            </div>

            {/* 내용 */}

            <div className="userList">
                <div>

                    <div>

                        <p className="battlePoint__user">


                            <img className="clown" src={crown} />
                            위장터진 정수
                        </p>
                    </div>

                </div>

                <p className="battlePoint__user">2. 붉닭정수</p>
                <p className="battlePoint__user">3. 붉닭정수</p>
                <p className="battlePoint__user">4. 붉닭정수</p>
                <p className="battlePoint__user">5. 붉닭정수</p>
                <p className="battlePoint__user">6. 붉닭정수</p>
                <p className="battlePoint__user">7. 붉닭정수</p>
                <p className="battlePoint__user">8. 붉닭정수</p>
                <p className="battlePoint__user">9. 붉닭정수</p>
                <p className="battlePoint__user">10. 붉닭정수</p>
  


            </div>

        </div>
    </>)
}

export default BattlePoint;