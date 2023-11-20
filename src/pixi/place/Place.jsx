import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import { api } from '../../network/api';
import landTileImagePath from './imgs/LandTile.webp';
import seaTileImagePath from './imgs/SeaTile.webp';
import mountainTileImagePath from './imgs/MountainTile.webp';
import prevButtonImagePath from './imgs/PrevButton.webp';
import nextButtonImagePath from './imgs/NextButton.webp';
import AllButtonImage from './imgs/AllButton.webp';
import NormalButtonImage from './imgs/NormalButton.webp';
import RareButtonImage from './imgs/RareButton.webp';
import SuperrareButtonImage from './imgs/SuperrareButton.webp';
import UniqueButtonImage from './imgs/UniqueButton.webp';
import LegendButtonImage from './imgs/LegendButton.webp';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);
    const [placedItems, setPlacedItems] = useState([]);
    const [activeTab, setActiveTab] = useState('animals');
    const [inventory, setInventory] = useState({ buildings: [], animals: [] });
    const [tileData, setTileData] = useState([]);
    const [textures, setTextures] = useState({});
    const [selectedGrade, setSelectedGrade] = useState('ALL'); // 추가: 선택된 등급
    const [draggingItem, setDraggingItem] = useState(null); // 드래그 중인 아이템 상태 추가
    const [startIndex, setStartIndex] = useState(0);
    const appRef = useRef(null);
    const animalTabBox = useRef(null);
    const buildingTabBox = useRef(null);
    const itemsPerPage = 4;

    const handleSavePlacement = useCallback(async () => {
        try {
            const payload = placedItems.map((item) => ({
                tileId: item.tileId,
                objectId: item.objectId,
                objectType: item.objectType,
            }));
            const accessToken = localStorage.getItem('accessToken');

            await api(`/api/v1/terrain/placeItems`, 'POST', {
                headers: { Authorization: `Bearer ${accessToken}` },
                data: payload,
            });

            alert('아이템이 성공적으로 배치되었습니다.');
        } catch (error) {
            console.error('Failed to save item placement:', error);
        }
    }, [placedItems]);

    const handleGradeButtonClick = (grade) => {
        let englishGrade;
        switch (grade) {
            case '노말':
                englishGrade = 'NORMAL';
                break;
            case '레어':
                englishGrade = 'RARE';
                break;
            case '슈퍼레어':
                englishGrade = 'SUPERRARE';
                break;
            case '유니크':
                englishGrade = 'UNIQUE';
                break;
            case '레전드':
                englishGrade = 'LEGEND';
                break;
            default:
                englishGrade = 'ALL';
        }
        setSelectedGrade(englishGrade);
    };

    const clearInventoryDisplay = () => {
        if (appRef.current) {
            const childrenToRemove = appRef.current.stage.children.filter((child) => child.isInventoryItem);
            childrenToRemove.forEach((child) => appRef.current.stage.removeChild(child));
        }
    };

    const handleTabSelect = useCallback(
        (tab) => {
            clearInventoryDisplay();
            setActiveTab(tab);
            fetchInventory(tab);
            if (animalTabBox.current && buildingTabBox.current) {
                updateTabStyle(tab);
            }
        },
        [animalTabBox, buildingTabBox]
    );

    const updateTabStyle = (selectedTab) => {
        animalTabBox.current.clear();
        animalTabBox.current.beginFill(selectedTab === 'animals' ? 0xffc0cb : 0xffffff, 0.85);
        animalTabBox.current.lineStyle(selectedTab === 'animals' ? 1 : 0, 0x000000);
        animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);

        buildingTabBox.current.clear();
        buildingTabBox.current.beginFill(selectedTab === 'buildings' ? 0xffc0cb : 0xffffff, 0.85);
        buildingTabBox.current.lineStyle(selectedTab === 'buildings' ? 1 : 0, 0x000000);
        buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
    };

    const fetchInventory = async (type) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api(`/api/v1/inventory/${type}`, 'GET', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setInventory((prev) => ({ ...prev, [type]: response.data }));
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchTileData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await api('/api/v1/terrain/myTile', 'GET', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setTileData(response.data);
        } catch (error) {
            console.error('Error fetching tile data:', error);
        }
    };

    const loadTextures = useCallback(async () => {
        const texturePaths = { LAND: landTileImagePath, SEA: seaTileImagePath, MOUNTAIN: mountainTileImagePath };
        const loadedTextures = {};

        for (const [key, path] of Object.entries(texturePaths)) {
            loadedTextures[key] = PIXI.Texture.from(path);
        }

        setTextures(loadedTextures);
    }, []);

    const getObjectImagePath = useCallback(
        (item) => {
            if (activeTab === 'animals') {
                return `/objectImgs/animals/${item.animal.species.toLowerCase()}/${item.animal.imagePath}`;
            } else if (activeTab === 'buildings') {
                return `/objectImgs/buildings/${item.building.imagePath}`;
            }
            return '';
        },
        [activeTab]
    );

    // 인벤토리 아이템의 수량을 업데이트하는 함수
    const updateInventoryItemQuantity = useCallback((item) => {
        setInventory((prevInventory) => {
            const updatedItems = prevInventory[item.type].map((invItem) => {
                if (invItem.id === item.id) {
                    return { ...invItem, quantity: invItem.quantity - 1 };
                }
                return invItem;
            });
            return { ...prevInventory, [item.type]: updatedItems };
        });
    }, []);

    const getDroppedTile = useCallback(
        (x, y) => {
            // x, y 좌표를 사용하여 타일 찾기
            // tileData 배열에서 가장 가까운 타일을 찾습니다.
            let closestTile = null;
            let minDistance = Infinity;

            tileData.forEach((tile) => {
                const dx = x - tile.x;
                const dy = y - tile.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    closestTile = tile;
                    minDistance = distance;
                }
            });

            return closestTile;
        },
        [tileData]
    );

    // 드래그 시작 함수
    const onDragStart = useCallback((item, event) => {
        const draggableImage = new PIXI.Sprite(
            PIXI.Texture.from(`/objectImgs/animals/${item.animal.species.toLowerCase()}/${item.animal.imagePath}`)
        );
        draggableImage.anchor.set(0.5);
        draggableImage.x = event.data.global.x;
        draggableImage.y = event.data.global.y;
        draggableImage.zIndex = 10; // z-index 설정
        appRef.current.stage.addChild(draggableImage);

        setDraggingItem({
            ...item,
            image: draggableImage,
            offsetX: event.data.global.x - draggableImage.x,
            offsetY: event.data.global.y - draggableImage.y,
            dragging: true,
        });
    }, []);

    // 드래그 중 위치 업데이트 함수
    const onDragMove = useCallback(
        (event) => {
            if (draggingItem && draggingItem.dragging) {
                const newPosition = event.data.global;
                draggingItem.image.x = newPosition.x - draggingItem.offsetX;
                draggingItem.image.y = newPosition.y - draggingItem.offsetY;
            }
        },
        [draggingItem]
    );

    // 드래그 종료 함수
    const onDragEnd = useCallback(() => {
        console.log('Drag End - Event Triggered');
        if (draggingItem && draggingItem.dragging) {
            const droppedTile = getDroppedTile(draggingItem.image.x, draggingItem.image.y);
            if (droppedTile) {
                setPlacedItems((prevItems) => [...prevItems, { ...draggingItem, tileId: droppedTile.id }]);
                updateInventoryItemQuantity(draggingItem);
            }
            appRef.current.stage.removeChild(draggingItem.image);
            setDraggingItem(null);
        }
    }, [draggingItem, getDroppedTile, setPlacedItems, updateInventoryItemQuantity, appRef]);

    useEffect(() => {
        fetchInventory('animals');
        loadTextures();
        fetchTileData();
    }, [loadTextures]);

    useEffect(() => {
        if (Object.keys(textures).length === 3 && tileData.length > 0) {
            if (!appRef.current) {
                const app = new PIXI.Application({
                    width: 960,
                    height: 640,
                    backgroundColor: 0x1099bb,
                    antialias: true,
                });
                pixiContainer.current.appendChild(app.view);
                appRef.current = app;
                const container = new PIXI.Container();
                app.stage.addChild(container);
                app.stage.sortableChildren = true;
                const tileSize = {
                    width: textures.LAND.width,
                    height: textures.LAND.height,
                };

                if (tileSize.width === 0 || tileSize.height === 0) {
                    console.error('Tile size is zero. Textures may not have loaded properly.');
                    return;
                }

                if (tileData.length > 0 && Object.keys(textures).length === 3) {
                    createTile(tileData, container, textures, tileSize);
                }

                container.interactive = true;
                container.buttonMode = true;
                container.scale.set(0.5);
                container.position.set(app.screen.width / 2, app.screen.height / 2);

                let startPosition = null;

                const ListContainer = new PIXI.Graphics();
                ListContainer.beginFill(0xffffff, 0.8);
                ListContainer.drawRoundedRect(0, 70, 400, 500, 20);
                ListContainer.x = app.screen.width - 300;
                ListContainer.y = 0;
                app.stage.addChild(ListContainer);

                animalTabBox.current = new PIXI.Graphics();
                animalTabBox.current.beginFill(0xffffff, 0.8);
                animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);
                animalTabBox.current.interactive = true;
                animalTabBox.current.buttonMode = true;
                const animalText = new PIXI.Text('동물', { fill: 0x000000, fontSize: 24 });
                animalText.x = 710;
                animalText.y = 35;
                animalTabBox.current.addChild(animalText);
                animalTabBox.current.on('pointerdown', () => handleTabSelect('animals'));
                app.stage.addChild(animalTabBox.current);

                buildingTabBox.current = new PIXI.Graphics();
                buildingTabBox.current.beginFill(0xffffff, 0.8);
                buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
                buildingTabBox.current.interactive = true;
                buildingTabBox.current.buttonMode = true;
                const buildingText = new PIXI.Text('건물', { fill: 0x000000, fontSize: 24 });
                buildingText.x = 860;
                buildingText.y = 35;
                buildingTabBox.current.addChild(buildingText);
                buildingTabBox.current.on('pointerdown', () => handleTabSelect('buildings'));
                app.stage.addChild(buildingTabBox.current);

                updateTabStyle(activeTab);

                container
                    .on('pointerdown', (event) => {
                        if (draggingItem) {
                            return; // 드래그 중인 아이템이 있으면 여기서 함수 종료
                        }
                        startPosition = event.data.getLocalPosition(container.parent);
                        container.alpha = 0.5;
                    })
                    .on('pointerup', () => {
                        startPosition = null;
                        container.alpha = 1;
                    })
                    .on('pointermove', (event) => {
                        if (draggingItem) {
                            return; // 드래그 중인 아이템이 있으면 여기서 함수 종료
                        }

                        // 드래그 중인 아이템이 없을 때만 실행되는 로직
                        if (startPosition) {
                            const newPosition = event.data.getLocalPosition(container.parent);
                            container.x += newPosition.x - startPosition.x;
                            container.y += newPosition.y - startPosition.y;
                            startPosition = newPosition;
                        }
                    });

                app.view.addEventListener('wheel', (event) => {
                    event.preventDefault();
                    const direction = event.deltaY > 0 ? -1 : 1;
                    const factor = 0.05;
                    const newScale = container.scale.x + factor * direction;
                    container.scale.set(newScale, newScale);
                });
            }
        }
    }, [textures, tileData, activeTab, handleTabSelect, draggingItem]);

    useEffect(() => {
        if (appRef.current) {
            const saveButton = new PIXI.Graphics();
            saveButton.beginFill(0x0e84d1); // 버튼 색상 설정
            saveButton.drawRect(0, 0, 100, 50); // 버튼 크기 및 위치 설정
            saveButton.endFill();
            saveButton.x = 600; // X 좌표
            saveButton.y = 600; // Y 좌표
            saveButton.interactive = true;
            saveButton.buttonMode = true;

            const buttonText = new PIXI.Text('저장하기', { fill: 0xffffff });
            buttonText.x = 10; // 텍스트 위치 조정
            buttonText.y = 10;
            saveButton.addChild(buttonText);

            saveButton.on('pointerdown', handleSavePlacement);

            appRef.current.stage.addChild(saveButton);
        }
    }, [appRef, handleSavePlacement]);

    useEffect(() => {
        if (appRef.current && activeTab) {
            // 기존 아이템 삭제
            clearInventoryDisplay();

            const handlePrevButtonClick = () => {
                const newStartIndex = Math.max(startIndex - itemsPerPage, 0);
                setStartIndex(newStartIndex);
            };

            const handleNextButtonClick = () => {
                const selectedInventory = inventory[activeTab];
                if (startIndex + itemsPerPage < selectedInventory.length) {
                    const newStartIndex = startIndex + itemsPerPage;
                    setStartIndex(newStartIndex);
                }
            };

            const createPrevButton = () => {
                const texture = PIXI.Texture.from(prevButtonImagePath);
                const button = new PIXI.Sprite(texture);
                button.interactive = true;
                button.buttonMode = true;
                button.x = 675;
                button.y = 465;
                button.scale.set(0.25);
                button.on('pointerdown', handlePrevButtonClick);
                button.name = 'prevButton'; // Assign a name to the button for identification
                return button;
            };

            const createNextButton = () => {
                const texture = PIXI.Texture.from(nextButtonImagePath);
                const button = new PIXI.Sprite(texture);
                button.interactive = true;
                button.buttonMode = true;
                button.x = 830;
                button.y = 465;
                button.scale.set(0.25);
                button.on('pointerdown', handleNextButtonClick);
                button.name = 'nextButton'; // Assign a name to the button for identification
                return button;
            };

            let prevButton = appRef.current.stage.getChildByName('prevButton');
            if (!prevButton) {
                prevButton = createPrevButton();
                appRef.current.stage.addChild(prevButton);
            } else {
                // If button already exists, just update the event listener
                prevButton.off('pointerdown').on('pointerdown', handlePrevButtonClick);
            }

            let nextButton = appRef.current.stage.getChildByName('nextButton');
            if (!nextButton) {
                nextButton = createNextButton();
                appRef.current.stage.addChild(nextButton);
            } else {
                // If button already exists, just update the event listener
                nextButton.off('pointerdown').on('pointerdown', handleNextButtonClick);
            }

            let initialX = 670;
            let initialY = 90;
            const yOffset = 95;
            const selectedInventory = inventory[activeTab];

            const filteredItems = selectedInventory.filter((item) => {
                if (selectedGrade === 'ALL') {
                    return true; // 모든 등급 표시
                } else {
                    return item.animal.grade === selectedGrade; // 선택한 등급만 표시
                }
            });

            const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);

            for (let index = startIndex; index < endIndex; index++) {
                const item = filteredItems[index];
                const listBox = new Graphics();
                listBox.isInventoryItem = true;
                listBox.beginFill(0xffffff, 1);
                listBox.drawRoundedRect(initialX, initialY + (index - startIndex) * yOffset, 280, 80, 15);
                listBox.interactive = true;
                listBox.buttonMode = true;

                const objectImagePath = getObjectImagePath(item);
                let nameTextContent, quantityTextContent;
                if (activeTab === 'animals') {
                    nameTextContent = `${item.animal.name} (강화: ${item.upgrade})`;
                    quantityTextContent = `수량: ${item.ownedQuantity}`;
                } else if (activeTab === 'buildings') {
                    nameTextContent = `${item.building.name}`;
                    quantityTextContent = `수량: ${item.ownedQuantity}`;
                }

                const nameText = new PIXI.Text(nameTextContent, {
                    fill: 0x000000,
                    fontSize: 18,
                });
                nameText.x = initialX + 100;
                nameText.y = initialY + (index - startIndex) * yOffset + 15;
                nameText.isInventoryItem = true;

                const quantityText = new PIXI.Text(quantityTextContent, {
                    fill: 0x000000,
                    fontSize: 16,
                });
                quantityText.x = initialX + 100;
                quantityText.y = initialY + (index - startIndex) * yOffset + 45;
                quantityText.isInventoryItem = true;

                const circle = new PIXI.Graphics();
                circle.beginFill(0xffffff);
                circle.lineStyle(1, 0x000000);

                const circleSize = 70;
                circle.drawCircle(initialX + 45, initialY + (index - startIndex) * yOffset + 40, circleSize / 2);
                circle.endFill();

                const objectImage = PIXI.Sprite.from(objectImagePath);
                objectImage.isInventoryItem = true;
                objectImage.anchor.set(0.5);
                objectImage.x = initialX + 45;
                objectImage.y = initialY + (index - startIndex) * yOffset + 40;
                objectImage.scale.set(0.11);

                const imageCircle = new PIXI.Container();
                imageCircle.addChild(circle);
                imageCircle.addChild(objectImage);
                imageCircle.isInventoryItem = true;

                listBox.on('pointerdown', (event) => {
                    console.log('pointerdown event triggered', item);
                    event.stopPropagation();
                    onDragStart(item, event);
                });

                // 드래그 이벤트 리스너 등록
                appRef.current.stage.on('pointermove', (event) => {
                    if (!draggingItem) {
                        return; // 드래그 중인 아이템이 없으면 여기서 함수 종료
                    }
                    onDragMove(event);
                });
                appRef.current.stage.on('pointerup', (event) => {
                    if (!draggingItem) {
                        return; // 드래그 중인 아이템이 없으면 여기서 함수 종료
                    }
                    onDragEnd(event);
                });
                appRef.current.stage.on('pointerupoutside', (event) => {
                    if (!draggingItem) {
                        return; // 드래그 중인 아이템이 없으면 여기서 함수 종료
                    }
                    onDragEnd(event);
                });
                appRef.current.stage.addChild(listBox);
                appRef.current.stage.addChild(imageCircle);
                appRef.current.stage.addChild(nameText);
                appRef.current.stage.addChild(quantityText);
            }

            const buttonIdentifiers = [
                'allButton',
                'normalButton',
                'rareButton',
                'superRareButton',
                'uniqueButton',
                'legendButton',
            ];
            // 각 버튼 이미지를 PIXI.Texture로 변환
            const allButtonTexture = PIXI.Texture.from(AllButtonImage);
            const normalButtonTexture = PIXI.Texture.from(NormalButtonImage);
            const rareButtonTexture = PIXI.Texture.from(RareButtonImage);
            const superrareButtonTexture = PIXI.Texture.from(SuperrareButtonImage);
            const uniqueButtonTexture = PIXI.Texture.from(UniqueButtonImage);
            const legendButtonTexture = PIXI.Texture.from(LegendButtonImage);

            // Grade 버튼을 생성하고 이미지 텍스처를 할당
            const createGradeButton = (grade, x, y, identifier) => {
                if (!appRef.current.stage.getChildByName(identifier)) {
                    const button = new PIXI.Sprite(); // 이미지 스프라이트 생성
                    button.anchor.set(0.5);
                    button.x = x;
                    button.y = y;
                    button.scale.set(0.095);
                    button.interactive = true;
                    button.buttonMode = true;
                    button.name = identifier;

                    let buttonTexture;

                    // 각 Grade에 맞는 이미지 텍스처를 할당
                    switch (grade) {
                        case '전체':
                            buttonTexture = allButtonTexture;
                            break;
                        case '노말':
                            buttonTexture = normalButtonTexture;
                            break;
                        case '레어':
                            buttonTexture = rareButtonTexture;
                            break;
                        case '슈퍼레어':
                            buttonTexture = superrareButtonTexture;
                            break;
                        case '유니크':
                            buttonTexture = uniqueButtonTexture;
                            break;
                        case '레전드':
                            buttonTexture = legendButtonTexture;
                            break;
                        default:
                            break;
                    }

                    button.texture = buttonTexture; // 이미지 텍스처를 버튼에 할당

                    // 이벤트 리스너 추가
                    button.on('pointerdown', () => handleGradeButtonClick(grade));

                    appRef.current.stage.addChild(button);
                }
            };

            // Grade 버튼 생성 코드는 기존과 동일하게 유지
            const grades = ['전체', '노말', '레어', '슈퍼레어', '유니크', '레전드'];
            for (let i = 0; i < grades.length; i++) {
                createGradeButton(grades[i], 703 + i * 45, 540, buttonIdentifiers[i]);
            }
        }
    }, [
        inventory,
        activeTab,
        getObjectImagePath,
        startIndex,
        itemsPerPage,
        selectedGrade,
        draggingItem,
        tileData,
        onDragMove,
        onDragEnd,
        onDragStart,
    ]);

    const createTile = (tileData, container, textures, tileSize) => {
        // 모든 타일 데이터를 기반으로 최소 x, y 좌표값을 구합니다.
        const minIsoValues = tileData.reduce(
            (minVals, data) => {
                const isoX = ((data.x - data.y) * tileSize.width) / 2;
                const isoY = ((data.x + data.y) * tileSize.height) / 4;
                return {
                    x: Math.min(minVals.x, isoX),
                    y: Math.min(minVals.y, isoY),
                };
            },
            { x: Infinity, y: Infinity }
        );

        // 최소값을 바탕으로 모든 타일의 위치를 조정합니다.
        tileData.forEach((data) => {
            const isoX = ((data.x - data.y) * tileSize.width) / 2 - minIsoValues.x;
            const isoY = ((data.x + data.y) * tileSize.height) / 4 - minIsoValues.y;
            const texture = textures[data.landForm];
            const sprite = new PIXI.Sprite(texture);
            sprite.anchor.set(0.5);
            sprite.x = isoX;
            sprite.y = isoY;
            container.addChild(sprite);
        });
    };

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Place;
