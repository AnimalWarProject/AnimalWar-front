import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/Rectangle 12299.png";
import oneEgg from "../imgs/ONEEGG 1.png";
import manyEgg from "../imgs/MANYEGG 1.png";
import oneBuilding from "../imgs/ONEBUILDING 1.png";
import manyBuilding from "../imgs/MANYBUILDING 1.png";
import { useNavigate } from "react-router-dom";

const Draw = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();



    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            backgroundColor: 0x1099bb,
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

        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);

        const imageTexture = PIXI.Texture.from(oneEgg);
        const imageSprite = new PIXI.Sprite(imageTexture);
        imageSprite.width = 280;
        imageSprite.height = 300;
        imageSprite.x = 125;
        imageSprite.y = 100;
        profileBox.addChild(imageSprite);

        const imageTexture1 = PIXI.Texture.from(manyEgg);
        const imageSprite1 = new PIXI.Sprite(imageTexture1);
        imageSprite1.width = 330;
        imageSprite1.height = 330;
        imageSprite1.x = 495;
        imageSprite1.y = 100;
        profileBox.addChild(imageSprite1);

        const changeToAnimal = () => {
            imageSprite.texture = PIXI.Texture.from(oneEgg); // 1개 뽑기 이미지로 변경
            imageSprite1.texture = PIXI.Texture.from(manyEgg); // 10개 뽑기 이미지로 변경
        };

        const changeToBuilding = () => {
            imageSprite.texture = PIXI.Texture.from(oneBuilding); // 건물 이미지로 변경
            imageSprite1.texture = PIXI.Texture.from(manyBuilding); // 10개 뽑기 이미지로 변경
        };


        const drawOneBtn = new PIXI.Graphics();
        drawOneBtn.beginFill(0x6AFFF6, 0.7);
        const drawOneBtnWidth = 170;
        const drawOneBtnHeight = 40;
        drawOneBtn.drawRoundedRect(190, 480, drawOneBtnWidth, drawOneBtnHeight, 40);

        const oneButtonContainer = new PIXI.Container();
        oneButtonContainer.interactive = true;
        oneButtonContainer.buttonMode = true;
        oneButtonContainer.addChild(drawOneBtn);
        oneButtonContainer.on('pointertap', () => {
            nav('/drawLoading');
        });

        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });
        const oneDrawText = new PIXI.Text('1회 뽑기', textStyle);
        drawOneBtn.addChild(oneDrawText);
        oneDrawText.x = 240;
        oneDrawText.y = 490;

        const drawManyBtn = new PIXI.Graphics();
        drawManyBtn.beginFill(0x6AFFF6, 0.7);
        const drawManyBtnWidth = 170;
        const drawManyBtnHeight = 40;
        drawManyBtn.drawRoundedRect(580, 480, drawManyBtnWidth, drawManyBtnHeight, 40);

        const manyButtonContainer = new PIXI.Container();
        manyButtonContainer.interactive = true;
        manyButtonContainer.buttonMode = true;
        manyButtonContainer.addChild(drawManyBtn);
        manyButtonContainer.on('pointertap', () => {
            alert("10 클릭");
        });

        const manyDrawText = new PIXI.Text('10회 뽑기', textStyle);
        drawManyBtn.addChild(manyDrawText);
        manyDrawText.x = 630;
        manyDrawText.y = 490;

        const drawAnimalBtn = new PIXI.Graphics();
        drawAnimalBtn.beginFill(0x6AFFF6, 0.7);
        const drawAnimalBtnWidth = 100;
        const drawAnimalBtnHeight = 40;
        drawAnimalBtn.drawRoundedRect(100, 0, drawAnimalBtnWidth, drawAnimalBtnHeight, 40);

        const animalDrawText = new PIXI.Text('동물', textStyle);
        drawAnimalBtn.addChild(animalDrawText);
        animalDrawText.x = 130;
        animalDrawText.y = 10;

        const animalButtonContainer = new PIXI.Container();
        animalButtonContainer.interactive = true;
        animalButtonContainer.buttonMode = true;
        animalButtonContainer.addChild(drawAnimalBtn);
        animalButtonContainer.on('pointertap', changeToAnimal);

        const drawBuildingBtn = new PIXI.Graphics();
        drawBuildingBtn.beginFill(0xB6C1EA, 0.7);
        const drawBuildingBtnWidth = 100;
        const drawBuildingBtnHeight = 40;
        drawBuildingBtn.drawRoundedRect(210, 0, drawBuildingBtnWidth, drawBuildingBtnHeight, 40);

        const BuildingDrawText = new PIXI.Text('건물', textStyle);
        drawBuildingBtn.addChild(BuildingDrawText);
        BuildingDrawText.x = 240;
        BuildingDrawText.y = 10;

        const buildingButtonContainer = new PIXI.Container();
        buildingButtonContainer.interactive = true;
        buildingButtonContainer.buttonMode = true;
        buildingButtonContainer.addChild(drawBuildingBtn);
        buildingButtonContainer.on('pointertap', changeToBuilding);


        app.stage.addChild(profileBox);
        app.stage.addChild(oneButtonContainer);
        app.stage.addChild(manyButtonContainer);
        app.stage.addChild(animalButtonContainer);
        app.stage.addChild(buildingButtonContainer);
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>;
};

export default Draw;