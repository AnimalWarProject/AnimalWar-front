import React, { useRef, useEffect } from 'react';
import * as PIXI from "pixi.js";
import {ScrollBox} from "@pixi/ui";
import {Container, Graphics} from "pixi.js";

// 공격형 스킬 이미지
import backgroundImage from '../imgs/Rectangle 12290.png';
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

const Battle = () => {
    const pixiContainer = useRef(null);
    let clickedContainer = null;
    let clickedContainer1 = null;
    let clickedContainer2 = null;
    let testArr = [];
    let testArr1 = [];
    let testArr2 = [];


    // 기본 배경크기 설정
    useEffect(() => {
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
                fontFamily: 'Arial'
            });
            message.anchor.set(0.5);
            message.x = x;
            message.y = y;
            app.stage.addChild(message);
        };
        addRoundedText('공격형 스킬', app.renderer.width / 5.5, app.renderer.height / 9, 277, 70, 40, 0x0f1828);
        addRoundedText('수비형 스킬', app.renderer.width / 1.99, app.renderer.height / 9, 277, 70, 40, 0x0f1828);
        addRoundedText('유틸형 스킬', app.renderer.width / 1.215, app.renderer.height / 9, 277, 70, 40, 0x0f1828);

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
        const bigBoxHeight = 480;
        const cornerRadius = 30;
        bigBox.drawRoundedRect(34, 130, bigBoxWidth, bigBoxHeight, cornerRadius);
        bigBox.endFill();
        bigBoxContainer.addChild(bigBox);


        // 수비형 스킬 큰박스
        const bigBox1 = new PIXI.Graphics();
        bigBox1.beginFill(0xffffff, 0.5);
        const bigBoxWidth1 = 277;
        const bigBoxHeight1 = 480;
        const cornerRadius1 = 30;
        bigBox1.drawRoundedRect(343, 130, bigBoxWidth1, bigBoxHeight1, cornerRadius1);
        bigBox1.endFill();
        bigBoxContainer1.addChild(bigBox1);



        // 유틸형 스킬 큰박스
        const bigBox2 = new PIXI.Graphics();
        bigBox2.beginFill(0xffffff, 0.5);
        const bigBoxWidth2 = 277;
        const bigBoxHeight2 = 480;
        const cornerRadius2 = 30;
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
            const cornerRadiusBox = 15; // 모서리 반경을 조정할 수 있습니다
            box.beginFill(boxColor, alpha);
            box.drawRoundedRect(0, 13, 243, 95, cornerRadiusBox);
            box.endFill();
            container.addChild(box);

            // 공격형 스킬 클릭 이벤트 핸들링 함수
            const handleClick = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor = '#ffffff'; // 상자의 색상
                const alpha = 30; // 투명도
                const cornerRadiusBox = 15; // 모서리 반경

                if (clickedContainer && clickedContainer !== container) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer.children[0].clear();
                    clickedContainer.children[0].lineStyle(0)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox)
                        .endFill();
                }

                if (clickedContainer === container) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container.children[0].clear();
                    container.children[0].lineStyle(0)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(0, 13, 243, 95, cornerRadiusBox)
                        .endFill();
                    clickedContainer = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor = '#000000'; // 변경하고자 하는 테두리 색
                    container.children[0].clear()
                        .lineStyle(4, borderColor)
                        .beginFill(boxColor, alpha)
                        .drawRoundedRect(3, 13, 243, 95, cornerRadiusBox)
                        .endFill();
                    if (clickedContainer) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer.children[0].clear();
                        clickedContainer.children[0].lineStyle(0)
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
                fontFamily: 'Arial'
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
                wordWrapWidth: 180,// 너비 조정을 위한 속성
                lineHeight: 16
            });
            descriptionText.anchor.set(0, 0.5);
            descriptionText.x = 70;
            descriptionText.y = 74;
            box.addChild(descriptionText);

            testArr.push(container);

        };

        //////////////// 여기까지 공격형 스킬 범위/////////////////////

        const addDefenseSkillBox = (imageUrl, skillName, skillDescription, boxColor, alpha) => {
            const container1 = new PIXI.Graphics();
            container1.interactive = true;
            container1.buttonMode = true;

            // 수비형 스킬 박스 위치 및 크기
            const box1 = new PIXI.Graphics();
            const cornerRadiusBox1 = 15; // 모서리 반경을 조정할 수 있습니다
            box1.beginFill(boxColor, alpha);
            box1.drawRoundedRect(60,  13, 243, 95, cornerRadiusBox1);
            box1.endFill();
            container1.addChild(box1);

            // 수비형 스킬 클릭 이벤트 핸들링 함수
            const handleClick1 = () => {
                console.log(`${skillName}이(가) 클릭되었습니다.`);
                const boxColor1 = '#ffffff'; // 상자의 색상
                const alpha1 = 30; // 투명도
                const cornerRadiusBox1 = 15; // 모서리 반경

                if (clickedContainer1 && clickedContainer1 !== container1) {
                    // 이전 클릭된 컨테이너가 있으면 테두리 색을 원래대로 되돌림
                    clickedContainer1.children[0].clear();
                    clickedContainer1.children[0].lineStyle(0)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(60, 13, 243, 95, cornerRadiusBox1)
                        .endFill();
                }

                if (clickedContainer1 === container1) {
                    // 클릭된 컨테이너가 이미 저장된 컨테이너인 경우 클릭 해제
                    container1.children[0].clear();
                    container1.children[0].lineStyle(0)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(60, 13, 243, 95, cornerRadiusBox1)
                        .endFill();
                    clickedContainer1 = null;
                } else {
                    // 클릭된 컨테이너의 테두리 색을 변경
                    const borderColor1 = '#000000'; // 변경하고자 하는 테두리 색
                    container1.children[0].clear()
                        .lineStyle(4, borderColor1)
                        .beginFill(boxColor1, alpha1)
                        .drawRoundedRect(60, 13, 243, 95, cornerRadiusBox1)
                        .endFill();
                    if (clickedContainer1) {
                        // 기존에 클릭된 다른 컨테이너의 클릭을 해제
                        clickedContainer1.children[0].clear();
                        clickedContainer1.children[0].lineStyle(0)
                            .beginFill(boxColor1, alpha1)
                            .drawRoundedRect(60, 13, 243, 95, cornerRadiusBox1)
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
                image1.x = 60;
                image1.y = 30;
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
            nameText1.x = 125;
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
                wordWrapWidth: 180,// 너비 조정을 위한 속성
                lineHeight: 16
            });
            descriptionText1.anchor.set(0, 0.5);
            descriptionText1.x = 125;
            descriptionText1.y = 74;
            box1.addChild(descriptionText1);

            testArr1.push(container1);

            bigBoxContainer1.addChild(container1);
        }

        //////여기까지 수비형 스킬///////////

        
        
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
            '5회의 공격이내 상대방이 10%의 체력 이하라면 처형',
            '#FFFFFF'
        );
        addAttackSkillBox(
            hiddenAceImage,
            '비장의 한발',
            '1회의 공격이 상대방보다 체력이 적다면 5배의 피해',
            '#FFFFFF'
        );
        addAttackSkillBox(
            poisonImage,
            '독약',
            '상대방의 최대 체력의 5%에 해당하는 데미지',
            '#FFFFFF'
        );
        addAttackSkillBox(
            speedRunImage,
            '빨리감기',
            '공격자, 수비자의 현재 체력      25% 감소',
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
            '최대 체력의 20%를 회복',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            Heal,
            '회복',
            '잃은 체력의 30%를 회복',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            IronCladDefense,
            '철통방어',
            '상대 공격을 3회 무효화',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            LuckySeven,
            '럭키 7',
            ' 현재 체력이 77% 이상일 때, 상대 공격을 7회 무효화',
            '#FFFFFF'
        );

        addDefenseSkillBox(
            RustedSword,
            '녹슨 방패',
            '(지속)모든 데미지 10% 데미지 감소',
            '#FFFFFF'
        );

        addDefenseSkillBox(
            Bandaging,
            '붕대 감기',
            '(총 3턴)잃은체력 7%, 1턴씩 체력 회복',
            '#FFFFFF'
        );
        addDefenseSkillBox(
            '',
            '',
            '',
            null,
            0
        );
        addDefenseSkillBox(
            '',
            '',
            '',
            '#FFFFFF',
            0
        );


        // 공격형 스킬 스크롤
        const scBox = new ScrollBox({
            width: 254,
            height: 480,
            items: testArr,
            radius : 30,
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
            radius : 20,
            elementsMargin: 20


        });
        bigBoxContainer1.addChild(scBox1);

        scBox1.x = 300; // x 좌표
        scBox1.y = 134; // y 좌표





    }, []);

    return <div ref={pixiContainer} />;
};

export default Battle;