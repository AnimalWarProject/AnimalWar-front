import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

// 공격형 스킬 이미지
import backgroundImage from '../imgs/Rectangle 12290.png';
import Swap from '../imgs/Swap.webp';


const Battle = () => {
    const pixiContainer = useRef(null);
    const [userProfile, setUserProfile] = useState(null);
    const [defenderHealth, setDefenderHealth] = useState(null);
    const [attackerHealth, setAttackerHealth] = useState(null);
    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([])


    // 기본 배경크기 설정

    useEffect(() => {
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true,
        });
        pixiContainer.current.appendChild(app.view);

        // 화면 뒷 배경
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);
        
        // 배틀 유저 상태 박스 담는 컨테이너
        const stateContainer = new PIXI.Container();
        app.stage.addChild(stateContainer);

        // 배틀 로그 담는 컨테이너
        const logContainer = new PIXI.Container();
        app.stage.addChild(logContainer);


        // 공격자 상태 외곽 박스
        const smallAttackerBox = new PIXI.Graphics();
        smallAttackerBox.beginFill(0xffffff, 0.4);
        const smallAttackerBoxWidth = 365;
        const smallAttackerBoxHeight = 154;
        const smallAttackerBoxCornerRadius = 10;
        smallAttackerBox.drawRoundedRect(70, 70, smallAttackerBoxWidth, smallAttackerBoxHeight, smallAttackerBoxCornerRadius);
        smallAttackerBox.endFill();
        stateContainer.addChild(smallAttackerBox);

        // 수비자 상태 외곽 박스
        const smallDefenderBox = new PIXI.Graphics();
        smallDefenderBox.beginFill(0xffffff, 0.4);
        const smallDefenderBoxWidth = 365;
        const smallDefenderBoxHeight = 154;
        const smallDefenderBoxCornerRadius = 10;
        smallDefenderBox.drawRoundedRect(515, 70, smallDefenderBoxWidth, smallDefenderBoxHeight, smallDefenderBoxCornerRadius);
        smallDefenderBox.endFill();
        stateContainer.addChild(smallDefenderBox);

        // 배틀 로그 외곽 박스
        const battleLogBox = new PIXI.Graphics();
        battleLogBox.beginFill(0xffffff, 0.4);
        const battleLogBoxBoxWidth = 810;
        const battleLogBoxBoxHeight = 320;
        const battleLogBoxCornerRadius = 10;
        battleLogBox.drawRoundedRect(70, 250, battleLogBoxBoxWidth, battleLogBoxBoxHeight, battleLogBoxCornerRadius);
        battleLogBox.endFill();
        logContainer.addChild(battleLogBox);


        // 공격자 수비자 상태 박스
        const addStateBox = (x, y, profileBoxPath, nickName,
                             currentHealth, maxHealth,
                             attackPower, defensePower, healthBarColor) => {

            const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
                const healthBar = new PIXI.Graphics();
                healthBar.beginFill(healthBarColor);
                const healthBarWidth = (currentHealth / maxHealth) * 228;
                const healthBarHeight = 40;
                const healthBarRadius = 10;
                healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
                healthBar.endFill();
                return healthBar;
            };
            // 체력바
            const healthBar = createHealthBar(x + 80, y + 50, currentHealth, maxHealth, healthBarColor)
            stateContainer.addChild(healthBar);

            // 프로필 사진
            if (profileBoxPath) {
                const profile = PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);
            }

                // 닉네임
                const nicknameText = new PIXI.Text(nickName, {
                    fontSize: 15,
                    fill: 0x0f1828,
                    align: 'justify',
                    fontWeight: 'bolder',
                    fontFamily: 'Arial',
                });
                nicknameText.x = x + 80;
                nicknameText.y = y + 20;
                stateContainer.addChild(nicknameText);


                // 유저 수치
                const useState = new PIXI.Text(
                    `공격력: ${attackPower} | 방어력: ${defensePower} `,
                    {
                        
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial'

                    });
                useState.x = x + 80;
                useState.y = y + 85;
                stateContainer.addChild(useState);

                const hpState = new PIXI.Text(
                    `HP: [${currentHealth} / ${maxHealth}]`,
                    {
                        fontSize: 15,
                        fill: 0x0f1828,
                        align: 'justify',
                        fontWeight: 'bolder',
                        fontFamily: 'Arial'
                    })
                hpState.x = x + 80;
                hpState.y = y + 65;
                stateContainer.addChild(hpState);


            };
            addStateBox(
                50,
                50,
                Swap,
                '공격자',
                10000,
                10000,
                attackerAtkPower,
                attackerDefPower,
                '#FC5740'
            )

            addStateBox(
                500,
                50,
                Swap,
                '수비자',
                10000,
                10000,
                defenderAtkPower,
                defenderDefPower,
                '#5B7FFF'
            );

        }, []);


    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;
