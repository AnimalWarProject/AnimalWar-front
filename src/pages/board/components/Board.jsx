import React from "react";
import "../css/Board.css";
import searchImg from "../../../common/imgs/Search.webp";
import { Pagination, Stack } from "@mui/material";
import { useHistory } from "react-router-use-history";
import { useEffect, useState } from "react";
import { apiNoToken } from "../../../network/api";
import axios from "axios";
import { useLocation } from "react-router";

const Board = () => {
    const history = useHistory();
    const location = useLocation();
    const [postData, setPostData] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [page, setPage] = useState(0); 

    const [keyward, setKeyward] = useState("");

    const getData = async () => {
        // const response = await apiNoToken("/api/v1/post", "GET", null, {
        //     params: { page: 4 },
        // }).then((res) => {

        //     console.log(res)
        // });

        axios.get('http://192.168.0.44:8000/api/v1/post', {
            params: { page: page, content: keyward }
        }).then((resp) => {
            console.log(resp)
            setPostData(resp.data.content)
            setTotalPages(resp.data.totalPages)
        })

    };

    useEffect(() => {
        getData();
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value - 1);

    };

    const handleWrite = () => {
        history.push("/newBoard");
    };

    return (
        <div className="BoardContainer">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="BoardSearchBox">
                    <div className="Title">
                        <div className="TitleFont">제목+내용</div>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()} method="GET">
                        <div className="InputContainer">
                            <input type="search" className="Input" onChange={(e) => { setKeyward(e.target.value); }} />
                            <button type="submit" className="Submit" onClick={getData}>
                                <img className="Search" src={searchImg} alt="search" />
                            </button>
                        </div>
                    </form>
                </div>
                <button className="WriteButton" onClick={handleWrite}>
                    게시글 작성하기
                </button>
            </div>
            <table
                className="tg"
                style={{
                    tableLayout: "fixed",
                    width: "810px",
                }}
            >
                <colgroup>
                    <col style={{ width: "150.2px" }}></col>
                    <col style={{ width: "850.2px" }}></col>
                    <col style={{ width: "250.2px" }}></col>
                    <col style={{ width: "250.2px" }}></col>
                </colgroup>
                <thead>
                    <tr>
                        <th className="tg-fox7">번호 </th>
                        <th className="tg-fox7">제목</th>
                        <th className="tg-fox7">작성자</th>
                        <th className="tg-fox7">작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {postData.map((el, index) => (

                        <tr
                            onClick={() => window.location.href = 'http://192.168.0.44:3000/boardDetail?id=' + `${el.postId}`}
                            key={index}
                            style={{ cursor: "pointer" }}>
                            <td className="tg-j61v">{el.postId}</td>
                            <td className="tg-j61v">{el.title}</td>
                            <td className="tg-j61v">{el.userId}</td>
                            <td className="tg-j61v">{el.createAt}</td>
                        </tr>

                    ))}
                </tbody>
            </table>
            <Stack alignItems="center">
                <Pagination
                    count={totalPages}
                    color="secondary"
                    onChange={handlePageChange}
                />
            </Stack>
        </div>
    );
};

export default Board;
