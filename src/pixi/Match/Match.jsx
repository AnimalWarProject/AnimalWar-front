import * as PIXI from "pixi.js";
import { useEffect } from "react";
import back from "./imgs/Rectangle12273.png"
import test from "./imgs/Rectangle 3.png"

const Match = () => {

    const canvasWidth = 960; // 캔버스의 너비
    const canvasHeight = 640; // 캔버스의 높이

    const app = new PIXI.Application({
        background: '#1099bb',
        width: canvasWidth,
        height: canvasHeight
    });
    document.body.appendChild(app.view);

    const background = PIXI.Sprite.from(back); // 이미지 파일 경로를 지정해야 합니다.
    background.width = app.screen.width; // 화면 너비와 높이에 맞게 크기 조정
    background.height = app.screen.height;

    // 배경 스프라이트를 스테이지에 추가합니다.
    app.stage.addChild(background);

    //이미지 스프라이트 추가
    const profileBox = new PIXI.Graphics();

    profileBox.beginFill(0xFFFFFF, 0.5);

    const profileWidth = canvasWidth * 0.85;
    const profileHeight = canvasHeight * 0.85;

    profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);


    // 이미지 스프라이트를 생성합니다.
    const imageTexture = PIXI.Texture.from(test); // 이미지 파일 경로를 지정해야 합니다.
    const imageSprite = new PIXI.Sprite(imageTexture);

    // 이미지 스프라이트의 크기를 조절하고 위치를 설정합니다.
    imageSprite.width = 146;
    imageSprite.height = 127;
    imageSprite.x = 120;
    imageSprite.y = 70;

    // 모서리가 둥근 직사각형 내에 이미지 스프라이트를 추가합니다.
    profileBox.addChild(imageSprite);



    for (let i = 0; i < 6; i++) {
        // 한줄 시작 

        const box1 = new PIXI.Graphics();

        box1.beginFill(0xFFFFFF, 0.5);

        const boxWidth = canvasWidth * 0.5;
        const boxHeight = canvasHeight * 0.1;

        box1.drawRoundedRect(300, 80 + i * 80, boxWidth, boxHeight, 20);

        profileBox.addChild(box1);

        const column = new PIXI.Graphics();
        column.beginFill(0xFFC000);

        const columnWidth = canvasWidth * 0.13;
        const columnHeight = canvasHeight * 0.09;

        column.drawRoundedRect(320, 82 + i * 80, columnWidth, columnHeight, 10);
        profileBox.addChild(column);

        // 텍스트 스프라이트를 생성합니다.
        const textStyle = new PIXI.TextStyle({
            fill: 0x0F1828, // 텍스트 색상 (여기서는 흰색)
            fontSize: 24, // 폰트 크기
            fontFamily: 'Arial', // 폰트 패밀리 (원하는 폰트로 설정)
        });

        const text = new PIXI.Text('닉네임', textStyle);

        // 텍스트 스프라이트를 컨테이너에 추가합니다.
        column.addChild(text);

        text.x = 340;
        text.y = 100 + i * 80;


        //한줄끝
    }

    app.stage.addChild(profileBox);




}

export default Match;