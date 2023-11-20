import React, {useRef, useEffect, useState} from 'react';
import * as PIXI from "pixi.js";
import Transparency from '../imgs/Transparency.png';
import backgroundImage from '../imgs/Rectangle 12290.png';
import {CustomScrollBox} from "./CustomScollBox";
import { gsap } from 'gsap';
import {api} from "../../../network/api";

// 공격형 스킬 이미지
import berserkerImage from '../imgs/Berserker.png';
import bombDropImage from '../imgs/BombDrop.webp';
import ExecutionImage from '../imgs/Execution.webp';
import hiddenAceImage from '../imgs/HiddenAce.webp';
import poisonImage from '../imgs/Poison.webp';
import speedRunImage from '../imgs/SpeedRun.webp';

// 수비형 스킬 이미지
import EmergencyFood from '../imgs/EmergencyFood.webp';
import Heal from '../imgs/Heal.webp';
import IronCladDefense from '../imgs/IronCladDefense.webp';
import LuckySeven from '../imgs/LuckySeven.webp';
import RustedSword from '../imgs/RustedSword.webp';
import Bandaging from '../imgs/Bandaging.webp';

// 유틸형 스킬 이미지
import BrokenSpear from '../imgs/BrokenSpear.webp';
import BrokenShield from '../imgs/BrokenShield.webp';
import DoItAgain from '../imgs/DoItAgain.webp';
import OffenseDefenseShift from '../imgs/OffenseDefenseShift.webp';
import StrongAndWeak from '../imgs/StrongAndWeak.webp';
import Swap from '../imgs/Swap.webp';


