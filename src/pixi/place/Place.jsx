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
import PlaceButtonImage from './imgs/PlaceButton.webp';
import SaveButtonImage from './imgs/SaveButton.webp';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);
    const draggingItemRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [placedItems, setPlacedItems] = useState([]);
    const [buttonImage, setButtonImage] = useState(PlaceButtonImage);
    const [activeTab, setActiveTab] = useState('animals');
    const [inventory, setInventory] = useState({ buildings: [], animals: [] });
    const [tileData, setTileData] = useState([]);
    const [textures, setTextures] = useState({});
    const [selectedGrade, setSelectedGrade] = useState('ALL');
    const [startIndex, setStartIndex] = useState(0);
    const appRef = useRef(null);
    const animalTabBox = useRef(null);
    const buildingTabBox = useRef(null);
    const itemsPerPage = 4;

    const handleSaveButtonClick = useCallback(async () => {
        if (isEditMode) {
            // 편집 모드일 때: 아이템 저장 로직 실행
            try {
                const payload = placedItems.map((item) => ({
                    tileId: item.tileId,
                    objectId: item.id,
                    objectType: item.objectType,
                }));

                await api(`/api/v1/terrain/placeItems`, 'POST', payload, {});

                alert('아이템이 성공적으로 배치되었습니다.');
                setPlacedItems([]);
            } catch (error) {
                console.error('Failed to save item placement:', error);
            }

            setButtonImage(PlaceButtonImage);
        } else {
            // 편집 모드가 아닐 때: 편집 모드로 전환
            setButtonImage(SaveButtonImage);
        }
        setIsEditMode(!isEditMode); // 편집 모드 토글
    }, [placedItems, isEditMode]);

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
            const inventoryType = item.type; // 'animals' 또는 'buildings'
            const updatedItems = prevInventory[inventoryType].map((invItem) => {
                if (invItem.id === item.id) {
                    return { ...invItem, quantity: invItem.quantity - 1 };
                }
                return invItem;
            });
            return { ...prevInventory, [inventoryType]: updatedItems };
        });
    }, []);

    const getDroppedTile = useCallback(
        (x, y) => {
            // tileData 배열에서 가장 가까운 타일을 찾기
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

    // 드래그 시작
    const onDragStart = useCallback(
        (item, event) => {
            let imagePath, itemType;

            if (activeTab === 'animals') {
                imagePath = `/objectImgs/animals/${item.animal.species.toLowerCase()}/${item.animal.imagePath}`;
                itemType = 'animals';
            } else if (activeTab === 'buildings') {
                imagePath = `/objectImgs/buildings/${item.building.imagePath}`;
                itemType = 'buildings';
            }

            const draggableImage = new PIXI.Sprite(PIXI.Texture.from(imagePath));
            draggableImage.anchor.set(0.5);
            draggableImage.x = event.data.global.x;
            draggableImage.y = event.data.global.y;
            draggableImage.zIndex = 10;
            appRef.current.stage.addChild(draggableImage);

            draggingItemRef.current = {
                item: { ...item, type: itemType },
                image: draggableImage,
                offsetX: event.data.global.x - draggableImage.x,
                offsetY: event.data.global.y - draggableImage.y,
                dragging: true,
            };
        },
        [activeTab]
    );

    // 드래그 중 위치 업데이트 함수
    const onDragMove = useCallback((event) => {
        if (draggingItemRef.current && draggingItemRef.current.dragging) {
            const newPosition = {
                x: event.data.global.x - draggingItemRef.current.offsetX,
                y: event.data.global.y - draggingItemRef.current.offsetY,
            };

            draggingItemRef.current.image.x = newPosition.x;
            draggingItemRef.current.image.y = newPosition.y;
        }
        console.log('드래그 중 정보', draggingItemRef.current);
    }, []);

    // 드래그 종료
    const onDragEnd = useCallback(() => {
        if (draggingItemRef.current && draggingItemRef.current.dragging) {
            const droppedTile = getDroppedTile(draggingItemRef.current.image.x, draggingItemRef.current.image.y);
            if (droppedTile) {
                const item = draggingItemRef.current.item;
                const objectType = item.animal ? 'ANIMAL' : 'BUILDING';

                updateInventoryItemQuantity(item);

                setPlacedItems((prevItems) => [
                    ...prevItems,
                    {
                        ...item,
                        tileId: droppedTile.id,
                        objectType: objectType,
                    },
                ]);
            }
            appRef.current.stage.removeChild(draggingItemRef.current.image);
            draggingItemRef.current = null;
        }
    }, [getDroppedTile, updateInventoryItemQuantity]);

    useEffect(() => {
        fetchInventory('animals');
        loadTextures();
        fetchTileData();
    }, [loadTextures]);

    useEffect(() => {
        if (appRef.current) {
            appRef.current.stage.sortableChildren = true;
            let saveButton = appRef.current.stage.getChildByName('saveButton');
            if (!saveButton) {
                saveButton = new PIXI.Sprite(PIXI.Texture.from(buttonImage));
                saveButton.interactive = true;
                saveButton.buttonMode = true;
                saveButton.x = 500;
                saveButton.y = 50;
                saveButton.scale.set(0.3);
                saveButton.zIndex = 50;
                saveButton.name = 'saveButton';
                saveButton.on('pointerdown', handleSaveButtonClick);
                appRef.current.stage.addChild(saveButton);
                console.log(appRef.current);
                console.log(saveButton);
            } else {
                saveButton.texture = PIXI.Texture.from(buttonImage);
                saveButton.off('pointerdown').on('pointerdown', handleSaveButtonClick);
            }
        }
    }, [appRef, handleSaveButtonClick, buttonImage]);

    useEffect(() => {
        if (appRef.current && activeTab) {
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
                button.name = 'prevButton';
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
                button.name = 'nextButton';
                return button;
            };

            let prevButton = appRef.current.stage.getChildByName('prevButton');
            if (!prevButton) {
                prevButton = createPrevButton();
                appRef.current.stage.addChild(prevButton);
            } else {
                prevButton.off('pointerdown').on('pointerdown', handlePrevButtonClick);
            }
            // 다음 버튼
            let nextButton = appRef.current.stage.getChildByName('nextButton');
            if (!nextButton) {
                nextButton = createNextButton();
                appRef.current.stage.addChild(nextButton);
            } else {
                nextButton.off('pointerdown').on('pointerdown', handleNextButtonClick);
            }

            // isEditMode 상태에 따라 버튼 표시 여부 결정
            prevButton.visible = isEditMode;
            nextButton.visible = isEditMode;

            let initialX = 670;
            let initialY = 90;
            const yOffset = 95;
            const selectedInventory = inventory[activeTab];

            const filteredItems = selectedInventory.filter((item) => {
                if (selectedGrade === 'ALL') {
                    return true;
                } else {
                    return item.animal.grade === selectedGrade;
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
                    onDragStart(item, event);
                });

                appRef.current.stage.addChild(listBox);
                appRef.current.stage.addChild(imageCircle);
                appRef.current.stage.addChild(nameText);
                appRef.current.stage.addChild(quantityText);
                listBox.visible = isEditMode;
                imageCircle.visible = isEditMode;
                nameText.visible = isEditMode;
                quantityText.visible = isEditMode;
            }

            const buttonIdentifiers = [
                'allButton',
                'normalButton',
                'rareButton',
                'superRareButton',
                'uniqueButton',
                'legendButton',
            ];

            const allButtonTexture = PIXI.Texture.from(AllButtonImage);
            const normalButtonTexture = PIXI.Texture.from(NormalButtonImage);
            const rareButtonTexture = PIXI.Texture.from(RareButtonImage);
            const superrareButtonTexture = PIXI.Texture.from(SuperrareButtonImage);
            const uniqueButtonTexture = PIXI.Texture.from(UniqueButtonImage);
            const legendButtonTexture = PIXI.Texture.from(LegendButtonImage);

            const createGradeButton = (grade, x, y, identifier) => {
                if (!appRef.current.stage.getChildByName(identifier)) {
                    const button = new PIXI.Sprite();
                    button.anchor.set(0.5);
                    button.x = x;
                    button.y = y;
                    button.scale.set(0.095);
                    button.interactive = true;
                    button.buttonMode = true;
                    button.name = identifier;
                    button.visible = isEditMode;

                    let buttonTexture;

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

                    button.texture = buttonTexture;

                    button.on('pointerdown', (event) => {
                        event.stopPropagation();
                        handleGradeButtonClick(grade);
                    });

                    appRef.current.stage.addChild(button);
                }
            };

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
        tileData,
        onDragMove,
        onDragEnd,
        onDragStart,
        isEditMode,
    ]);

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
                ListContainer.visible = isEditMode;
                app.stage.addChild(ListContainer);

                animalTabBox.current = new PIXI.Graphics();
                animalTabBox.current.beginFill(0xffffff, 0.8);
                animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);
                animalTabBox.current.interactive = true;
                animalTabBox.current.buttonMode = true;
                const animalText = new PIXI.Text('동물', { fill: 0x000000, fontSize: 24 });
                animalText.x = 710;
                animalText.y = 35;
                animalTabBox.current.visible = isEditMode;
                animalText.visible = isEditMode;
                animalTabBox.current.addChild(animalText);
                animalTabBox.current.on('pointerdown', (event) => {
                    event.stopPropagation();
                    handleTabSelect('animals');
                });

                app.stage.addChild(animalTabBox.current);

                buildingTabBox.current = new PIXI.Graphics();
                buildingTabBox.current.beginFill(0xffffff, 0.8);
                buildingTabBox.current.drawRoundedRect(810, 20, 150, 50, 20);
                buildingTabBox.current.interactive = true;
                buildingTabBox.current.buttonMode = true;
                const buildingText = new PIXI.Text('건물', { fill: 0x000000, fontSize: 24 });
                buildingText.x = 860;
                buildingText.y = 35;
                buildingTabBox.current.visible = isEditMode;
                buildingText.visible = isEditMode;
                buildingTabBox.current.addChild(buildingText);
                buildingTabBox.current.on('pointerdown', (event) => {
                    event.stopPropagation();
                    handleTabSelect('buildings');
                });
                app.stage.addChild(buildingTabBox.current);

                updateTabStyle(activeTab);

                // container에 대한 이벤트 핸들러 설정
                container
                    .on('pointerdown', (event) => {
                        if (!draggingItemRef.current) {
                            startPosition = event.data.getLocalPosition(container.parent);
                            container.alpha = 0.5;
                        }
                    })
                    .on('pointerup', (event) => {
                        if (draggingItemRef.current && draggingItemRef.current.dragging) {
                            onDragEnd(event);
                        } else {
                            startPosition = null;
                            container.alpha = 1;
                        }
                    })
                    .on('pointermove', (event) => {
                        if (draggingItemRef.current && draggingItemRef.current.dragging) {
                            onDragMove(event); // 드래그 중인 객체 이동 처리
                        } else if (startPosition) {
                            // 타일맵 이동 처리
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
    }, [textures, tileData, activeTab, handleTabSelect, onDragEnd, onDragMove, isEditMode]);

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
