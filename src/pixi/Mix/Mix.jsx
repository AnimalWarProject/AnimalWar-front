import {useEffect, useRef, useState} from "react";
import * as PIXI from 'pixi.js';
import pig from './imgs/PIG 5.png'
import bird from './imgs/Bird.png'
import cat from './imgs/Cat.png'
import dog from './imgs/Dog.png'
import fish from './imgs/Fish.png'
import mixPot from './imgs/MIXPOT 1.png'
import mixBackground from './imgs/Rectangle 12348.png'
import { useHistory } from 'react-router-use-history';
import {ButtonContainer} from "@pixi/ui";

const Mix = () => {
    const canvasRef = useRef(null);
    const [animal, setAnimal] = useState([pig, bird, cat, dog, fish, pig, bird, cat, dog, fish, pig, bird, cat, dog, fish]);
    const [count, setCount] = useState([0, 2, 5, 8, 13, 0, 2, 5, 8, 13, 0, 2, 5, 8, 13]);
    const history = useHistory();


    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        const app = new PIXI.Application({
            background: '#1099bb',
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(mixBackground);
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics();
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);
        app.stage.addChild(profileBox);






        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });

        // 건물/동물 인벤토리
        // 동물
        const mixAnimalBtn = new PIXI.Graphics();
        mixAnimalBtn.beginFill(0x6AFFF6, 0.7);
        const mixAnimalBtnWidth = 100;
        const mixAnimalBtnHeight = 40;
        mixAnimalBtn.drawRoundedRect(100, 0, mixAnimalBtnWidth, mixAnimalBtnHeight, 40);

        const animalMixText = new PIXI.Text('동물', textStyle);
        mixAnimalBtn.addChild(animalMixText);
        animalMixText.x = 130;
        animalMixText.y = 10;

        profileBox.addChild(mixAnimalBtn);

        // 건물
        const mixBuildingBtn = new PIXI.Graphics();
        mixBuildingBtn.beginFill(0xB6C1EA, 0.7);
        const mixBuildingBtnWidth = 100;
        const mixBuildingBtnHeight = 40;
        mixBuildingBtn.drawRoundedRect(210, 0, mixBuildingBtnWidth, mixBuildingBtnHeight, 40);

        const BuildingMixText = new PIXI.Text('건물', textStyle);
        mixBuildingBtn.addChild(BuildingMixText);
        BuildingMixText.x = 240;
        BuildingMixText.y = 10;

        profileBox.addChild(mixBuildingBtn);




        // ## 위에 등급 선택 메뉴
        const textData = ["노말", "레어", "슈퍼레어", "유니크", "레전드"];

        for (let i = 0; i < 5; i++) {
            const gradeBox = new PIXI.Graphics();
            gradeBox.beginFill(0xffffff, 0.5); // (채우기, 투명도)
            const boxWidth = canvasWidth * 0.15;
            const boxHeight = canvasHeight * 0.08;
            // x좌표 계산
            const xPosition = 80 + i * (boxWidth + 15)
            // x 좌표, y 좌표, 너비, 높이 및 둥근 모서리의 반지름
            gradeBox.drawRoundedRect(xPosition, 50, boxWidth, boxHeight, 40)
            profileBox.addChild(gradeBox);

            // 텍스트 생성 및 스타일 설정
            const labelText = new PIXI.Text(textData[i], {
                fontFamily: "Arial",
                fontSize: 20,
                fill: 0x000000,
            });

            // 텍스트 위치 설정 (가운데 정렬)
            labelText.x = xPosition + boxWidth / 2 - labelText.width / 2; // (네모의 가운데 - 텍스트 가운데) = 가운데 정렬
            labelText.y = 50 + boxHeight / 2 - labelText.height / 2;

            // 텍스트를 상자에 추가
            gradeBox.addChild(labelText);
        }


        //  ## 인벤토리
        const animalGroupBox = new PIXI.Graphics();
        animalGroupBox.beginFill(0xffffff, 0.5); // (채우기, 투명도)
        const boxWidth = canvasWidth * 0.4;
        const boxHeight = canvasHeight * 0.7;
        animalGroupBox.drawRoundedRect(80, 120, boxWidth, boxHeight, 35);
        profileBox.addChild(animalGroupBox);


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                const animalBox = new PIXI.Graphics();
                animalBox.beginFill(0xffffff, 0.5);
                const boxWidth = canvasWidth * 0.12;
                const boxHeight = canvasHeight * 0.21;
                // x좌표 계산
                const xPosition = 83 + i * (boxWidth + 15)
                // y좌표 계산
                const yPosition = 130 + j * (boxHeight + 15)
                // x 좌표, y 좌표, 너비, 높이 및 둥근 모서리의 반지름
                animalBox.drawRoundedRect(xPosition, yPosition, boxWidth, boxHeight, 40)
                profileBox.addChild(animalBox);


                // ## 인벤토리 안에 있는 동물
                // setAnimal()
                const animalList = animal;
                const countList = count;
                // 인벤토리 index
                const imageIndex = j * 3 + i;
                if (imageIndex < animal.length) {
                    // 이미지 텍스처 생성
                    const imgInventoryTexture = PIXI.Texture.from(animal[imageIndex]);
                }
                // 이미지 텍스처 생성
                if (imageIndex < animal.length) {
                    const imgInventoryTexture = PIXI.Texture.from(animalList[imageIndex]);

                    // 스프라이트 생성
                    const imgInventorySprite = new PIXI.Sprite(imgInventoryTexture);
                    // Count 텍스트 생성 및 스타일 설정
                    const countText = new PIXI.Text(countList[imageIndex], {
                        fontFamily: "Arial",
                        fontSize: 20,
                        fill: 0x000000,
                    });
                    imgInventorySprite.width = 80;
                    imgInventorySprite.height = 110;
                    imgInventorySprite.x = 120;
                    imgInventorySprite.y = 80;
                    profileBox.addChild(imgInventorySprite);

                    // image 가운데로 위치 조정
                    imgInventorySprite.x = xPosition + (boxWidth - imgInventorySprite.width) / 2;
                    imgInventorySprite.y = yPosition + (boxHeight - imgInventorySprite.height) / 2;

                    // Count 텍스트 위치 설정 (가운데 정렬)
                    countText.x = xPosition + (boxWidth - countText.width) / 2;
                    countText.y = yPosition + countText.height - 15; // 이미지 위에 표시하도록 설정
                    profileBox.addChild(countText);
                }
            }
        }


        // 항아리
        const mixPotTexture = PIXI.Texture.from(mixPot);
        const mixPotSprite = new PIXI.Sprite(mixPotTexture);
        mixPotSprite.width = canvasWidth * 0.4;
        mixPotSprite.height = canvasHeight * 0.7;
        mixPotSprite.x = 475;
        mixPotSprite.y = 130;
        profileBox.addChild(mixPotSprite);


        // 항아리 움직이기
        // const container = new PIXI.Container();
        // container.x = 670;
        // container.y = 350;
        // // add a bunch of sprites
        // const pot = PIXI.Sprite.from(mixPot);
        // pot.anchor.set(0.5);
        // container.addChild(pot);
        // app.stage.addChild(container);
        //
        // // let's create a moving shape
        // const thing = new PIXI.Graphics();
        // app.stage.addChild(thing);
        // thing.x = app.screen.width / 2;
        // thing.y = app.screen.height / 2;
        // thing.lineStyle(0);
        //
        // container.mask = null; // 'container'를 'thing'으로 마스킹
        //
        // let movingCount = 0;
        //
        // app.ticker.add(()=>{
        //     pot.scale.x = 1 + Math.sin(movingCount) * 0.04;
        //     pot.scale.y = 1 + Math.cos(movingCount) * 0.04;
        //     movingCount += 0.1;
        //     thing.clear();
        //     thing.moveTo(-120 + Math.sin(movingCount) * 20, -100 + Math.cos(movingCount) * 20);
        //     thing.lineTo(120 + Math.cos(movingCount) * 20, -100 + Math.sin(movingCount) * 20);
        //     thing.lineTo(120 + Math.sin(movingCount) * 20, 100 + Math.cos(movingCount) * 20);
        //     thing.lineTo(-120 + Math.cos(movingCount) * 20, 100 + Math.sin(movingCount) * 20);
        //     thing.rotation = movingCount * 0.1;
        // });





        // 합성하기 버튼
        const mixStartBtnWidth = 150;
        const mixStartBtnHeight = 40;
        const mixStartBtn = new ButtonContainer(
            new PIXI.Graphics()
            .beginFill(0x00ffff, 0.8)
            .drawRoundedRect(730, 590, mixStartBtnWidth, mixStartBtnHeight, 40))

        const mixStartText = new PIXI.Text('합성하기', textStyle);
        mixStartBtn.addChild(mixStartText);

        // 가운데 정렬을 위해 텍스트의 x, y 좌표를 조정
        mixStartText.x = 730 + (mixStartBtnWidth - mixStartText.width) / 2;
        mixStartText.y = 590 + (mixStartBtnHeight - mixStartText.height) / 2;
        // mixStartText.x = 730 + (mixStartBtnWidth - mixStartText.width) / 2;

        mixStartBtn.onPress.connect(() => {
            history.push("/mix2");
        });





        profileBox.addChild(mixStartBtn);

        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);





    return (
        <div ref={canvasRef} className="outlet-container">
        </div>
    );
};

export default Mix;