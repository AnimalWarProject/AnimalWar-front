import "../css/BoardDetail.css"

const BoardDetail = () => {

    return (<>
        <div className="BoardContainer">
            <div className="TitleContainer">
                어제 레전드 새 뽑음
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div classNmae="SideContainer">
                    내용
                </div>
                <div className="Side2Container">
                    컨텐츠내용
                </div>

                <div className="Side3Container">
                    여긴 댓글 들어가는곳
                </div>
            </div>

        </div>
    </>)
}

export default BoardDetail;