import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { api, apiNoToken } from '../../network/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import logoImage from '../imgs/Logo.webp';
import searchImage from '../imgs/Search.webp';

function Header() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [profile, setProfile] = useState({});
    const [searchedUser, setSearchedUser] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

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
    };

    const handleSearch = async () => {
        try {
            const { data: foundUser } = await apiNoToken(`api/v1/user/findByNickName/${searchInput}`, 'GET');
            navigate(`/userInfo`, { state: { user: foundUser } });
            setSearchedUser(foundUser);
        } catch (error) {
            console.error('Failed to search user:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await api('/api/v1/auth/logout', 'POST', null, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            localStorage.removeItem('accessToken');
            setProfile({});
            setSearchedUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const goToMyPage = () => {
        navigate('/my');
    };

    useEffect(() => {
        getProfileData();
    }, []);

    return (
        <div className="header-container">
            <img className="logo" src={logoImage} alt="Logo" />
            <div className="header-middle">
                <div className="menu-buttons">
                    <NavLink to="/place" activeClassName="active">
                        홈
                    </NavLink>
                    <NavLink to="/battle" activeClassName="active">
                        전투
                    </NavLink>
                    <NavLink to="/draw" activeClassName="active">
                        뽑기
                    </NavLink>
                    <NavLink to="/mix" activeClassName="active">
                        합성
                    </NavLink>
                    <NavLink to="/upgrade" activeClassName="active">
                        강화
                    </NavLink>
                    <NavLink to="/terrain" activeClassName="active">
                        이사
                    </NavLink>
                    <NavLink to="/exchange" activeClassName="active">
                        교환소
                    </NavLink>
                    <NavLink to="/market" activeClassName="active">
                        거래소
                    </NavLink>
                    <NavLink to="/rank" activeClassName="active">
                        랭킹
                    </NavLink>
                    <NavLink to="/board" activeClassName="active">
                        게시판
                    </NavLink>
                    <NavLink to="/" activeClassName="active">
                        게임소개
                    </NavLink>
                </div>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder=" 유저 검색"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button onClick={handleSearch}>
                        <img className="search-icon" src={searchImage} alt="Search" />
                    </button>
                </div>
            </div>
            <div className="profile-section">
                <img
                    className="header-profile-image"
                    src={profile.profileImage || 'default-profile-path'}
                    alt="Profile"
                />
                <span>{profile.nickName || 'Unknown'}</span>
                <button onClick={() => setDropdownVisible(!dropdownVisible)}>
                    <FontAwesomeIcon icon={faCog} className="fa-icon" />
                </button>
                <div className={`dropdown-content ${dropdownVisible ? 'show' : ''}`}>
                    <button onClick={goToMyPage}>마이페이지</button>
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            </div>
        </div>
    );
}

export default Header;
