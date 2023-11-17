import { useEffect, useState } from "react";
import { api, apiNoToken } from "../../../network/api";
import "../css/BoardDetail.css"
import testImg from "../imgs/가챠테스트.jpeg"

const BoardDetail = () => {


    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    const [post, setPost] = useState([]);

    const getData = async () => {
        const { data: post } = await apiNoToken(`api/v1/post/search/${id}`, 'GET');
        setPost(post)
        console.log(post);
    }

    useEffect(() => {
        getData();

    }, [])

    const handlePost = async () => {
        const accessToken = localStorage.getItem('accessToken');
        const { data: user } = await api('/api/v1/user', 'GET', null, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }

    return (<>
        <div className="BoardContainer">
            <div className="TitleContainer">
                {post.title}
            </div>
            <div style={{ display: "flex" }}>
                <div className="Side2Container">
                    <div className="ContentContainer">
                        {post.content}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img className="BoardImgResize" src={post.postImage}></img>

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