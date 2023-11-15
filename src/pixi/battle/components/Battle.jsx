
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { ScrollBox } from '@pixi/ui';
import { Container, Graphics } from 'pixi.js';
import Transparency from '../imgs/Transparency.png';

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

        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);


        // 배틀 큰틀 담는 컨테이너

        // 유형별 스킬 크기 및 위치 조정
        const addRoundedText = (text, x, y, width, height, cornerRadius, color) => {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(0);
            graphics.beginFill('#FFC000');
            graphics.drawRoundedRect(x - width / 2, y - height / 2, width, height, cornerRadius);
            graphics.endFill();
            app.stage.addChild(graphics);

            // 글꼴
            const message = new PIXI.Text(text, {
                fontSize: 27,
                fill: 0x0f1828,
                align: 'center',
                fontWeight: 'normal',
                fontFamily: 'Arial',
            });
            message.anchor.set(0.5);
            message.x = x;
            message.y = y;
            app.stage.addChild(message);
        };
        addRoundedText('공격형 스킬', app.renderer.width / 5.5, app.renderer.height / 9, 277, 70, 5, 0x0f1828);
        addRoundedText('수비형 스킬', app.renderer.width / 1.99, app.renderer.height / 9, 277, 70, 5, 0x0f1828);
        addRoundedText('유틸형 스킬', app.renderer.width / 1.215, app.renderer.height / 9, 277, 70, 5, 0x0f1828);

        // 공격형 스킬 큰 박스를 담을 컨테이너

        const bigBoxContainer = new PIXI.Container();
        app.stage.addChild(bigBoxContainer);

        // 배틀 유저 상태 박스 담는 컨테이너
        const stateContainer = new PIXI.Container();
        app.stage.addChild(stateContainer);

        // 배틀 로그 담는 컨테이너
        const logContainer = new PIXI.Container();
        app.stage.addChild(logContainer);


        // 배틀 큰틀 박스

        // 공격형 스킬 큰박스

        const bigBox = new PIXI.Graphics();
        bigBox.beginFill(0xffffff, 0.2);
        const bigBoxWidth = 850;
        const bigBoxHeight = 540;
        const bigBoxCornerRadius = 10;
        bigBox.drawRoundedRect(50, 50, bigBoxWidth, bigBoxHeight, bigBoxCornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);

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

            // 프로필 사진
            if (profileBoxPath) {
                const profile =  PIXI.Sprite.from(profileBoxPath);
                profile.width = 70;
                profile.height = 70;
                profile.x = x + 20;
                profile.y = y + 20;
                stateContainer.addChild(profile);

        // 수비형 스킬 큰박스
        const bigBox1 = new PIXI.Graphics();
        bigBox1.beginFill(0xffffff, 0.5);
        const bigBoxWidth1 = 277;
        const bigBoxHeight1 = 490;
        const cornerRadius1 = 5;
        bigBox1.drawRoundedRect(343, 130, bigBoxWidth1, bigBoxHeight1, cornerRadius1);
        bigBox1.endFill();
        bigBoxContainer1.addChild(bigBox1);

        // 유틸형 스킬 큰박스
        const bigBox2 = new PIXI.Graphics();
        bigBox2.beginFill(0xffffff, 0.5);
        const bigBoxWidth2 = 277;
        const bigBoxHeight2 = 490;
        const cornerRadius2 = 5;
        bigBox2.drawRoundedRect(653, 130, bigBoxWidth2, bigBoxHeight2, cornerRadius2);
        bigBox2.endFill();
        bigBoxContainer2.addChild(bigBox2);

        // 공격형 스킬들 설정
        const addAttackSkillBox = (imageUrl, skillName, skillDescription, boxColor, alpha) => {
            const container = new PIXI.Graphics();
            container.interactive = true;
            container.buttonMode = true;

            // 공격형 스킬 박스 위치 및 크기
            const box = new PIXI.Graphics();
            const cornerRadiusBox = 5; // 모서리 반경을 조정할 수 있습니다
            box.beginFill(boxColor, alpha);
            box.drawRoundedRect(0, 13, 243, 95, cornerRadiusBox);
            box.endFill();
            container.addChild(box);

            // 공격형 스킬 클릭 이벤트 핸들링 함수
            const handleClick = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor = '#ffffff'; // 상자의 색상
                const alpha = 30; // 투명도
                const cornerRadiusBox = 5; // 모서리 반경

                if (clickedContainer && clickedContainer !== container) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer.children[0].clear();
                    clickedContainer.children[0]
                        .lineStyle(0)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox)
                        .endFill();
                }

                if (clickedContainer === container) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container.children[0].clear();
                    container.children[0]
                        .lineStyle(0)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox)
                        .endFill();
                    clickedContainer = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor = '#000000'; // 변경하고자 하는 테두리 색
                    container.children[0]
                        .clear()
                        .lineStyle(4, borderColor)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(3, 13, 243, 95, cornerRadiusBox)
                        .endFill();
                    if (clickedContainer) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer.children[0].clear();
                        clickedContainer.children[0]
                            .lineStyle(0)
                            .beginFill(boxColor, alpha)
                            .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox)
                            .endFill();
                    }
                    clickedContainer = container;
                }
            };

            container.on('click', handleClick);

            // 공격형 스킬사진 크기 및 위치
            if (imageUrl) {
                const image = PIXI.Sprite.from(imageUrl);
                image.width = 65;
                image.height = 65;
                image.x = 4;
                image.y = 30;
                box.addChild(image);
            }

            // 공격형 스킬 이름 크기 및 폰트
            const nameText = new PIXI.Text(skillName, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nameText.anchor.set(0, 0.5);
            nameText.x = 70;
            nameText.y = 44;
            box.addChild(nameText);

            // 공격형 스킬 설명 조정
            const descriptionText = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180, // 너비 조정을 위한 속성
                lineHeight: 16,
            });
            descriptionText.anchor.set(0, 0.5);
            descriptionText.x = 70;
            descriptionText.y = 74;
            box.addChild(descriptionText);

            testArr.push(container);
        };

        // 수비형 스킬들 설정
        const addDefenseSkillBox = (imageUrl, skillName, skillDescription, boxColor, alpha, x, y) => {
            const container1 = new PIXI.Graphics();
            container1.interactive = true;
            container1.buttonMode = true;

            // 수비형 스킬 박스 위치 및 크기
            const box1 = new PIXI.Graphics();
            const cornerRadiusBox1 = 5; // 모서리 반경을 조정할 수 있습니다
            box1.beginFill(boxColor, alpha);
            box1.drawRoundedRect(0, 13, 243, 95, cornerRadiusBox1);
            box1.endFill();
            container1.addChild(box1);

            // 수비형 스킬 클릭 이벤트 핸들링 함수
            const handleClick1 = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor1 = '#ffffff'; // 상자의 색상
                const alpha1 = 30; // 투명도
                const cornerRadiusBox1 = 5; // 모서리 반경

                if (clickedContainer1 && clickedContainer1 !== container1) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer1.children[0].clear();
                    clickedContainer1.children[0]
                        .lineStyle(0)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox1)
                        .endFill();
                }

                if (clickedContainer1 === container1) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container1.children[0].clear();
                    container1.children[0]
                        .lineStyle(0)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox1)
                        .endFill();
                    clickedContainer1 = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor1 = '#000000'; // 변경하고자 하는 테두리 색
                    container1.children[0]
                        .clear()
                        .lineStyle(4, borderColor1)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(3, 13, 243, 95, cornerRadiusBox1)
                        .endFill();
                    if (clickedContainer1) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer1.children[0].clear();
                        clickedContainer1.children[0]
                            .lineStyle(0)
                            .beginFill(boxColor1, alpha1)
                            .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox1)
                            .endFill();
                    }
                    clickedContainer1 = container1;
                }
            };

            container1.on('click', handleClick1);

            // 수비형 스킬사진 크기 및 위치
            if (imageUrl) {
                const image1 = PIXI.Sprite.from(imageUrl);
                image1.width = 65;
                image1.height = 65;
                image1.x = 4;
                image1.y = 30;
                box1.addChild(image1);
            }

            // 수비형 스킬 이름 크기 및 폰트
            const nameText1 = new PIXI.Text(skillName, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial',
            });
            nameText1.anchor.set(0, 0.5);
            nameText1.x = 70;
            nameText1.y = 44;
            box1.addChild(nameText1);

            // 수비형 스킬 설명 조정
            const descriptionText1 = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180, // 너비 조정을 위한 속성
                lineHeight: 16,
            });
            descriptionText1.anchor.set(0, 0.5);
            descriptionText1.x = 70;
            descriptionText1.y = 74;
            box1.addChild(descriptionText1);

            testArr1.push(container1);
        };

        // 유틸형 스킬들 설정
        const addUtilitySkillBox = (imageUrl, skillName, skillDescription, boxColor, alpha) => {
            const container2 = new PIXI.Graphics();
            container2.interactive = true;
            container2.buttonMode = true;

            // 유틸형 스킬 박스 위치 및 크기
            const box2 = new PIXI.Graphics();
            const cornerRadiusBox2 = 5; // 모서리 반경을 조정할 수 있습니다
            box2.beginFill(boxColor, alpha);
            box2.drawRoundedRect(0, 13, 243, 95, cornerRadiusBox2);
            box2.endFill();
            container2.addChild(box2);

            // 유틸형 스킬 클릭 이벤트 핸들링 함수
            const handleClick2 = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor2 = '#ffffff'; // 상자의 색상
                const alpha2 = 30; // 투명도
                const cornerRadiusBox2 = 5; // 모서리 반경

                if (clickedContainer2 && clickedContainer2 !== container2) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer2.children[0].clear();
                    clickedContainer2.children[0]
                        .lineStyle(0)
                        .beginFill(boxColor2, alpha2)
                        .drawRoundedRect(1.7, 13, 243, 95, cornerRadiusBox2)
                        .endFill();
                }

                if (clickedContainer2 === container2) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container2.children[0].clear();
                    container2.children[0]
                        .lineStyle(0)
                        .beginFill(boxColor2, alpha2)
                        .drawRoundedRect(1.7, 13, 243, 95, cornerRadiusBox2)
                        .endFill();
                    clickedContainer2 = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor2 = '#000000'; // 변경하고자 하는 테두리 색
                    container2.children[0]
                        .clear()
                        .lineStyle(4, borderColor2)
                        .beginFill(boxColor2, alpha2)
                        .drawRoundedRect(1.7, 13, 243, 95, cornerRadiusBox2)
                        .endFill();
                    if (clickedContainer2) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer2.children[0].clear();
                        clickedContainer2.children[0]
                            .lineStyle(0)
                            .beginFill(boxColor2, alpha2)
                            .drawRoundedRect(1.7, 13, 243, 95, cornerRadiusBox2)
                            .endFill();
                    }
                    clickedContainer2 = container2;
                }
            };

            container2.on('click', handleClick2);

            // 유틸형 스킬사진 크기 및 위치
            if (imageUrl) {
                const image2 = PIXI.Sprite.from(imageUrl);
                image2.width = 65;
                image2.height = 65;
                image2.x = 4;
                image2.y = 30;
                box2.addChild(image2);

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

            // 체력바
            const healthBar = createHealthBar(x + 80, y + 50, currentHealth, maxHealth, healthBarColor)
            stateContainer.addChild(healthBar);
            
            // 유저 수치
            const useState = new PIXI.Text(
                `공격력: ${attackPower} | 공격력: ${defensePower} `,
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
            "",
            '수비자',
            10000,
            10000,
            defenderAtkPower,
            defenderDefPower,
            '#5B7FFF'
        );
    }, []);

    const createHealthBar = (x, y, currentHealth, maxHealth, healthBarColor) => {
        const healthBar = new PIXI.Graphics();
        healthBar.beginFill(healthBarColor);
        const healthBarWidth = (currentHealth / maxHealth) * 228; // 조절된 너비 계산
        const healthBarHeight = 40;
        const healthBarRadius = 10;
        healthBar.drawRoundedRect(x, y, healthBarWidth, healthBarHeight, healthBarRadius);
        healthBar.endFill();
        return healthBar;
    };



            // 유틸형 스킬 설명 조정
            const descriptionText2 = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180, // 너비 조정을 위한 속성
                lineHeight: 16,
            });
            descriptionText2.anchor.set(0, 0.5);
            descriptionText2.x = 70;
            descriptionText2.y = 74;
            box2.addChild(descriptionText2);

            testArr2.push(container2);
        };

        // 공격형 박스
        addAttackSkillBox(berserkerImage, '버서커', '자신의 체력이 20% 이하, 기본공격 3.5배 데미지 변경', '#FFFFFF');
        addAttackSkillBox(bombDropImage, '폭탄 투하', '상대방 현재 체력의 20%에 해당하는 데미지', '#FFFFFF');
        addAttackSkillBox(ExecutionImage, '처형', '5회의 공격이내 상대방,       체력 10%이하라면 처형', '#FFFFFF');
        addAttackSkillBox(hiddenAceImage, '비장의 한발', '상대방보다 체력이 적다면 기본공격 5배의 피해', '#FFFFFF');
        addAttackSkillBox(poisonImage, '독약', '상대방 최대 체력의 5%에 해당하는 데미지를 가함', '#FFFFFF');
        addAttackSkillBox(speedRunImage, '빨리감기', '상대방과 나의 현재 체력을 각각 25% 감소', '#FFFFFF');
        addAttackSkillBox('', '', '', null, 0);

        // 수비형 박스
        addDefenseSkillBox(EmergencyFood, '비상식량', '최대 체력의 20%에             해당하는 양을 회복', '#FFFFFF');
        addDefenseSkillBox(Heal, '회복', '잃은 체력의 30%에            해당하는 양을 회복', '#FFFFFF');
        addDefenseSkillBox(IronCladDefense, '철통방어', '상대방의 기본공격을             3회 동안 무효화', '#FFFFFF');
        addDefenseSkillBox(LuckySeven, '럭키 7', '현재 체력이 77% 이상일 때, 상대 기본공격을 7회 무효화', '#FFFFFF');
        addDefenseSkillBox(RustedSword, '녹슨 방패', '상대방의 모든 유형의        데미지를 10%만큼 감소', '#FFFFFF');

        addDefenseSkillBox(Bandaging, '붕대 감기', '3턴 동안, 받은 데미지의         7% 만큼의 체력을 회복', '#FFFFFF');
        addDefenseSkillBox(Transparency, '', '', null, 0);

        // 유틸형 스킬
        addUtilitySkillBox(BrokenSpear, '부러진 창', '상대방 공격형 스킬 금지', '#FFFFFF');
        addUtilitySkillBox(BrokenShield, '부러진 방패', '상대방 방어형 스킬 금지', '#FFFFFF');
        addUtilitySkillBox(DoItAgain, '다시하기', '공격자, 수비자', '#FFFFFF');
        addUtilitySkillBox(
            OffenseDefenseShift,
            '공수교대',
            '공격자는 방어력으로,     수비자는 공격력으로 전투',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            StrongAndWeak,
            '강약약강',
            '나체력>상대체력: 공방 10%↑\n' + '나체력<상대체력: 공방 10%↓',
            '#FFFFFF'
        );
        addUtilitySkillBox(Swap, '다시하기', '상대방과 나의 체력 교체,     나의 현재 체력의 10% 감소', '#FFFFFF');
        addUtilitySkillBox('', '   ', '   ', null, 0);

        // 공격형 스킬 스크롤
        const scBox = new ScrollBox({
            width: 254,
            height: 480,
            items: testArr,
            radius: 0,
            elementsMargin: 20,
        });
        scBox.x = 50; // x 좌표
        scBox.y = 134; // y 좌표
        bigBoxContainer.addChild(scBox);

        // 수비형 스킬 스크롤
        const scBox1 = new ScrollBox({
            width: 310,
            height: 480,
            items: testArr1,
            radius: 0,
            elementsMargin: 20,
        });
        bigBoxContainer1.addChild(scBox1);

        scBox1.x = 360; // x 좌표
        scBox1.y = 140; // y 좌표

        // 유틸형 스킬 스크롤
        const scBox2 = new ScrollBox({
            width: 254,
            height: 480,
            items: testArr2,
            radius: 0,
            elementsMargin: 20,
        });
        scBox2.x = 670; // x 좌표
        scBox2.y = 134; // y 좌표
        bigBoxContainer2.addChild(scBox2);
    }, []);


    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Battle;
