import {useEffect, useRef, useState} from "react";
import * as PIXI from "pixi.js";
import back from "../imgs/AnyConv.com__Rectangle 12299.webp";
import oneEgg from "../imgs/AnyConv.com__ONEEGG 1.webp";
import manyEgg from "../imgs/AnyConv.com__MANYEGG 1.webp";
import oneBuilding from "../imgs/AnyConv.com__ONEBUILDING 1.webp";
import manyBuilding from "../imgs/AnyConv.com__MANYBUILDING 1.webp";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Draw = () => {
    const canvasRef = useRef(null);
    const nav = useNavigate();
    // todo : useEffect 밖에있어서 빈값이 먼저 들어간다.
    const accessToken = localStorage.getItem('accessToken');
    const [userInfo, setUserInfo] = useState({
        attackPower :0,
        battlePoint : 0,
        defensePower :0,
        food : 0,
        gold : 0,
        id : "",
        iron :0,
        land : 0,
        landForm : "",
        life :0,
        mountain:0,
        nickName:"",
        profileImage :"",
        sea: 0,
        species :"",
        uuid: "",
        wood : 0
    }); // todo : 유저의 정보

    useEffect(() => {
        // axios.get(`http://localhost:8000/api/v1/user`, { // axios 말고 api 사용 async await
        //     headers: {
        //         Authorization: `Bearer ${accessToken}`
        //     }
        // }).then((response) => {
        //     console.log(response.data)
        //     console.log(response.data.gold)
        //     setUserInfo(response.data)
        //     setTimeout(function (){
        //         console.log(userInfo)
        //     }, 3000)
        //
        // }).catch((err) => {
        //     console.log(err + "에러 발생 유저인포")
        // })
        const price = 1000; // 뽑기가격
        const canvasWidth = 960;
        const canvasHeight = 640;
        const drawData = { // 건물 or 동물 , 1 or 10
            type: "animal",
            qty: 1
        };
        const textStyle = new PIXI.TextStyle({
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
            drawData.type = "animal";
        };

        const changeToBuilding = () => {
            imageSprite.texture = PIXI.Texture.from(oneBuilding); // 건물 이미지로 변경
            imageSprite1.texture = PIXI.Texture.from(manyBuilding); // 10개 뽑기 이미지로 변경
            drawData.type = "building";
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
            console.log("유저돈"+userInfo.gold)
            console.log("유저정보"+ JSON.stringify(userInfo))
            if (userInfo.gold >= price){
                drawData.qty = 1;
                nav('/draw/loading', {state : drawData});
            }else {
                alert("잔액부족")
            }

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
            if (userInfo.gold >= price * 10){
                drawData.qty = 10;
                nav('/draw/loading', {state : drawData});
            }else {
                alert("잔액부족")
            }
        });
        const manyDrawText = new PIXI.Text('10회 뽑기', textStyle);
        drawManyBtn.addChild(manyDrawText);
        manyDrawText.x = 630;
        manyDrawText.y = 490;

        const drawAnimalBtn = new PIXI.Graphics();
        drawAnimalBtn.beginFill(0x6AFFF6, 0.7);
        const drawAnimalBtnWidth = 100;
        const drawAnimalBtnHeight = 36;
        drawAnimalBtn.drawRoundedRect(100, 2, drawAnimalBtnWidth, drawAnimalBtnHeight, 10);

        const animalDrawText = new PIXI.Text('동물', textStyle);
        drawAnimalBtn.addChild(animalDrawText);
        animalDrawText.x = 131;
        animalDrawText.y = 10;

        const animalButtonContainer = new PIXI.Container();
        animalButtonContainer.interactive = true;
        animalButtonContainer.buttonMode = true;
        animalButtonContainer.addChild(drawAnimalBtn);
        animalButtonContainer.on('pointertap', changeToAnimal);

        const drawBuildingBtn = new PIXI.Graphics();
        drawBuildingBtn.beginFill(0xB6C1EA, 0.7);
        const drawBuildingBtnWidth = 100;
        const drawBuildingBtnHeight = 36;
        drawBuildingBtn.drawRoundedRect(210, 2, drawBuildingBtnWidth, drawBuildingBtnHeight, 10);

        const BuildingDrawText = new PIXI.Text('건물', textStyle);
        drawBuildingBtn.addChild(BuildingDrawText);
        BuildingDrawText.x = 241;
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

        return <div ref={canvasRef} className="outlet-container"></div>
};

export default Draw;