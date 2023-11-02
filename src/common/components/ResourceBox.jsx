import React, { useState } from 'react';
import { api } from '../../network/api';
import './ResourceBox.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ResourceBox = () => {
    const [profile, setProfile] = useState({});
    const [icons, setIcons] = useState({});

    const fetchImageFromFirebase = async (imageName) => {
        const storage = getStorage();
        const imageRef = ref(storage, imageName);

        try {
            return await getDownloadURL(imageRef);
        } catch (error) {
            console.error(`Failed to fetch ${imageName} URL:`, error);
            return null;
        }
    };

    const loadIcons = async () => {
        const imageNames = ['Gold.png', 'Food.png', 'Wood.png', 'Iron.png'];

        const newIcons = {};
        for (let name of imageNames) {
            newIcons[name.split('.')[0]] = await fetchImageFromFirebase(name);
        }

        setIcons(newIcons);
    };

    const getProfileData = async () => {
        try {
            const { data: tokenInfo } = await api(`api/v1/auth/me`, 'GET');
            const userId = tokenInfo.userId;
            const { data: userProfile } = await api(`api/v1/user/findByID/${userId}`, 'GET');
            setProfile(userProfile);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    getProfileData();
    loadIcons();

    return (
        <div className="resource-box">
            <div className="resource-line">
                <div className="resource-item">
                    <img src={icons.Gold} alt="Gold" />
                    <span>{profile.gold}</span>
                </div>
                <div className="resource-item">
                    <img src={icons.Food} alt="Food" />
                    <span>{profile.food}</span>
                </div>
            </div>
            <div className="resource-line">
                <div className="resource-item">
                    <img src={icons.Wood} alt="Wood" />
                    <span>{profile.wood}</span>
                </div>
                <div className="resource-item">
                    <img src={icons.Iron} alt="Iron" />
                    <span>{profile.iron}</span>
                </div>
            </div>
        </div>
    );
};

export default ResourceBox;
