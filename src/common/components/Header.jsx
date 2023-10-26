import React, { useState } from 'react';
import './Header.css';
import textLogo from '../imgs/AnimalWarLogo.png';

function Header() {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <div className="header-container">
            <img className="logo" src={textLogo} alt="Logo" />

            <div className="menu-buttons">
                <button>전투</button>
                <button>뽑기</button>
                <button>합성</button>
                <button>강화</button>
                <button>배치</button>
                <button>이사</button>
                <button>교환소</button>
                <button>거래소</button>
                <button>랭킹</button>
            </div>
            <div className="search-box">
                <input type="text" placeholder="Search" />
            </div>
            <div className="profile-section">
                <img src="path_to_profile_image" alt="Profile" />
                <span>닉네임</span>
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
