import "../css/BattlePoint.css"
import crown from "../imgs/CROWN.png"

const BattlePoint = () => {


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

            </div>

        </div>
    </>)
}

export default BattlePoint;