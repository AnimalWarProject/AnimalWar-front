import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import uploadImageToFirebase from '../../network/FirebaseUtils';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { apiNoToken } from '../../network/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        nickName: '',
        profileImage: '',
        species: '',
    });
    const speciesTranslations = {
        Dog: '개',
        Cat: '고양이',
        Glires: '설치동물',
        Bird: '조류',
        Fish: '어류',
    };

    const [previewImage, setPreviewImage] = useState(null);
    const [speciesImages, setSpeciesImages] = useState({});
    const [longLogoUrl, setLongLogoUrl] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImageUrls = async () => {
            const storage = getStorage();
            const tempImages = {};
            const speciesList = ['Dog', 'Cat', 'Glires', 'Bird', 'Fish'];
            for (const species of speciesList) {
                const imageRef = ref(storage, `${species}.png`);
                tempImages[species] = await getDownloadURL(imageRef);
            }
            setSpeciesImages(tempImages);
            const logoImageRef = ref(storage, 'LongLogo.png');
            setLongLogoUrl(await getDownloadURL(logoImageRef));
        };
        fetchImageUrls();
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const maxSize = 3 * 1024 * 1024;
        if (file && file.size > maxSize) {
            toast.error('파일 크기가 3MB를 초과하였습니다. 다른 사진을 선택해주세요.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        try {
            const imageUrl = await uploadImageToFirebase(file);
            setFormData((prevData) => ({ ...prevData, profileImage: imageUrl }));
        } catch (error) {
            toast.error('파일 업로드에 에러가 발생하였습니다.');
        }
    };

    const handleSpeciesSelect = (species) => {
        setFormData((prevData) => ({ ...prevData, species }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.id || !formData.password || !formData.nickName || !formData.species) {
            toast.error('모든 입력란을 채워주세요.');
            return;
        }
        try {
            await apiNoToken('/api/v1/auth/signup', 'POST', formData);
            toast.success('회원가입이 성공적으로 완료되었습니다.');
            navigate('/login');
        } catch (error) {
            toast.error('회원가입에 에러가 발생하였습니다.');
        }
    };

    return (
        <div className="signup-page-wrapper">
            <div className="signup-page-container">
                <div className="signup-container">
                    {longLogoUrl ? (
                        <img src={longLogoUrl} alt="logo" className="logo-image" />
                    ) : (
                        <h2>동물의 왕이 되어보세요</h2>
                    )}
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="아이디"
                        value={formData.id}
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, id: e.target.value }))}
                    />
                    <input
                        className="signup-input"
                        type="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, password: e.target.value }))}
                    />
                    <input
                        className="signup-input"
                        type="text"
                        placeholder="닉네임"
                        value={formData.nickName}
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, nickName: e.target.value }))}
                    />
                    <div className="file-upload-container">
                        <span>프로필 이미지 사진 가져오기</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <div className="species-selection-box">
                        <div className="species-selection-title">동물 종족 선택하기</div>
                        <div className="species-container">
                            {Object.keys(speciesImages).map((species) => (
                                <div key={species} className="species-option">
                                    <img src={speciesImages[species]} alt={species} width="100" height="100" />
                                    <input
                                        type="radio"
                                        id={`species_${species}`}
                                        name="species"
                                        value={species}
                                        checked={formData.species === species}
                                        onChange={() => handleSpeciesSelect(species)}
                                    />
                                    <label htmlFor={`species_${species}`}>{speciesTranslations[species]}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="signup-button" onClick={handleSubmit}>
                        회원가입
                    </button>
                    <ToastContainer position="top-center" autoClose={5000} />
                </div>
                {previewImage && (
                    <div className="image-preview-container">
                        <img src={previewImage} alt="Preview" className="image-preview" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
