import {useEffect, useRef, useState} from "react";
import * as PIXI from 'pixi.js';
import pig from './imgs/PIG 5.png'
import bird from './imgs/Bird.png'
import cat from './imgs/Cat.png'
import dog from './imgs/Dog.png'
import fish from './imgs/Fish.png'
import mixPot from './imgs/MIXPOT 1.png'
import mixBackground from './imgs/Rectangle 12348.png'


const Mix = () => {

    const canvasRef = useRef(null);
    const [animal, setAnimal] = useState([pig, bird, cat, dog, fish, pig, bird, cat, dog, fish, pig, bird, cat, dog, fish]);
    const [count, setCount] = useState([0, 2, 5, 8, 13, 0, 2, 5, 8, 13, 0, 2, 5, 8, 13]);
    const [scrollOffset, setScrollOffset] = useState(0);
    const itemsPerPage = 9;
    const scrollableContainerRef = useRef(null);

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

        // 인벤토리 컨테이너
        const scrollableContainer = new PIXI.Container();
        animalGroupBox.addChild(scrollableContainer);

        // animalGroupBox에 스크롤 이벤트 핸들러 연결
        animalGroupBox.interactive = true;

        const handleScroll = (event) => {
            const container = scrollableContainerRef.current;
            if (container) {
                container.y = -event.target.scrollTop;
            }
        };

        animalGroupBox.on("scroll", handleScroll);


        // // 스크롤 가능한 컨테이너를 ref에 연결
        // scrollableContainerRef.current = scrollableContainer;




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





        app.stage.addChild(profileBox);



        // Cleanup on component unmount
        return () => {
            app.destroy();
        };
    }, []);





    return (
        <div ref={canvasRef} className="outlet-container">
            {/* 스크롤 가능한 컨테이너를 만들고 스크롤 이벤트를 처리합니다. */}
            <div
                // npm install react-pixi-fiber :  @inlet/react-pixi 라이브러리를 사용하여 PixiJS를 React와 통합하고 스크롤 이벤트 처리를 훨씬 쉽게 구현
                // 스크롤 이벤트를 제대로 처리할 수 있어야 합니다. 이렇게 수정하면 onScroll 이벤트가 제대로 작동해야 합니다.
                // onScroll={handleScroll}
                style={{
                    width: '100%',
                    height: '600px', // 원하는 높이 설정
                    overflow: 'scroll',
                }}
            >
                <div style={{ height: '100%' }}>{/* 실제 스크롤 가능한 내용 */}</div>
            </div>
        </div>
    );
};

export default Mix;