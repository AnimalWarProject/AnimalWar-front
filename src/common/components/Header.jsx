import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import Search from '../imgs/Search.png';
import { api } from '../../network/api';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

function Header() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [profile, setProfile] = useState({});
    const [searchedUser, setSearchedUser] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchImageUrl, setSearchImageUrl] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);

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

    const handleSearch = async () => {
        try {
            const { data: foundUser } = await api(`api/v1/user/findByNickName/${searchInput}`, 'GET');
            setSearchedUser(foundUser);
        } catch (error) {
            console.error('Failed to search user:', error);
        }
    };

    useEffect(() => {
        getProfileData();
        fetchLogoUrl();
        fetchSearchImageUrl();
    }, []);

    const fetchLogoUrl = async () => {
        const storage = getStorage();
        const logoRef = ref(storage, 'Logo.png');

        try {
            const url = await getDownloadURL(logoRef);
            setLogoUrl(url);
        } catch (error) {
            console.error('Failed to fetch logo URL:', error);
        }
    };

    const fetchSearchImageUrl = async () => {
        const storage = getStorage();
        const searchImageRef = ref(storage, 'Search.png');

        try {
            const url = await getDownloadURL(searchImageRef);
            setSearchImageUrl(url);
        } catch (error) {
            console.error('Failed to fetch search image URL:', error);
        }
    };

    return (
        <div className="header-container">
            <img className="logo" src={logoUrl || 'default-image-path'} alt="Logo" />

            <div className="menu-buttons">
                <NavLink to="/main">홈</NavLink>
                <NavLink to="/battle">전투</NavLink>
                <NavLink to="/draw">뽑기</NavLink>
                <NavLink to="/battle">합성</NavLink>
                <NavLink to="/draw">강화</NavLink>
                <NavLink to="/battle">배치</NavLink>
                <NavLink to="/draw">이사</NavLink>
                <NavLink to="/battle">교환소</NavLink>
                <NavLink to="/draw">거래소</NavLink>
                <NavLink to="/battle">랭킹</NavLink>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder=" 유저 검색"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button onClick={handleSearch}>
                    <img className="search-icon" src={searchImageUrl || 'default-image-path'} alt="Search" />
                </button>
            </div>

            {searchedUser && (
                <div className="searched-user-info">
                    <img src={searchedUser.profileImage || 'default-image-path'} alt="Searched User" />
                    <span>{searchedUser.nickName || 'Unknown'}</span>
                </div>
            )}

            <div className="profile-section">
                <img src={profile.profileImage || 'default-image-path'} alt="Profile" />
                <span>{profile.nickName || 'Unknown'}</span>
                <button onClick={() => setDropdownVisible(!dropdownVisible)}>↓</button>
                {dropdownVisible && (
                    <div className="dropdown-content">
                        <button>마이페이지</button>
                        <button>로그아웃</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
