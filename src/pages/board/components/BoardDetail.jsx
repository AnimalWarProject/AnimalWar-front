import { useEffect, useState } from "react";
import { api, apiNoToken } from "../../../network/api";
import "../css/BoardDetail.css"
import testImg from "../imgs/가챠테스트.jpeg"
import axios from "axios";
import arrow from "../imgs/대댓글.png"

const BoardDetail = () => {


    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    const [reviewId, setReviewId] = useState(0);

    const [post, setPost] = useState({});
    //이건 리뷰
    const [review, setReview] = useState("");
    //이건 대댓글
    const [reply, setReply] = useState("");
    const [profile, setProfile] = useState({});
    const [count, setCount] = useState(0);


    //리뷰 답글 토글
    const [showReplyInputs, setShowReplyInputs] = useState([]);

    const toggleReplyInput = (index, id) => {
        // 다른 버튼의 상태를 모두 false로 설정
        console.log(id);
        const updatedShowReplyInputs = Array(post.reviewList.length).fill(false);
        setReviewId(id);
        updatedShowReplyInputs[index] = !updatedShowReplyInputs[index];
        setShowReplyInputs(updatedShowReplyInputs);
    };

    //

    const getData = async () => {
        const { data: post } = await apiNoToken(`api/v1/post/search/${id}`, 'GET');
        setPost(post)
        console.log(post)
        setShowReplyInputs(Array(post.reviewList.length).fill(false));
    }

    const getProfileData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const { data: userProfile } = await api('/api/v1/user', 'GET', null, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setProfile(userProfile);

        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }

    }

    useEffect(() => {
        getProfileData();

    }, [])

    useEffect(() => {
        getData();
    }, [count]);



    const handleReview = async () => {
        const accessToken = localStorage.getItem('accessToken');


        axios.post(`http://localhost:8000/api/v1/post/search/${id}`, {
            content: review,
            profileImage: profile.profileImage
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {

            }
        }).then((resp) => {
            // 응답 처리
            setCount(count + 1);
            setReview("");

        }).catch((error) => {
            // 오류 처리
        });
    }

    const handleReply = async () => {
        const accessToken = localStorage.getItem('accessToken');

        console.log(reviewId)
        axios.post(`http://localhost:8000/api/v1/post/reply/${reviewId}`, {
            content: reply,
            profileImage: profile.profileImage
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {

            }
        }).then((resp) => {
            // 응답 처리
            setCount(count + 1);

        }).catch((error) => {
            // 오류 처리
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
                        {post.reviewList && post.reviewList.map((el, index) => (
                            <div className="ReviewContainer">
                                <div style={{ display: "flex" }}>
                                    <img className="ReviewImage" src={el.profileImage}></img>
                                    <div>
                                        <div>닉네임 : {el.nickName}</div>
                                        <div>작성일 : {el.createAt}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <p >{el.content} </p>
                                    <button className="ReviewComment" onClick={() => toggleReplyInput(index, el.reviewId)}> 답글 작성하기</button>
                                </div>
                                <section>
                                    {
                                        showReplyInputs[index] && (
                                            <div className="ReReview">
                                                {/* 여기에 답글 입력란이 들어갑니다. */}
                                                <form onSubmit={(e) => e.preventDefault()}>

                                                    <input className="ReReviewInput" type="text"
                                                        onChange={(e) => { setReply(e.target.value); }}
                                                        placeholder="답글을 작성하세요..." />
                                                    <button className="ReReviewButton" type="submit" onClick={handleReply}>답글 제출</button>
                                                </form>
                                            </div>
                                        )
                                    }
                                </section>


                                {el.replyList.map((reply, replyIndex) => (

                                    <>
                                        <div key={replyIndex} style={{ display: "flex" }}>
                                            <img className="ResizeArrowImg" src={arrow}></img>
                                            <img className="ReviewImage" src={reply.profileImage} alt="Profile" />
                                            <div>
                                                <div>닉네임 : {reply.nickName}</div>
                                                <div>작성일 : {reply.createAt}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <p >{reply.content} </p>
                                        </div>
                                    </>
                                ))}
                            </div>))
                        }
                    </div>

                    {/* 작성란 */}

                    <form onSubmit={(e) => e.preventDefault()}>
                        <input className="ReviewInput" placeholder="댓글 작성란" type="text"
                            value={review}
                            onChange={(e) => {
                                setReview(e.target.value);
                            }}></input>

                        <button className="ReviewSubmit" type="submit" onClick={handleReview}>작성</button>
                    </form>

                </div>
            </div>

        </div >
    </>)
}

export default BoardDetail;