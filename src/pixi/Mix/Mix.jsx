import {useEffect, useRef, useState} from "react";
import * as PIXI from 'pixi.js';
import pig from './imgs/PIG 5.png'
import bird from './imgs/Bird.png'
import cat from './imgs/Cat.png'
import dog from './imgs/Dog.png'
import fish from './imgs/Fish.png'
import mixPot from './imgs/MIXPOT 1.png'
import mixBackground from './imgs/Rectangle 12348.png'
import {useHistory} from 'react-router-use-history';
import {ButtonContainer, ScrollBox} from "@pixi/ui";

const Mix = () => {
    const canvasRef = useRef(null);
    const [animal, setAnimal] = useState([pig, bird, fish, cat]);
    const [count, setCount] = useState([12, 5, 30, 7]);
    const [potAnimals, setPotAnimals] = useState([]);
    const [xValue, setXvalue] = useState(0);
    const history = useHistory();
    const grade = ["노말", "레어", "슈퍼레어", "유니크", "레전드"];


    useEffect(() => {
        const canvasWidth = 960;
        const canvasHeight = 640;

        // 글꼴
        const textStyle = new PIXI.TextStyle({
            fill: 0x0f1828,
            fontSize: 18,
            fontFamily: 'Arial',
            fontWeight: "bold",
        });

        const app = new PIXI.Application({
            background: '#1099bb',
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        const background = PIXI.Sprite.from(mixBackground); // 뒷 배경사진
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        const profileWidth = canvasWidth * 0.85;
        const profileHeight = canvasHeight * 0.85;
        profileBox.drawRoundedRect(62, 40, profileWidth, profileHeight, 40);
        app.stage.addChild(profileBox);



        const profileInnerBox = new PIXI.Graphics(); // 작은 틀

        profileInnerBox.position.set(80, 120);



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

        let testArr = [];

        let clickNum = 0;

        // 인벤토리
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < Math.round(animal.length / 3); j++) {


                // 인벤토리
                const inventoryBtn = new ButtonContainer(
                    new PIXI.Graphics()
                        .beginFill(0xffffff, 0.5)
                        .drawRoundedRect(10, 0, 105, 122, 40)
                        // .drawRoundedRect(95 + (i * 120), 150 + (j * 135), 105, 122, 40)
                );

                testArr.push(inventoryBtn)
                profileBox.addChild(inventoryBtn)

                // 인벤토리 index
                const imageIndex = j * 3 + i;

                // 이미지 텍스처 생성
                if (imageIndex < animal.length) {
                    const imgInventoryTexture = PIXI.Texture.from(animal[imageIndex]);

                    // 스프라이트 생성
                    const imgInventorySprite = new PIXI.Sprite(imgInventoryTexture);

                    // Count 텍스트 생성 및 스타일 설정
                    const countText = new PIXI.Text(count[imageIndex], textStyle);

                    imgInventorySprite.width = 69;
                    imgInventorySprite.height = 99;

                    // 인벤토리 칸의 가운데로 위치 조정
                    const inventoryWidth = 105; // 인벤토리 칸의 가로 크기
                    const inventoryHeight = 122; // 인벤토리 칸의 세로 크기
                    // const xPosition = 95 + (i * 120); // 인벤토리 칸의 x 위치
                    // const yPosition = 150 + (j * 135); // 인벤토리 칸의 y 위치

                    const xPosition = 10; // 인벤토리 칸의 x 위치
                    const yPosition = 0; // 인벤토리 칸의 y 위치

                    // image 가운데로 위치 조정
                    imgInventorySprite.x = xPosition + (inventoryWidth - imgInventorySprite.width) / 2;
                    imgInventorySprite.y = yPosition + (inventoryHeight - imgInventorySprite.height) / 2;

                    // Count 텍스트 위치 설정 (가운데 정렬 및 동물 이미지 머리 바로 위에 표시)
                    countText.x = xPosition + (inventoryWidth - countText.width) / 2;
                    countText.y = yPosition - countText.height + 25; // 동물 이미지 머리 바로 위에 표시


                    inventoryBtn.addChild(imgInventorySprite); // inventoryBtn에 스프라이트 추가
                    inventoryBtn.addChild(countText);

                    // 인벤토리 안에 클릭하면
                    inventoryBtn.onPress.connect(() => {
                        if (clickNum > 3) {
                            return;
                        }
                        const maxPotAnimals = 4; // 항아리에 추가할 수 있는 최대 동물 수

                        if (potAnimals.length < maxPotAnimals) {

                            // 클릭된 동물의 이미지를 새로 로드하고 새로운 스프라이트를 만듭니다.
                            const selectedAnimalTexture = PIXI.Texture.from(animal[imageIndex]);
                            const selectedAnimalSprite = new PIXI.Sprite(selectedAnimalTexture);

                            // 이미지 크기를 100x100으로 변경
                            selectedAnimalSprite.width = 45;
                            selectedAnimalSprite.height = 78;

                            // 이미지를 항아리에 추가
                            // setXvalue(mixPotSprite.x + (mixPotSprite.width - selectedAnimalSprite.width) / 2 - 105);

                            // selectedAnimalSprite.x = mixPotSprite.x + (mixPotSprite.width - selectedAnimalSprite.width) / 2 - 105;
                            let startPoint = mixPotSprite.x + (mixPotSprite.width - selectedAnimalSprite.width) / 2 - 105;


                            if (clickNum > 0) {
                                selectedAnimalSprite.x = startPoint + (73 * clickNum); // 1~3부터는 x축 옆으로 이동(가로 나열)
                            } else {
                                selectedAnimalSprite.x = startPoint; // 0이면
                            }

                            selectedAnimalSprite.y = mixPotSprite.y + (mixPotSprite.height - selectedAnimalSprite.height) /2 + 60;
                            clickNum++;


                            // 이미지를 항아리에 추가하고 x 좌표를 조절하여 가로로 나열
                            // const spacing = 10; // 이미지 간의 간격
                            // const xOffset = mixPotSprite.x + (mixPotSprite.width - selectedAnimalSprite.width) / 2 - 105;
                            // const yOffset = mixPotSprite.y + (mixPotSprite.height - selectedAnimalSprite.height) / 2 + 55;

                            profileBox.addChild(selectedAnimalSprite);



                            // Feat : 클릭 시 count -1
                            // "count" 배열을 복제하여 업데이트할 값을 변경한 다음 상태 업데이트
                            const updatedCount = [...count];
                            updatedCount[imageIndex]--;
                            setCount(updatedCount);

                            // "countText" 업데이트
                            countText.text = updatedCount[imageIndex];





                            // TODO 항아리에 들어가는 합성동물 배열로 변환 필요
                            // 항아리 동물 목록에 추가
                            // setPotAnimals([...potAnimals, selectedAnimalSprite]);

                            setPotAnimals(prevState =>  {
                                return [...prevState, 1];
                            })

                            // 항아리에서 동물을 클릭하면
                            mixPotSprite.interactive = true; //  mixPotSprite 객체를 상호작용, 클릭 이벤트를 감지
                            mixPotSprite.on('pointertap', () => { // 항아리 (mixPotSprite)를 클릭할 때


                            // 항아리에서 마지막으로 추가된 동물을 제거
                            clickNum = 0;
                            profileBox.removeChild(selectedAnimalSprite);


                                // const lastAddedAnimal = profileBox.children[profileBox.children.length - 1]; // 항아리에 마지막으로 추가된 동물
                                // if (lastAddedAnimal !== mixPotSprite) {
                                //     profileBox.removeChild(lastAddedAnimal); // 4번 초과해서 클릭 했을 때, 4번째 mixPotSprite와 다를 경우에는 삭제
                                // }


                            });
                        }
                    });
                }
            }
        }



        // Feat : inventory scroll
        console.log(testArr)
        const scrollBox = new ScrollBox({
            width: 377,
            height: 448,
            radius : 40,
            items: testArr,
            elementsMargin : 10,
            vertPadding : 20,
            horPadding : 10
        });

        scrollBox.x = 80; // x 좌표
        scrollBox.y = 120; // y 좌표

        profileBox.addChild(scrollBox);

        // Feat : 항아리
        const mixPotTexture = PIXI.Texture.from(mixPot);
        const mixPotSprite = new PIXI.Sprite(mixPotTexture);
        mixPotSprite.width = canvasWidth * 0.4;
        mixPotSprite.height = canvasHeight * 0.7;
        mixPotSprite.x = 475;
        mixPotSprite.y = 130;
        profileBox.addChild(mixPotSprite);


        // Feat 합성하기 버튼
        const mixStartBtn = new ButtonContainer(
            new PIXI.Graphics()
                .beginFill(0x00ffff, 0.8)
                .drawRoundedRect(720, 590, 150, 40, 40))

        const mixStartText = new PIXI.Text('합성하기', textStyle);
        mixStartBtn.addChild(mixStartText);

        // 가운데 정렬을 위해 텍스트의 x, y 좌표를 조정
        mixStartText.x = 760
        mixStartText.y = 600

        mixStartBtn.onPress.connect(() => {
            history.push("/mix2");
        });

        background.addChild(mixStartBtn); // profileBox.addChild(mixStartBtn);이었는데  profileBox.removeChild(lastAddedAnimal);항아리 클릭하면 제거하는 함수와 profileBox가 겹쳐서 그런지 합성하기 버튼도 삭제되길래 -> background로 바꿈..














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