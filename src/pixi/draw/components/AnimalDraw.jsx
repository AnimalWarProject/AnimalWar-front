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

        const drawOneBtn = new PIXI.Graphics(); // 1회 뽑기 버튼
        drawOneBtn.beginFill(0x6AFFF6, 0.7);
        const drawOneBtnWidth = 170;
        const drawOneBtnHeight = 40;
        drawOneBtn.drawRoundedRect(190, 480, drawOneBtnWidth, drawOneBtnHeight, 40);

        const oneButtonContainer = new PIXI.Container();
        oneButtonContainer.interactive = true; // 클릭 가능하도록 설정
        oneButtonContainer.buttonMode = true; // 마우스 오버 시 커서가 손가락 아이콘으로 변경
        oneButtonContainer.addChild(drawOneBtn);
        oneButtonContainer.on('pointertap', () => {
            alert("1 클릭")
        });
        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold"
        });
        const oneDrawTtext = new PIXI.Text('1회 뽑기', textStyle);
        drawOneBtn.addChild(oneDrawTtext);
        oneDrawTtext.x = 240;
        oneDrawTtext.y = 490;

        const drawManyBtn = new PIXI.Graphics(); // 10회 뽑기 버튼
        drawManyBtn.beginFill(0x6AFFF6, 0.7);
        const drawManyBtnWidth = 170;
        const drawManyBtnHeight = 40;
        drawManyBtn.drawRoundedRect(580, 480, drawManyBtnWidth, drawManyBtnHeight, 40);

        const manyButtonContainer = new PIXI.Container();
        manyButtonContainer.interactive = true; // 클릭 가능하도록 설정
        manyButtonContainer.buttonMode = true; // 마우스 오버 시 커서가 손가락 아이콘으로 변경
        manyButtonContainer.addChild(drawManyBtn);
        manyButtonContainer.on('pointertap', () => {
            alert("10 클릭")
        });
        const manyDrawTtext = new PIXI.Text('10회 뽑기', textStyle);
        drawManyBtn.addChild(manyDrawTtext);
        manyDrawTtext.x = 630;
        manyDrawTtext.y = 490;

        app.stage.addChild(profileBox);
        app.stage.addChild(oneButtonContainer);
        app.stage.addChild(manyButtonContainer);

        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default AnimalDraw;