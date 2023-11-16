import "../css/BoardDetail.css"
import testImg from "../imgs/가챠테스트.jpeg"

const BoardDetail = () => {

    return (<>
        <div className="BoardContainer">
            <div className="TitleContainer">
                어제 레전드 새 뽑음
            </div>
            <div style={{ display: "flex" }}>
                <div className="Side2Container">
                    <div className="ContentContainer">
                        이거 가루다인가 좋은거임?
                        1트만에 뽑았는데


                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img className="BoardImgResize" src={testImg}></img>

                    </div>


                </div>



                <div className="Side3Container">

                    <div className="ReviewRist">
                        <div className="ReviewContainer">
                            <div style={{ display: "flex" }}>
                                <img className="ReviewImage" src=""></img>
                                <div>
                                    <div>닉네임:</div>
                                    <div>작성일 :</div>
                                </div>
                            </div>
                            <p >님 이거 어디서 구할수 있어요? </p>

                        </div>


                        <div className="ReviewContainer">
                            <div style={{ display: "flex" }}>
                                <img className="ReviewImage" src=""></img>
                                <div>
                                    <div>닉네임:</div>
                                    <div>작성일 :</div>
                                </div>
                            </div>
                            <p >님 이거 어디서 구할수 있어요? </p>

                        </div>

                        <div className="ReviewContainer">
                            <div style={{ display: "flex" }}>
                                <img className="ReviewImage" src=""></img>
                                <div>
                                    <div>닉네임:</div>
                                    <div>작성일 :</div>
                                </div>
                            </div>
                            <p >님 이거 어디서 구할수 있어요? </p>

                        </div>

                    </div>


                    {/* 작성란 */}

                    <form >
                        <input className="ReviewInput" placeholder="댓글 작성란" type="text"></input>

                        <button className="ReviewSubmit" type="submit">작성</button>
                    </form>

                </div>
            </div>

        </div>
    </>)
}

export default BoardDetail;