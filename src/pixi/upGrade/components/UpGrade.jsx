import back from "../image/Rectangle 12374.png";
import {useEffect, useRef, useState} from "react";
import * as PIXI from "pixi.js";
import {useNavigate} from "react-router-dom";
import moru from "../image/ANVIL 1.png";
import upgrade1 from "../image/UPGRADE1 1.png";
import upgrade2 from "../image/UPGRADE1 2.png";
import upgrade3 from "../image/UPGRADE1 3.png";
const UpGrade = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();
    const grade = ["노말", "레어", "슈퍼레어", "유니크", "레전드"];

    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const textStyle = new PIXI.TextStyle({ // 글꼴
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });

        const app = new PIXI.Application({
            backgroundColor: 0x1099bb,
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(back); // 뒷 배경사진
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(70, 40, profileWidth, profileHeight, 40);

        const profileInnerBox = new PIXI.Graphics(); // 작은 틀
        profileInnerBox.beginFill(0xffffff, 0.5);
        const InnerBoxWidth = 377;
        const InnerBoxHeight = 448;
        profileBox.drawRoundedRect(80, 120, InnerBoxWidth, InnerBoxHeight, 40);

        for (let i = 0; i < 5; i++) { // 등급 칸 & 텍스트
            const inventory = new PIXI.Graphics();
            inventory.beginFill(0xffffff, 0.5);
            const InventoryWidth = 140;
            const InventoryHeight = 55;
            inventory.drawRoundedRect(100 + (i * 150), 50, InventoryWidth, InventoryHeight, 40);

            const gradeText = new PIXI.Text(grade[i], textStyle);
            inventory.addChild(gradeText);
            gradeText.anchor.set(0.5); // 글자 중심
            gradeText.x = 170 + ( i * 150 ); // X 위치 조정
            gradeText.y = 80;  // Y 위치 조정
            profileBox.addChild(inventory);
            profileBox.addChild(gradeText);
        }

        const descriptionBox = new PIXI.Graphics(); // 설명 칸
        descriptionBox.beginFill(0xffffff, 0.5);
        const descriptionBoxWidth = 390;
        const descriptionBoxHeight = 85;
        profileBox.drawRoundedRect(470, 480, descriptionBoxWidth, descriptionBoxHeight, 40);
        const descriptionText = new PIXI.Text('설명 설명 설명', textStyle)
        descriptionBox.addChild(descriptionText);
        descriptionText.anchor.set(0.5);
        descriptionText.x = 660;
        descriptionText.y = 525;
        profileBox.addChild(descriptionBox);
        profileBox.addChild(descriptionText);

        for (let j = 0; j < 3; j++) { // 인벤토리 칸
            for (let i = 0; i < 3; i++) {
                const inventory = new PIXI.Graphics();
                inventory.beginFill(0xffffff, 0.5);
                const InventoryWidth = 105;
                const InventoryHeight = 122;
                profileBox.drawRoundedRect(95 + (i * 120), 150 + (j * 135), InventoryWidth, InventoryHeight, 40);
            }
        }

        const AnimalBtn = new PIXI.Graphics(); // 동물버튼
        AnimalBtn.beginFill(0xF698ED, 1);
        const AnimalBtnWidth = 110;
        const AnimalBtnHeight = 35;
        AnimalBtn.drawRoundedRect(80, 3, AnimalBtnWidth, AnimalBtnHeight, 40);
        const animalDrawText = new PIXI.Text('동물', textStyle);
        AnimalBtn.addChild(animalDrawText);
        animalDrawText.x = 135;
        animalDrawText.y = 20;
        animalDrawText.anchor.set(0.5)
        const animalButtonContainer = new PIXI.Container();
        animalButtonContainer.interactive = true;
        animalButtonContainer.buttonMode = true;
        animalButtonContainer.addChild(AnimalBtn);

        const BuildingBtn = new PIXI.Graphics(); // 건물버튼
        BuildingBtn.beginFill(0xFF594F, 1);
        const BuildingBtnWidth = 110;
        const BuildingBtnHeight = 35;
        BuildingBtn.drawRoundedRect(200, 3, BuildingBtnWidth, BuildingBtnHeight, 40);
        const BuildingDrawText = new PIXI.Text('건물', textStyle);
        BuildingBtn.addChild(BuildingDrawText);
        BuildingDrawText.x = 255;
        BuildingDrawText.y = 20;
        BuildingDrawText.anchor.set(0.5)
        const buildingButtonContainer = new PIXI.Container();
        buildingButtonContainer.interactive = true;
        buildingButtonContainer.buttonMode = true;
        buildingButtonContainer.addChild(BuildingBtn);

        const upGradeBtn = new PIXI.Graphics(); // 강화하기버튼
        upGradeBtn.beginFill(0xFF594F, 1);
        const drawBuildingBtnWidth = 150;
        const drawBuildingBtnHeight = 40;
        upGradeBtn.drawRoundedRect(720, 590, drawBuildingBtnWidth, drawBuildingBtnHeight, 40);
        const upGradeDrawText = new PIXI.Text('강화하기', textStyle);
        upGradeBtn.addChild(upGradeDrawText);
        upGradeDrawText.x = 760;
        upGradeDrawText.y = 600;
        const upGradeButtonContainer = new PIXI.Container();
        upGradeButtonContainer.interactive = true;
        upGradeButtonContainer.buttonMode = true;
        upGradeButtonContainer.addChild(upGradeBtn);
        upGradeButtonContainer.on('pointertap', () => {
            nav('/upgrade/loading');
        });


        const moruImage = PIXI.Texture.from(moru);
        const imageSprite = new PIXI.Sprite(moruImage);
        imageSprite.width = 392;
        imageSprite.height = 366;
        imageSprite.x = 490;
        imageSprite.y = 110;
        profileBox.addChild(imageSprite);



        app.stage.addChild(profileBox);
        app.stage.addChild(animalButtonContainer);
        app.stage.addChild(buildingButtonContainer);
        app.stage.addChild(upGradeButtonContainer);
    }, []);

    return <div ref={canvasRef} className="outlet-container"></div>
};

export default UpGrade;