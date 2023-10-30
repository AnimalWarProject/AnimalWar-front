import React, { useState } from 'react';
import './Signup.css';
import uploadImageToFirebase from '../../network/firebaseUtils';
import dogIcon from '../../common/imgs/Dog.png';
import catIcon from '../../common/imgs/Cat.png';
import gliresIcon from '../../common/imgs/Glires.png';
import birdIcon from '../../common/imgs/Bird.png';
import fishIcon from '../../common/imgs/Fish.png';

const speciesImages = {
    DOG: dogIcon,
    CAT: catIcon,
    GLIRES: gliresIcon,
    BIRD: birdIcon,
    FISH: fishIcon,
};

const SignupPage = () => {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        nickName: '',
        profileImage: '',
        species: null,
    });

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
                type="text"
                placeholder="아이디"
                value={formData.id}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, id: e.target.value }))}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, password: e.target.value }))}
            />
            <input
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
            <button onClick={handleSubmit}>회원가입</button>
        </div>
    );
};

export default SignupPage;