const AttackerSkill = ({setFlag}) => {
    const pixiContainer = useRef(null);
    let clickedContainer = null;
    let clickedContainer1 = null;
    let clickedContainer2 = null;
    let testArr = [];
    let testArr1 = [];
    let testArr2 = [];
    const [selectedSkill, setSelectedSkill] = useState({
        attackerAttackTypeSkill: '',
        attackerDefensiveTypeSkill: '',
        attackerUtilityTypeSkill: ''
    });

    useEffect(() => {
        // 기본 배경크기 설정
        const app = new PIXI.Application({
            width: 960,
            height: 640,
            transparent: true
        });
        pixiContainer.current.appendChild(app.view);

        // 뒷 배경화면
        const background = PIXI.Sprite.from(backgroundImage);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        // 유형별 스킬 크기 및 위치 조정
        const addRoundedText = (text, x, y, width, height, cornerRadius, fontSize, fontWeight) => {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(0);
            graphics.beginFill('#FFC000');
            graphics.drawRoundedRect(x , y, width, height, cornerRadius);
            graphics.endFill();
            app.stage.addChild(graphics);

            // 글꼴
            const message = new PIXI.Text(text, {
                fontSize: fontSize || 27,
                fontWeight: fontWeight || 'normal',
                fill: 0x0f1828,
                align: 'center',
                fontFamily: 'Arial'
            });
            message.anchor.set(0.5);
            message.x = x + width / 2;
            message.y = y + height/ 2;
            app.stage.addChild(message);



            const handleClick0 = async () => {
                console.log(`${text}이(가) 클릭되었습니다.`);

                const attackerAttackTypeSkill = localStorage.getItem('attackerAttackTypeSkill');
                const attackerDefensiveTypeSkill = localStorage.getItem
                ('attackerDefensiveTypeSkill');
                const attackerUtilityTypeSkill = localStorage.getItem('attackerUtilityTypeSkill')

                try {
                    const updatedState = {
                        attackerAttackTypeSkill,
                        attackerDefensiveTypeSkill,
                        attackerUtilityTypeSkill,
                    };
                    const skillToken = localStorage.getItem('accessToken');
                    console.log(text)
                    if (text === '매칭 시작') {
                        if (!attackerAttackTypeSkill || !attackerDefensiveTypeSkill || !attackerUtilityTypeSkill) {
                            alert('모든 스킬을 선택해야 매칭이 됩니다.');
                            return; // 매칭 시작을 중지하고 함수를 종료
                        }
                        const response = await api('/api/v1/skill/changeAttackerSkill', 'PUT', updatedState, {
                            headers: {
                                Authorization: `Bearer ${skillToken}`,
                            },
                        });

                        // API 호출이 성공했는지 확인
                        if (response.status === 200) {
                            console.log('공격자 스킬이 성공적으로 업데이트되었습니다.');
                            setSelectedSkill(response);
                            localStorage.removeItem('attackerAttackTypeSkill');
                            localStorage.removeItem('attackerDefensiveTypeSkill');
                            localStorage.removeItem('attackerUtilityTypeSkill');
                        } else {
                            console.log('공격자 스킬 업데이트 실패. 서버 응답:', response.status);
                        }
                    } else {
                        setFlag(0);
                    }
                } catch (error) {
                    console.error('API 호출 중 오류 발생:', error);
                }

                if (text === "매칭 시작") {
                    // '전투 시작'이 클릭된 경우 리다이렉션 수행
                    gsap.to(graphics, { alpha: 0.5, duration: 0.5, onComplete: () => {
                            window.location = 'http://localhost:3000/match2';
                        } });
                }
            };
            graphics.interactive = true;
            graphics.buttonMode = true;
            graphics.on('click', handleClick0);

            const handleClick1 = () => {
                console.log(`${text}이(가) 클릭되었습니다.`);
                console.log(text);
                if (text === "수비스킬 셋팅") {
                    localStorage.removeItem('attackerAttackTypeSkill');
                    localStorage.removeItem('attackerDefensiveTypeSkill');
                    localStorage.removeItem('attackerUtilityTypeSkill');
                }
            };
            graphics.interactive = true;
            graphics.buttonMode = true;
            graphics.on('click', handleClick1);



        };
        addRoundedText('공격형 스킬', 34, 15, 277, 65, 5);
        addRoundedText('수비형 스킬',  340, 15, 277, 65, 5);
        addRoundedText('유틸형 스킬', 653, 15, 277, 65, 5);
        addRoundedText('매칭 시작',  800, 590, 126, 39, 20, 18, 'bold');
        // addRoundedText('공격스킬 셋팅',  40, 590, 150, 39, 20, 18, 'bold');
        addRoundedText('수비스킬 셋팅',  40, 590, 150, 39, 20, 18, 'bold');


        // 공격형 스킬 큰 박스를 담을 컨테이너
        const bigBoxContainer = new PIXI.Container();
        app.stage.addChild(bigBoxContainer);

        // 수비형 스킬 큰 박스를 담을 컨테이너
        const bigBoxContainer1 = new PIXI.Container();
        app.stage.addChild(bigBoxContainer1);

        // 수비형 스킬 큰 박스를 담을 컨테이너
        const bigBoxContainer2 = new PIXI.Container();
        app.stage.addChild(bigBoxContainer2);


        // 공격형 스킬 큰박스
        const bigBox = new PIXI.Graphics();
        bigBox.beginFill(0xffffff, 0.5);
        const bigBoxWidth = 277;
        const bigBoxHeight = 490;
        const cornerRadius = 5;
        bigBox.drawRoundedRect(34, 90, bigBoxWidth, bigBoxHeight, cornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);


        // 수비형 스킬 큰박스
        const bigBox1 = new PIXI.Graphics();
        bigBox1.beginFill(0xffffff, 0.5);
        const bigBoxWidth1 = 277;
        const bigBoxHeight1 = 490;
        const cornerRadius1 = 5;
        bigBox1.drawRoundedRect(343, 90, bigBoxWidth1, bigBoxHeight1, cornerRadius1);
        bigBox1.endFill();
        bigBoxContainer1.addChild(bigBox1);


        // 유틸형 스킬 큰박스
        const bigBox2 = new PIXI.Graphics();
        bigBox2.beginFill(0xffffff, 0.5);
        const bigBoxWidth2 = 277;
        const bigBoxHeight2 = 490;
        const cornerRadius2 = 5;
        bigBox2.drawRoundedRect(653, 90, bigBoxWidth2, bigBoxHeight2, cornerRadius2);
        bigBox2.endFill();
        bigBoxContainer2.addChild(bigBox2);


        // 공격형 스킬들 설정
        const addAttackSkillBox = (imageUrl, skillName, skillDescription, boxColor, alpha) => {
            const container = new PIXI.Graphics();
            container.interactive = true;
            container.buttonMode = true;

            // 공격형 스킬 박스 위치 및 크기
            const box = new PIXI.Graphics();
            const cornerRadiusBox = 5;
            box.beginFill(boxColor, alpha);
            box.drawRoundedRect(0, 10, 243, 95, cornerRadiusBox);
            box.endFill();
            container.addChild(box);

            // 공격형 스킬 클릭 이벤트 핸들링 함수
            const handleClick = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor = '#ffffff'; // 상자의 색상
                // const originalColor = '#ffffff'; // 원래 색상 (하얀색)
                const alpha = 50; // 투명도
                const cornerRadiusBox = 5; // 모서리 반경

                if (clickedContainer && clickedContainer !== container) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer.children[0].clear();
                    clickedContainer.children[0].lineStyle(0)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox)
                        .endFill();
                }

                if (clickedContainer === container) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container.children[0].clear();
                    container.children[0].lineStyle(0)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox)
                        .endFill();
                    clickedContainer = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor = '#000000'; // 변경하고자 하는 테두리 색
                    container.children[0].clear()
                        .lineStyle(4, borderColor)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox)
                        .endFill();
                    localStorage.setItem('attackerAttackTypeSkill', skillName);
                    if (clickedContainer) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer.children[0].clear();
                        clickedContainer.children[0].lineStyle(0)
                            .beginFill(boxColor, alpha)
                            .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox)
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
                image.y = 25;
                box.addChild(image);
            }

            // 공격형 스킬 이름 크기 및 폰트
            const nameText = new PIXI.Text(skillName, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial'
            });
            nameText.anchor.set(0, 0.5);
            nameText.x = 70;
            nameText.y = 40;
            box.addChild(nameText);


            // 공격형 스킬 설명 조정
            const descriptionText = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180,// 너비 조정을 위한 속성
                lineHeight: 16
            });
            descriptionText.anchor.set(0, 0.5);
            descriptionText.x = 70;
            descriptionText.y = 70;
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
            box1.drawRoundedRect(0, 10, 243, 95, cornerRadiusBox1);
            box1.endFill();
            container1.addChild(box1);

            // 마스크 생성
            const mask1 = new PIXI.Graphics();
            mask1.beginFill(0xffffff); // 마스크 색상은 투명하게
            mask1.drawRect(0, 0, 244, 120);
            mask1.endFill();
            container1.addChild(mask1);

            // 마스크 설정
            container1.mask = mask1;

            // 수비형 스킬 클릭 이벤트 핸들링 함수
            const handleClick1 = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor1 = '#ffffff'; // 상자의 색상
                const alpha1 = 30; // 투명도
                const cornerRadiusBox1 = 5; // 모서리 반경

                if (clickedContainer1 && clickedContainer1 !== container1) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer1.children[0].clear();
                    clickedContainer1.children[0].lineStyle(0)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(0, 6, 243, 95, cornerRadiusBox1)
                        .endFill();
                }

                if (clickedContainer1 === container1) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container1.children[0].clear();
                    container1.children[0].lineStyle(0)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(0, 6, 243, 95, cornerRadiusBox1)
                        .endFill();
                    clickedContainer1 = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor1 = '#000000'; // 변경하고자 하는 테두리 색
                    container1.children[0].clear()
                        .lineStyle(4, borderColor1)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(0, 6, 243, 95, cornerRadiusBox1)
                        .endFill();
                    localStorage.setItem('attackerDefensiveTypeSkill', skillName);
                    if (clickedContainer1) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer1.children[0].clear();
                        clickedContainer1.children[0].lineStyle(0)
                            .beginFill(boxColor1, alpha1)
                            .drawRoundedRect(0, 6, 243, 95, cornerRadiusBox1)
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
                image1.y = 25;
                box1.addChild(image1);
            }

            // 수비형 스킬 이름 크기 및 폰트
            const nameText1 = new PIXI.Text(skillName, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial'
            });
            nameText1.anchor.set(0, 0.5);
            nameText1.x = 70;
            nameText1.y = 40;
            box1.addChild(nameText1);


            // 수비형 스킬 설명 조정
            const descriptionText1 = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180,// 너비 조정을 위한 속성
                lineHeight: 16
            });
            descriptionText1.anchor.set(0, 0.5);
            descriptionText1.x = 70;
            descriptionText1.y = 70;
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
            box2.drawRoundedRect(0, 10, 243, 95, cornerRadiusBox2);
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
                    clickedContainer2.children[0].lineStyle(0)
                        .beginFill(boxColor2, alpha2)
                        .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox2)
                        .endFill();
                }

                if (clickedContainer2 === container2) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container2.children[0].clear();
                    container2.children[0].lineStyle(0)
                        .beginFill(boxColor2, alpha2)
                        .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox2)
                        .endFill();
                    clickedContainer2 = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor2 = '#000000'; // 변경하고자 하는 테두리 색
                    container2.children[0].clear()
                        .lineStyle(4, borderColor2)
                        .beginFill(boxColor2, alpha2)
                        .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox2)
                        .endFill();
                    localStorage.setItem('attackerUtilityTypeSkill', skillName);
                    if (clickedContainer2) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer2.children[0].clear();
                        clickedContainer2.children[0].lineStyle(0)
                            .beginFill(boxColor2, alpha2)
                            .drawRoundedRect(1, 6, 243, 95, cornerRadiusBox2)
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
                image2.y = 25;
                box2.addChild(image2);
            }

            // 유틸형 스킬 이름 크기 및 폰트
            const nameText2 = new PIXI.Text(skillName, {
                fontSize: 21,
                fill: 0x0f1828,
                align: 'justify',
                fontWeight: 'bolder',
                fontFamily: 'Arial'
            });
            nameText2.anchor.set(0, 0.5);
            nameText2.x = 70;
            nameText2.y = 40;
            box2.addChild(nameText2);


            // 유틸형 스킬 설명 조정
            const descriptionText2 = new PIXI.Text(skillDescription, {
                fontSize: 13,
                fill: '#000000',
                align: 'justify',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                wordWrap: true,
                wordWrapWidth: 180,// 너비 조정을 위한 속성
                lineHeight: 16
            });
            descriptionText2.anchor.set(0, 0.5);
            descriptionText2.x = 70;
            descriptionText2.y = 70;
            box2.addChild(descriptionText2);

            testArr2.push(container2);

        };

        // 공격형 박스
        addAttackSkillBox(
            berserkerImage,
            '버서커',
            '자신의 체력이 20% 이하, 기본공격 3.5배 데미지 변경',
            '#FFFFFF'
        );
        addAttackSkillBox(
            bombDropImage,
            '폭탄 투하',
            '상대방 현재 체력의 20%에 해당하는 데미지',
            '#FFFFFF'
        );
        addAttackSkillBox(
            ExecutionImage,
            '처형',
            '5회의 공격이내 상대방,       체력 10%이하라면 처형',
            '#FFFFFF'
        );
        addAttackSkillBox(
            hiddenAceImage,
            '비장의 한발',
            '상대방보다 체력이 적다면 기본공격 5배의 피해',
            '#FFFFFF'
        );
        addAttackSkillBox(
            poisonImage,
            '독약',
            '상대방 최대 체력의 5%에 해당하는 데미지를 가함',
            '#FFFFFF'
        );
        addAttackSkillBox(
            speedRunImage,
            '빨리감기',
            '상대방과 나의 현재 체력을 각각 25% 감소',
            '#FFFFFF'
        );
        addAttackSkillBox(
            '',
            '',
            '',
            null,
            0
        );

        // 수비형 박스
        addDefenseSkillBox(
            EmergencyFood,
            '비상식량',
            '최대 체력의 20%에             해당하는 양을 회복',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            Heal,
            '회복',
            '잃은 체력의 30%에            해당하는 양을 회복',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            IronCladDefense,
            '철통방어',
            '상대방의 기본공격을             3회 동안 무효화',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            LuckySeven,
            '럭키 7',
            '현재 체력이 77% 이상일 때, 상대 기본공격을 7회 무효화',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            RustedSword,
            '녹슨 방패',
            '상대방의 모든 유형의        데미지를 10%만큼 감소',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            Bandaging,
            '붕대 감기',
            '3턴 동안, 받은 데미지의         7% 만큼의 체력을 회복',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            Transparency,
            '',
            '',
            null,
            0
        );

        // 유틸형 스킬
        addUtilitySkillBox(
            BrokenSpear,
            '부러진 창',
            '상대방 공격형 스킬 금지',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            BrokenShield,
            '부러진 방패',
            '상대방 방어형 스킬 금지',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            DoItAgain,
            '다시하기',
            '상대방과 자신의 체력을       100% 회복',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            OffenseDefenseShift,
            '공수교대',
            '공격자는 방어력으로,     수비자는 공격력으로 전투',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            StrongAndWeak,
            '강약약강',
            '나체력>상대체력: 공방 10%↑\n' +
            '나체력<상대체력: 공방 10%↓',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            Swap,
            '바꿔치기',
            '상대방과 나의 체력 교체,     나의 현재 체력의 10% 감소',
            '#FFFFFF'
        );
        addUtilitySkillBox(
            '',
            '   ',
            '   ',
            null,
            0
        );


        // 공격형 스킬 스크롤

        const scBox = new CustomScrollBox({
            width: 254,
            height: 480,
            items: testArr,
            radius : 0,
            elementsMargin: 20,
            onMouseScrollBinding: false,
            drag: true,
        }, true);
        scBox.x = 50; // x 좌표
        scBox.y = 100; // y 좌표
        bigBoxContainer.addChild(scBox);

        // 수비형 스킬 스크롤
        const scBox1 = new CustomScrollBox({
            width: 310,
            height: 480,
            items: testArr1,
            radius : 0,
            elementsMargin: 20,
        }, true);
        bigBoxContainer1.addChild(scBox1);
        scBox1.x = 360 // x 좌표
        scBox1.y = 100; // y 좌표

        // 유틸형 스킬 스크롤
        const scBox2 = new CustomScrollBox({
            width: 254,
            height: 480,
            items: testArr2,
            radius : 0,
            elementsMargin: 20,
            // disableScrolling: true
        }, true);
        scBox2.x = 670; // x 좌표
        scBox2.y = 100; // y 좌표
        bigBoxContainer2.addChild(scBox2);

    }, []);

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default AttackerSkill;