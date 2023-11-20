import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import mixPot from './imgs/MIXPOT 1.webp';
import mixBackground from './imgs/Rectangle 12348.webp';
import { useHistory } from 'react-router-use-history';
import { ButtonContainer, ScrollBox } from '@pixi/ui';
import axios from 'axios';

const MixPIXI = () => {
    const textStyle = new PIXI.TextStyle({
        fill: 0x0f1828,
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
    });
    const canvasWidth = 960;
    const canvasHeight = 640;
    const canvasRef = useRef(null);
    const [initialAnimal, setInitialAnimal] = useState([]);
    const [initialCount, setInitialCount] = useState([]);
    const [animal, setAnimal] = useState(initialAnimal);
    const [count, setCount] = useState(initialCount);

    // const [animal, setAnimal] = useState([pig, bird, fish, cat]);
    // const [count, setCount] = useState([1, 2, 3, 4]);

    // const [animal, setAnimal] = useState([]);
    // const [count, setCount] = useState([]);

    const history = useHistory();
    const grade = ['노말', '레어', '슈퍼레어', '유니크', '레전드'];
    const [entityType, setEntityType] = useState('ANIMAL');
    const [selectedGrade, setSelectedGrade] = useState('NORMAL');

    // const [imagePathArray, setImagePathArray] = useState([]);
    const getImagePathArray = async () => {
        const accessToken = localStorage.getItem('accessToken');

        const { data } = await axios.get('http://localhost:8000/api/v1/inventory/grade', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { grade: selectedGrade },
        });
        const paths = data.map((animal) => ({
            species: animal.animal.species.toLowerCase(),
            imagePath: animal.animal.imagePath,
            ownedQuantity: animal.ownedQuantity,
        }));
        return paths;
    };

    // 이미지 경로 지정(동물/건물)
    // const getObjectImagePath = (activeTab, category, item) => {
    //     if (activeTab === 'animals') {
    //         return `/objectImgs/animals/${category}/${item}`;
    //     } else if (activeTab === 'buildings') {
    //         return `/objectImgs/buildings/${category}/${item}`;
    //     }
    //     return '';
    // };

    // 이미지 경로 지정(동물)
    const getObjectImagePath = (category, item) => {
        return `/objectImgs/animals/${category}/${item}`;
    };

    const drawPixi = async (app) => {
        const imagePathArray = await getImagePathArray();

        const background = PIXI.Sprite.from(mixBackground); // 뒷 배경사진
        background.width = app.screen.width;
        background.height = app.screen.height;
        app.stage.addChild(background);

        const profileBox = new PIXI.Graphics(); // 큰 틀
        profileBox.beginFill(0xffffff, 0.5);
        profileBox.drawRoundedRect(62, 40, canvasWidth * 0.85, canvasHeight * 0.85, 40);
        app.stage.addChild(profileBox);

        const profileInnerBox = new PIXI.Graphics(); // 작은 틀
        // profileInnerBox.position.set(80, 120);
        profileInnerBox.beginFill(0xffffff, 0.5);
        profileBox.drawRoundedRect(80, 120, 377, 448, 40);

        // 등급 변환 함수
        const mapGrade = (koreanGrade) => {
            const gradeMap = {
                노말: 'NORMAL',
                레어: 'RARE',
                슈퍼레어: 'SUPERRARE',
                유니크: 'UNIQUE',
                레전드: 'LEGEND',
            };

            return gradeMap[koreanGrade] || koreanGrade; // 매핑되는 값이 없으면 그대로 반환
        };

        // 등급을 선택하면
        const handleGradeClick = (koreanGrade) => {
            const englishGrade = mapGrade(koreanGrade);
            setSelectedGrade(englishGrade);
            console.log(selectedGrade);
            // 등급을 영어로 값 리턴
        };

        // 동물/건물 EntityType 변환 함수
        // const mapEntityType= (koreanEntityType) => {
        //     const EntityTypeMap = {
        //         "동물": "ANIMAL",
        //         "건물": "BUILDING",
        //     };
        //
        //     return EntityTypeMap[koreanEntityType] || koreanEntityType; // 매핑되는 값이 없으면 그대로 반환
        // };

        // 선택된 한글 등급이 영어 등급로 변환
        // const handleGradeClick = (koreanGrade) => {
        //     setSelectedGrade(mapGrade(koreanGrade));
        //     console.log("mapGrade(koreanGrade) : " + selectedGrade);
        // }

        // 선택된 한글 EntityType이 영어 EntityType으로 변환
        // function handleEntityTypeClick(selectedEntityType) {
        //     setEntityType(mapEntityType(selectedEntityType));
        // }

        for (let i = 0; i < 5; i++) {
            // 등급 칸 & 텍스트
            const inventory = new PIXI.Graphics();
            inventory.beginFill(0xffffff, 0.5);
            inventory.drawRoundedRect(100 + i * 150, 50, 140, 55, 40);

            const gradeText = new PIXI.Text(grade[i], textStyle);
            inventory.addChild(gradeText);
            gradeText.anchor.set(0.5); // 글자 중심
            gradeText.x = 170 + i * 150; // X 위치 조정
            gradeText.y = 80; // Y 위치 조정
            profileBox.addChild(inventory);

            // 등급 버튼에 클릭 이벤트 추가
            inventory.interactive = true;
            inventory.on('pointertap', (event) => {
                // console.log(event)
                const clickedGrade = event.currentTarget.children[0].text; // 클릭된 버튼의 자식 중 첫 번째 자식인 gradeText의 텍스트
                handleGradeClick(clickedGrade);
            });
        }

        // 동물/건물 인벤토리
        // 동물
        const mixAnimalBtn = new PIXI.Graphics();
        mixAnimalBtn.beginFill(0x6afff6, 0.7);
        mixAnimalBtn.drawRoundedRect(100, 0, 100, 40, 40);
        const animalMixText = new PIXI.Text('동물', textStyle);

        // 동물 버튼에 클릭 이벤트 추가
        // mixAnimalBtn.on('pointertap', () => handleEntityTypeClick("ANIMAL"))

        mixAnimalBtn.addChild(animalMixText);
        animalMixText.x = 130;
        animalMixText.y = 10;
        profileBox.addChild(mixAnimalBtn);

        // 건물
        const mixBuildingBtn = new PIXI.Graphics();
        mixBuildingBtn.beginFill(0xb6c1ea, 0.7);
        mixBuildingBtn.drawRoundedRect(210, 0, 100, 40, 40);
        const BuildingMixText = new PIXI.Text('건물', textStyle);

        // 동물 버튼에 클릭 이벤트 추가
        // mixBuildingBtn.on('pointertap', () => handleEntityTypeClick("BUILDING"))

        mixBuildingBtn.addChild(BuildingMixText);
        BuildingMixText.x = 240;
        BuildingMixText.y = 10;
        profileBox.addChild(mixBuildingBtn);

        // Feat : 항아리
        const mixPotTexture = PIXI.Texture.from(mixPot);
        const mixPotSprite = new PIXI.Sprite(mixPotTexture);
        mixPotSprite.width = canvasWidth * 0.4;
        mixPotSprite.height = canvasHeight * 0.7;
        mixPotSprite.x = 475;
        mixPotSprite.y = 130;
        profileBox.addChild(mixPotSprite);

        const boxes = makeBox(imagePathArray, mixPotSprite, profileBox);

        const scrollBox = new ScrollBox({
            width: 377,
            height: 448,
            radius: 40,
            items: boxes,
            elementsMargin: 15,
            vertPadding: 15,
            horPadding: 15,
            wheel: true, // 휠 스크롤 활성화
            wheelScroll: true, // 휠 이벤트에 의한 스크롤 활성화
        });
        scrollBox.x = 80; // x 좌표
        scrollBox.y = 120; // y 좌표
        profileBox.addChild(scrollBox);

        // Feat 합성하기 버튼
        const mixStartBtn = new ButtonContainer(
            new PIXI.Graphics().beginFill(0x00ffff, 0.8).drawRoundedRect(720, 590, 150, 40, 40)
        );
        const mixStartText = new PIXI.Text('합성하기', textStyle);
        mixStartBtn.addChild(mixStartText);

        // 가운데 정렬을 위해 텍스트의 x, y 좌표를 조정
        mixStartText.x = 760;
        mixStartText.y = 600;
        mixStartBtn.onPress.connect(() => {
            history.push('/mix2');
        });
        background.addChild(mixStartBtn); // profileBox.addChild(mixStartBtn);이었는데  profileBox.removeChild(lastAddedAnimal);항아리 클릭하면 제거하는 함수와 profileBox가 겹쳐서 그런지 합성하기 버튼도 삭제되길래 -> background로 바꿈..
        // Cleanup on component unmount
    };

    const makeBox = (imagePathArray, mixPotSprite, profileBox) => {
        const boxWidth = 105;
        const boxHeight = 122;
        const boxesPerRow = 3;
        const padding = 10;

        const potArr = [];
        let clickNum = 0;

        const boxes = imagePathArray.map((animalImg, i) => {
            const box = new PIXI.Graphics();
            box.beginFill(0xffffff, 0.5);
            box.drawRoundedRect(0, 0, boxWidth, boxHeight, 40);
            box.endFill();

            // Calculate position based on the index and number of boxes per row
            const row = Math.floor(i / boxesPerRow);
            const col = i % boxesPerRow;

            box.x = col * (boxWidth + padding);
            box.y = row * (boxHeight + padding);

            // 인벤토리 칸의 가운데로 위치 조정
            const inventoryWidth = 105; // 인벤토리 칸의 가로 크기
            const inventoryHeight = 122; // 인벤토리 칸의 세로 크기
            const xPosition = 0; // 인벤토리 칸의 x 위치
            const yPosition = 0; // 인벤토리 칸의 y 위치

            // Feat : image 생성..
            const objectImagePath = getObjectImagePath(animalImg.species, animalImg.imagePath);
            // initialAnimal(objectImagePath);
            setInitialAnimal((prev) => [...prev, objectImagePath]); // 이미지 경로 배열에 추가
            const imgInventoryTexture = PIXI.Texture.from(objectImagePath);
            const imgInventorySprite = new PIXI.Sprite(imgInventoryTexture);

            imgInventorySprite.width = 69;
            imgInventorySprite.height = 99;

            // image 가운데로 위치 조정
            imgInventorySprite.x = xPosition + (inventoryWidth - imgInventorySprite.width) / 2;
            imgInventorySprite.y = yPosition + (inventoryHeight - imgInventorySprite.height) / 2;

            box.addChild(imgInventorySprite);

            // count 생성..
            let countValue = animalImg.ownedQuantity;
            setInitialCount((prev) => [...prev, countValue]);
            let countText = new PIXI.Text(countValue, textStyle);

            // Count 텍스트 위치 설정 (가운데 정렬 및 동물 이미지 머리 바로 위에 표시)
            countText.x = xPosition + (inventoryWidth - countText.width) / 2;
            countText.y = yPosition - countText.height + 25; // 동물 이미지 머리 바로 위에 표시
            box.addChild(countText);

            //profileBox.addChild(box);

            // 이벤트 감지 설정
            box.interactive = true;

            const clickEventFunction = (e) => {
                // TODO 없애기
                if (clickNum > 3) {
                    // 항아리 4개가 선택됐으면 인벤토리의 count가 -1이 되면 안됨.. 그래서 clickNum가 맨 위에 있는 거임
                    return;
                }
                // TODO count로만.. newCount 없애기
                // TODO i를 사용해서..       count[i] 이부분의 값을 사용하고 변경하고.. 값이 0이면 사용 X
                //  count는 0보다 작으면 눌리면 안됨
                // TODO 항아리에 4개가 들어가 있는지 길이를 확인해서 -> poxBox를 만들어서 선택한거 넣어야 할 듯..

                console.log(setInitialCount);
                setCount((count) => {
                    // setCount(prevCount=>{prevCount}) 무조건 이전 count를 가져오겠다.
                    const newCount = [...count]; // TODO 리스트에서 뺴기

                    if (newCount[i] > 0) {
                        newCount[i] -= 1;
                        countText.text = newCount[i];
                        console.log(newCount);

                        if (newCount[i] === 0) {
                            box.off('click', clickEventFunction);

                            const zeroOverlay = new PIXI.Graphics();
                            zeroOverlay.beginFill(0xffffff, 0.5);
                            zeroOverlay.drawRoundedRect(xPosition, yPosition, boxWidth, boxHeight, 40);
                            zeroOverlay.endFill();
                            box.addChild(zeroOverlay);

                            mixPotSprite.on('pointertap', () => {
                                // 항아리 클릭하면 인벤토리에 표시된 count 0인 것 불투명한 처리 없앰..
                                box.removeChild(zeroOverlay);
                            });
                        }
                    }
                    return newCount;
                });

                // image 생성..
                // 클릭된 동물의 이미지를 새로 로드하고 새로운 스프라이트를 만듭니다.
                const selectedAnimalTexture = PIXI.Texture.from(objectImagePath);
                const selectedAnimalSprite = new PIXI.Sprite(selectedAnimalTexture);

                // 이미지 크기를 100x100으로 변경
                selectedAnimalSprite.width = 45;
                selectedAnimalSprite.height = 78;

                let startPoint = mixPotSprite.x + (mixPotSprite.width - selectedAnimalSprite.width) / 2 - 105;
                if (clickNum > 0) {
                    selectedAnimalSprite.x = startPoint + 73 * clickNum; // 1~3부터는 x축 옆으로 이동(가로 나열)
                } else {
                    selectedAnimalSprite.x = startPoint; // 0이면
                }

                selectedAnimalSprite.y = mixPotSprite.y + (mixPotSprite.height - selectedAnimalSprite.height) / 2 + 60;
                clickNum++;

                // 이미 추가된 경우에는 삭제 후 다시 추가
                if (profileBox.children.includes(selectedAnimalSprite)) {
                    profileBox.removeChild(selectedAnimalSprite);
                }

                profileBox.addChild(selectedAnimalSprite);
                // TODO: 항아리에 이미지가 제곱으로 늘어남..
                // profileBox.addChild(selectedAnimalSprite);

                // Feat : 항아리에서 동물을 클릭하면
                mixPotSprite.interactive = true; //  mixPotSprite 객체를 상호작용, 클릭 이벤트를 감지

                mixPotSprite.on('pointertap', () => {
                    // 항아리 (mixPotSprite)를 클릭할 때
                    // setAnimal(initialAnimal);
                    // setCount(initialCount);
                    console.log(i);
                    countText.text = count[i]; // 초기 count값으로 다시 반영

                    clickNum = 0;
                    console.log('-----------------------삭제 전 : ' + selectedAnimalSprite);
                    profileBox.removeChild(selectedAnimalSprite);
                    console.log('-----------------------삭제 후 : ' + selectedAnimalSprite);

                    // 항아리 클릭 이벤트 핸들러를 다시 등록
                    box.on('click', clickEventFunction);
                });
                console.log('--------------------------------------');
            };

            box.on('click', clickEventFunction);

            return box;
        });
        return boxes;
    };

    useEffect(() => {
        const app = new PIXI.Application({
            background: '#1099BB',
            width: canvasWidth,
            height: canvasHeight,
        });

        if (canvasRef.current) {
            canvasRef.current.appendChild(app.view);
        }

        drawPixi(app); // app 인스턴스를 drawPixi 함수에 전달

        return () => {
            app.destroy(); // 컴포넌트 언마운트 시 app 인스턴스 제거
        };
    }, []); // 의존성 배열을 빈 배열로 설정

    useEffect(() => {
        if (canvasRef.current && canvasRef.current.children[0]) {
            const app = canvasRef.current.children[0].__pixiApp;
            if (app) {
                drawPixi(app); // 기존 app 인스턴스를 재사용하여 drawPixi 함수 호출
            }
        }
    }, [selectedGrade]); // selectedGrade 변경 시 실행

    return <div ref={canvasRef} className="outlet-container"></div>;
};
export default MixPIXI;
