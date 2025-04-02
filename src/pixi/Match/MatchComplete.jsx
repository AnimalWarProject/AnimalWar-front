import * as PIXI from 'pixi.js';
import back from './imgs/Rectangle12273.png';
import VS from './imgs/VS 1.webp';
import test from './imgs/Rectangle 3.png';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import {useHistory} from "react-router-use-history";


const MatchComplete = () => {


    const history = useHistory();
    useEffect(() => {

        setTimeout(() => history.push("/battle2", { state: data }), 5000)
 }, [])

    const canvasRef = useRef(null);

    const location = useLocation();
    const data = location.state;
    console.log(data);
    console.log(data.state.attacker);


    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);

        }

        const background = PIXI.Sprite.from(back);
        background.width = app.screen.width;
        background.height = app.screen.height;


        app.stage.addChild(background);




        //하얀 내 반투명 박스
        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.4;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        app.stage.addChild(profileBox);

        //내 테스트 이미지 프로필 

        const profileImage = PIXI.Texture.from(data.state.attacker.profileImage);
        const profileSprite = new PIXI.Sprite(profileImage);
        profileSprite.width = 100;
        profileSprite.height = 80;
        profileSprite.x = canvasWidth * 0.1;
        profileSprite.y = canvasHeight * 0.1;
        profileBox.addChild(profileSprite);


        //하얀 내 컬럼
        const array = ['닉네임', '공격력', '방어력', '  체 력', '  종 족', '  지 형'];
        const content = [data.state.attacker.nickName, data.state.attacker.attackPower, data.state.attacker.defensePower, data.state.attacker.life, data.state.attacker.species, data.state.attacker.landForm];


        for (let i = 0; i < 6; i++) {
            const box1 = new PIXI.Graphics();
            box1.beginFill(0xffffff, 0.5);
            const boxWidth = canvasWidth * 0.3;
            const boxHeight = canvasHeight * 0.08;
            box1.drawRoundedRect(100, 160 + i * 70, boxWidth, boxHeight, 20);
            profileBox.addChild(box1);

            const column = new PIXI.Graphics();
            column.beginFill(0xFC5740);
            const columnWidth = canvasWidth * 0.1;
            const columnHeight = canvasHeight * 0.07;
            column.drawRoundedRect(120, 162 + i * 70, columnWidth, columnHeight, 10);
            profileBox.addChild(column);


            const textStyle = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24,
                fontFamily: 'Arial',
            });

            const text = new PIXI.Text(array[i], textStyle);
            column.addChild(text);
            text.x = 127;
            text.y = 172 + i * 70;



            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24,
                fontFamily: 'Arial',
            });
            const text2 = new PIXI.Text(content[i], textStyle2);

            text2.x = 230;
            text2.y = 175 + i * 70;
            column.addChild(text2);
        }



        //하얀 적 반투명 박스

        const profileBox2 = new PIXI.Graphics();
        profileBox2.beginFill(0xffffff, 0.5);
        const profileWidth2 = canvasWidth * 0.4;
        const profileHeight2 = canvasHeight * 0.85;
        profileBox.drawRoundedRect(100 + profileWidth2, 40, profileWidth, profileHeight, 40);


        //적 테스트 이미지 프로필 
        const profileImage2 = PIXI.Texture.from(data.state.depender.profileImage);
        const profileSprite2 = new PIXI.Sprite(profileImage2);
        profileSprite2.width = 100;
        profileSprite2.height = 80;
        profileSprite2.x = canvasWidth * 0.55;
        profileSprite2.y = canvasHeight * 0.1;
        profileBox.addChild(profileSprite2);

        app.stage.addChild(profileBox);

        const content2 = [data.state.depender.nickName, data.state.depender.attackPower, data.state.depender.defensePower, data.state.depender.life, data.state.depender.species, data.state.depender.landForm];

        for (let i = 0; i < 6; i++) {
            const box1 = new PIXI.Graphics();
            box1.beginFill(0xffffff, 0.5);
            const boxWidth = canvasWidth * 0.3;
            const boxHeight = canvasHeight * 0.08;
            box1.drawRoundedRect(510, 160 + i * 70, boxWidth, boxHeight, 20);
            profileBox.addChild(box1);

            const column = new PIXI.Graphics();
            column.beginFill(0x5B7FFF);
            const columnWidth = canvasWidth * 0.1;
            const columnHeight = canvasHeight * 0.07;
            column.drawRoundedRect(530, 162 + i * 70, columnWidth, columnHeight, 10);
            profileBox.addChild(column);


            const textStyle = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24, 
                fontFamily: 'Arial',
            });

            const text = new PIXI.Text(array[i], textStyle);
            column.addChild(text);
            text.x = 537;
            text.y = 172 + i * 70;

            // 컨텐츠 텍스트 스프라이트
            const textStyle2 = new PIXI.TextStyle({
                fill: 0x0F1828,
                fontSize: 24,
                fontFamily: 'Arial', 
            });
            const text2 = new PIXI.Text(content2[i], textStyle2);

            text2.x = 640;
            text2.y = 175 + i * 70;
            column.addChild(text2);
        }


        // VS 스프라이트
        const VSImage = PIXI.Texture.from(VS);
        const imageSprite = new PIXI.Sprite(VSImage);
        imageSprite.width = 146;
        imageSprite.height = 127;
        imageSprite.x = canvasWidth * 0.4;
        imageSprite.y = canvasHeight * 0.4;
        profileBox.addChild(imageSprite);


    }, [])

    return <div ref={canvasRef}></div>;

}

export default MatchComplete;