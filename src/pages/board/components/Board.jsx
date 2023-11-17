import "../css/Board.css"
import serachImg from "../../../common/imgs/Search.webp"
import { Pagination, Stack } from "@mui/material";

const Board = () => {
    return (
        <div className="BoardContainer">
            {/* 서치박스  */}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="BoardSearchBox">
                    <div className="Title">
                        <div className="TitleFont">
                            제목+내용
                        </div>
                    </div>
                    <form action="/" method="GET">
                        <div className="InputContainer">
                            <input type="search" className="Input" />
                            <button type="submit" className="Submit">
                                <img className="Search" src={serachImg} alt="search" />
                            </button>
                        </div>
                    </form>


                </div>

                <button className="WriteButton">
                    게시글 작성하기
                </button>
            </div>

            <table class="tg" style={{
                tableLayout: "fixed", width: "810px"

            }}>

                <colgroup>
                    <col style={{ width: "150.2px" }}></col>
                    <col style={{ width: "850.2px" }}></col>
                    <col style={{ width: "250.2px" }}></col>
                    <col style={{ width: "250.2px" }}></col>
                </colgroup>
                <thead>
                    <tr>
                        <th class="tg-47ck">번호 </th>
                        <th class="tg-fox7">제목</th>
                        <th class="tg-fox7">작성자</th>
                        <th class="tg-fox7">작성일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="tg-j6lv">1</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>
                    <tr>
                        <td class="tg-j6lv">2</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>
                    <tr>
                        <td class="tg-j6lv">3</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>
                    <tr>
                        <td class="tg-j6lv">4</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>
                    <tr>
                        <td class="tg-j6lv">5</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>
                    <tr>
                        <td class="tg-j6lv">6</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>
                    <tr>
                        <td class="tg-j6lv">7</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr> <tr>
                        <td class="tg-j6lv">8</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr> <tr>
                        <td class="tg-j6lv">9</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr> <tr>
                        <td class="tg-j6lv">10</td>
                        <td class="tg-j6lv">ㅎㅇ</td>
                        <td class="tg-j6lv">길동</td>
                        <td class="tg-j6lv">2022/10/5</td>
                    </tr>

                </tbody>
            </table>

            <Stack alignItems="center">
                <Pagination count={10} color="secondary" />
            </Stack>

        </div>




    );

}

export default Board;