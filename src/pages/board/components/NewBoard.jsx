import { useEffect, useState } from "react";
import "../css/NewBoard.css"
import { ToastContainer, toast } from "react-toastify";
import uploadImageToFirebase from "../../../network/FirebaseUtils";
import { api, apiNoToken } from "../../../network/api";
import { Navigate } from "react-router";
import { useHistory } from "react-router-use-history";

const NewBoard = () => {

    const history = useHistory();
    const [formData, setFormData] = useState({

        title: '',
        content: '',
        postImage: null,
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const maxSize = 3 * 1024 * 1024;
        if (file && file.size > maxSize) {
            toast.error('파일 크기가 3MB를 초과하였습니다. 다른 사진을 선택해주세요.');
            return;
        }
        setFormData((prevData) => ({ ...prevData, postImage: file }));
        console.log(formData.postImage);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error('모든 입력란을 채워주세요.');
            return;
        }

        // If an image was selected, upload it
        let imageUrl = formData.postImage;
        console.log(imageUrl)
        if (formData.postImage && formData.postImage instanceof File) {
            toast.info('이미지를 업로드 중입니다...');
            try {
                imageUrl = await uploadImageToFirebase(formData.postImage);
                setFormData((prevData) => ({ ...prevData, postImage: imageUrl }));

            } catch (error) {
                toast.error('파일 업로드에 에러가 발생하였습니다.');
                return;
            }
        }

        // API call to register the user with the uploaded image URL or null if no image was selected
        try {
            const completeFormData = { ...formData, postImage: imageUrl };

            const accessToken = localStorage.getItem('accessToken');
            const response = await api('/api/v1/post/create', 'POST', completeFormData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            });

            toast.success('게시글 작성이 성공적으로 완료되었습니다.');
            history.push("/board")

        } catch (error) {
            toast.error('게시글 작성에 에러가 발생하였습니다.');
        }
    };

    return (<>

        <div className="BoardContainer">

            <form>

                <div className="TitleContainer">
                    제목
                    <input className="NewBoardTitle"
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, title: e.target.value }))}
                    ></input>
                </div>

                <div style={{ display: "flex" }}>
                    <div className="NewBoardSide">
                        내용
                    </div>
                    <div>
                        <textarea className="NewBoardContent" id="content"
                            onChange={(e) => setFormData((prevData) => ({ ...prevData, content: e.target.value }))}
                        ></textarea>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <input className="NewBoardFile" type="file" onChange={handleImageUpload}  ></input>
                            <button className="NewBoardSubmit" onClick={handleSubmit} >작성하기</button>

                        </div>

                    </div>

                </div>
                <ToastContainer position="top-center" autoClose={5000} />

            </form>

            <button></button>


        </div>
    </>)

}

export default NewBoard;