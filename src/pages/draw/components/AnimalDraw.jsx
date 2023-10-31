import {useEffect, useRef} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/Rectangle 12299.png";
import oneEgg from "../imgs/ONEEGG 1.png";
import manyEgg from "../imgs/MANYEGG 1.png";

const AnimalDraw = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            background: '#1099bb',
            width: canvasWidth,
            height: canvasHeight,
        });

        // Use ref to append the PIXI application view to the DOM.
        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(back);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);
    
        const profileBoxLeft = new PIXI.Graphics(); // 왼쪽 칸
        profileBoxLeft.beginFill(0xffffff, 0.5);
        const profileWidthLeft = 350;
        const profileHeightLeft = 484;
        profileBox.drawRoundedRect(100, 70, profileWidthLeft, profileHeightLeft, 40);

        const profileBoxRight = new PIXI.Graphics(); // 오른쪽 칸
        profileBoxRight.beginFill(0xffffff, 0.5);
        const profileWidthRight = 350;
        const profileHeightRight = 484;
        profileBox.drawRoundedRect(490, 70, profileWidthRight, profileHeightRight, 40);

        const imageTexture = PIXI.Texture.from(oneEgg); // 1개 뽑기 이미지
        const imageSprite = new PIXI.Sprite(imageTexture);
        imageSprite.width = 280;
        imageSprite.height = 300;
        imageSprite.x = 125;
        imageSprite.y = 100;
        profileBox.addChild(imageSprite);

        const imageTexture1 = PIXI.Texture.from(manyEgg); // 10개뽑기 이미지
        const imageSprite1 = new PIXI.Sprite(imageTexture1);
        imageSprite1.width = 330;
        imageSprite1.height = 300;
        imageSprite1.x = 495;
        imageSprite1.y = 100;
        profileBox.addChild(imageSprite1);

        const drawBtn = new PIXI.Graphics(); // 1회 뽑기 버튼
        drawBtn.beginFill(0xA3FFF9, 0.7);
        const drawBtnWidth = 170;
        const drawBtnHeight = 40;
        drawBtn.drawRoundedRect(190, 480, drawBtnWidth, drawBtnHeight, 40);
        app.stage.addChild(drawBtn);


        // for (let i = 0; i < 6; i++) {
        //     const box1 = new PIXI.Graphics();
        //     box1.beginFill(0xffffff, 0.5);
        //     const boxWidth = canvasWidth * 0.5;
        //     const boxHeight = canvasHeight * 0.1;
        //     box1.drawRoundedRect(300, 80 + i * 80, boxWidth, boxHeight, 20);
        //     profileBox.addChild(box1);
        //
        //     const column = new PIXI.Graphics();
        //     column.beginFill(0xffc000);
        //     const columnWidth = canvasWidth * 0.13;
        //     const columnHeight = canvasHeight * 0.09;
        //     column.drawRoundedRect(320, 82 + i * 80, columnWidth, columnHeight, 10);
        //     profileBox.addChild(column);
        //
        //     const textStyle = new PIXI.TextStyle({
        //         fill: 0x0f1828,
        //         fontSize: 24,
        //         fontFamily: 'Arial',
        //     });
        //
        //     const text = new PIXI.Text('닉네임', textStyle);
        //     column.addChild(text);
        //     text.x = 340;
        //     text.y = 100 + i * 80;
        // }

        app.stage.addChild(profileBox);

        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);

    return <div ref={canvasRef}></div>;
};

export default AnimalDraw;