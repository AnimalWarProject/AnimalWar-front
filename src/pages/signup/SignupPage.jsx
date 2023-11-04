import React, { useState, useEffect } from 'react';
import './Signup.css';
import uploadImageToFirebase from '../../network/FirebaseUtils';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        nickName: '',
        profileImage: '',
        species: null,
    });

    const [speciesImages, setSpeciesImages] = useState({});

    useEffect(() => {
        const fetchImageUrls = async () => {
            const storage = getStorage();
            const tempImages = {};
            const speciesList = ['Dog', 'Cat', 'Glires', 'Bird', 'Fish'];

            for (const species of speciesList) {
                const imageRef = ref(storage, `${species}.png`);
                tempImages[species] = await getDownloadURL(imageRef);
                console.log('Fetched URL for', species, ':', tempImages[species]);
            }
            setSpeciesImages(tempImages);
        };

        fetchImageUrls();
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        try {
            const imageUrl = await uploadImageToFirebase(file);
            setFormData((prevData) => ({ ...prevData, profileImage: imageUrl }));
        } catch (error) {
            console.error('Error uploading image: ', error);
        }
    };

    const handleSpeciesChange = (species) => {
        setFormData((prevData) => ({ ...prevData, species }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className="signup-container">
            <h2>회원가입</h2>
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
            <input type="file" onChange={handleImageUpload} />
            <div className="species-container">
                {Object.entries(speciesImages).map(([speciesKey, imageUrl]) => (
                    <div key={speciesKey} className="species-option">
                        <img src={imageUrl} alt={speciesKey} style={{ width: '6.875rem', height: '6.875rem' }} />
                        <input
                            type="radio"
                            name="species"
                            checked={formData.species === speciesKey}
                            onChange={() => handleSpeciesChange(speciesKey)}
                        />
                    </div>
                ))}
            </div>
            <button className="signup-button" onClick={handleSubmit}>
                회원가입
            </button>
        </div>
    );
};

export default SignupPage;
