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
import RemoveButtonImage from './imgs/RemoveButton.webp';

const Place = ({ userUUID }) => {
    const pixiContainer = useRef(null);
    const draggingItemRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [removeButtonClicked, setRemoveButtonClicked] = useState(false);

    const [removeList, setRemoveList] = useState([]);
    const [placedItems, setPlacedItems] = useState([]);
    const [activeTab, setActiveTab] = useState('animals');
    const [inventory, setInventory] = useState({ buildings: [], animals: [] });
    const [tileData, setTileData] = useState([]);
    const [textures, setTextures] = useState({});
    const containerRef = useRef(null);

    const [selectedGrade, setSelectedGrade] = useState('ALL');
    const [startIndex, setStartIndex] = useState(0);
    const inventorySpritesRef = useRef([]);
    const currentDraggingTileRef = useRef(null);
    const appRef = useRef(null);
    const animalTabBox = useRef(null);
    const ListContainer = useRef(null);
    const buildingTabBox = useRef(null);
    const changeableButtonRef = useRef(null);

    const placeButtonTexture = PIXI.Texture.from(PlaceButtonImage);
    const saveButtonTexture = PIXI.Texture.from(SaveButtonImage);
    const itemsPerPage = 4;

    const calculateMinIsoValues = (tileData, tileSize) => {
        return tileData.reduce(
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
    };

    const addToRemoveList = useCallback((tile) => {
        setRemoveList((prevList) => {
            if (prevList.some((existingTile) => existingTile.tileId === tile.tileId)) {
                return prevList;
            }

            return [...prevList, tile];
        });
    }, []);

    useEffect(() => {
        console.log('Current removeList:', removeList);
    }, [removeList]);

    const updateInventory = useCallback(async (updateRequest) => {
        try {
            const response = await api('/api/v1/inventory/updatePlace', 'POST', updateRequest, {});
            return response;
        } catch (error) {
            console.error('Failed to update inventory:', error);
        }
    }, []);

    const calculateFinalStateForItem = useCallback(
        (item) => {
            console.log('Received item:', item);
            const placedCount = placedItems.filter(
                (placedItem) => placedItem.id === item.id && placedItem.type === item.type
            ).length;

            return {
                ...item,
                placedQuantity: item.placedQuantity + placedCount,
            };
        },
        [placedItems]
    );

    const createUpdateInventoryRequest = useCallback((item) => {
        let itemId;
        const itemType = item.type.toLowerCase();

        if (itemType === 'animals') {
            itemId = item.animal.animalId;
        } else if (itemType === 'buildings') {
            itemId = item.building?.buildingId;
        }

        console.log('Received item in createUpdateInventoryRequest:', item);

        const updateItem = {
            itemId: itemId,
            placedQuantity: item.placedQuantity,
            entityType: itemType === 'animals' ? 'ANIMAL' : 'BUILDING',
        };

        return {
            animalItems: itemType === 'animals' ? [updateItem] : [],
            buildingItems: itemType === 'buildings' ? [updateItem] : [],
        };
    }, []);

    const updatePlace = useCallback(async () => {
        // removeButton이 클릭되지 않았을 때만 추가 처리를 진행
        if (!removeButtonClicked) {
            try {
                const payload = {
                    placeItems: placedItems.map((item) => ({
                        tileId: item.tileId,
                        objectId: item.id,
                        objectType: item.objectType,
                    })),
                };
                await api(`/api/v1/terrain/place`, 'POST', payload, {});

                for (const item of placedItems) {
                    const finalState = calculateFinalStateForItem(item);
                    const request = createUpdateInventoryRequest(finalState);
                    await updateInventory(request);
                }

                placedItems.forEach((placedItem) => {
                    const matchingSprite = inventorySpritesRef.current.find(
                        (sprite) => sprite.objectId === placedItem.id && sprite.tileId === placedItem.tileId
                    );
                    if (matchingSprite) {
                        matchingSprite.tint = 0xffffff;
                    }
                });
            } catch (error) {
                console.error('Failed to update terrain:', error);
            }
        }
        setPlacedItems([]);
        setRemoveList([]);
    }, [placedItems, updateInventory, createUpdateInventoryRequest, calculateFinalStateForItem, removeButtonClicked]);

    function usePrevious(value) {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const prevIsEditMode = usePrevious(isEditMode);

    const handleSaveButtonClick = useCallback(() => {
        setIsEditMode((prevMode) => !prevMode);
    }, []);

    //저장하기 버튼 누르는 부분
    useEffect(() => {
        if (changeableButtonRef.current) {
            changeableButtonRef.current.texture = isEditMode ? saveButtonTexture : placeButtonTexture;
        }

        if (prevIsEditMode && !isEditMode) {
            updatePlace();
            setRemoveButtonClicked(false);
            setPlacedItems([]);
            setRemoveList([]);
        }
    }, [isEditMode, prevIsEditMode, placeButtonTexture, saveButtonTexture, updatePlace, removeButtonClicked]);

    const cancelPlacement = useCallback(() => {
        const restoredInventory = { ...inventory };
        restoredInventory.animals = restoredInventory.animals.map((animal) => ({
            ...animal,
            placeableQuantity:
                animal.placeableQuantity +
                placedItems.filter((item) => item.id === animal.id && item.type === 'ANIMAL').length,
        }));
        restoredInventory.buildings = restoredInventory.buildings.map((building) => ({
            ...building,
            placeableQuantity:
                building.placeableQuantity +
                placedItems.filter((item) => item.id === building.id && item.type === 'BUILDING').length,
        }));
        setInventory(restoredInventory);

        setPlacedItems([]);
        setRemoveList([]);
    }, [inventory, placedItems]);

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
            const updatedData = response.data.map((item) => ({
                ...item,
                placeableQuantity: item.ownedQuantity - item.placedQuantity,
            }));
            setInventory((prev) => ({ ...prev, [type]: updatedData }));
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
                if (!item.animal || !item.animal.species) {
                    console.error('Invalid animal item:', item);
                    return '';
                }
                return `/objectImgs/animals/${item.animal.species.toLowerCase()}/${item.animal.imagePath}`;
            } else if (activeTab === 'buildings') {
                if (!item.building || !item.building.imagePath) {
                    console.error('Invalid building item:', item);
                    return '';
                }
                return `/objectImgs/buildings/${item.building.imagePath}`;
            }
            return '';
        },
        [activeTab]
    );

    const getTileObjectImagePath = useCallback(
        (objectType, objectId) => {
            const uppercaseObjectType = objectType.toUpperCase();

            const object =
                uppercaseObjectType === 'ANIMAL'
                    ? inventory.animals.find((animal) => animal.id === objectId)
                    : inventory.buildings.find((building) => building.id === objectId);

            if (!object) return '';

            const imagePath =
                uppercaseObjectType === 'ANIMAL'
                    ? `/objectImgs/animals/${object.animal.species.toLowerCase()}/${object.animal.imagePath}`
                    : `/objectImgs/buildings/${object.building.imagePath}`;

            return imagePath;
        },
        [inventory.animals, inventory.buildings]
    );

    // highlightTile 함수 정의
    const highlightTile = (tile) => {
        tile.tint = 0xff0000;
    };

    // unhighlightTile 함수 정의
    const unhighlightTile = (tile) => {
        tile.tint = 0xffffff;
    };

    // 드래그 시작
    const onDragStart = useCallback(
        (item, event) => {
            const isInventoryItem = item.animal || item.building;

            if (isInventoryItem) {
                if (draggingItemRef.current && draggingItemRef.current.dragging) {
                    appRef.current.stage.removeChild(draggingItemRef.current.image);
                }

                // 인벤토리 아이템을 새로운 드래깅 아이템으로 설정
                const draggableImage = new PIXI.Sprite(PIXI.Texture.from(getObjectImagePath(item)));
                draggableImage.anchor.set(0.5);
                draggableImage.x = event.data.global.x;
                draggableImage.y = event.data.global.y;
                draggableImage.scale.set(0.3);
                draggableImage.zIndex = 2;
                appRef.current.stage.addChild(draggableImage);

                draggingItemRef.current = {
                    item: { ...item, type: activeTab },
                    image: draggableImage,
                    offsetX: event.data.global.x - draggableImage.x,
                    offsetY: event.data.global.y - draggableImage.y,
                    dragging: true,
                };
            }
        },
        [getObjectImagePath, activeTab]
    );

    // 오른쪽 마우스 클릭 시 드래깅 아이템 제거
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        if (draggingItemRef.current && draggingItemRef.current.dragging) {
            appRef.current.stage.removeChild(draggingItemRef.current.image);
            draggingItemRef.current = null;
        }
    });

    // 드래그 중 위치 업데이트
    const onDragMove = useCallback((event) => {
        if (draggingItemRef.current && draggingItemRef.current.dragging) {
            // 드래그 중인 아이템의 새로운 위치를 계산
            const newPosition = {
                x: event.data.global.x - draggingItemRef.current.offsetX,
                y: event.data.global.y - draggingItemRef.current.offsetY,
            };

            // 드래그 중인 아이템의 위치 업데이트
            draggingItemRef.current.image.x = newPosition.x;
            draggingItemRef.current.image.y = newPosition.y;
        }
    }, []);

    // 드래그 종료
    const onDragEnd = useCallback(() => {
        if (draggingItemRef.current && draggingItemRef.current.dragging) {
            const lastTile = currentDraggingTileRef.current;

            if (lastTile && lastTile.id !== undefined) {
                let itemType;
                if (draggingItemRef.current.item.animal) {
                    itemType = 'ANIMAL';
                } else if (draggingItemRef.current.item.building) {
                    itemType = 'BUILDING';
                }

                const itemId = draggingItemRef.current.item.id;
                const tileObjectImagePath = getTileObjectImagePath(itemType, itemId);

                const currentItem = draggingItemRef.current.item;

                if (currentItem.placeableQuantity > 0) {
                    setInventory((prevInventory) => ({
                        ...prevInventory,
                        [activeTab]: prevInventory[activeTab].map((invItem) =>
                            invItem.id === currentItem.id
                                ? { ...invItem, placeableQuantity: invItem.placeableQuantity - 1 }
                                : invItem
                        ),
                    }));
                }

                const objectSprite = new PIXI.Sprite(PIXI.Texture.from(tileObjectImagePath));
                objectSprite.anchor.set(0.3);
                const tileSize = {
                    width: textures[lastTile.landForm].width,
                    height: textures[lastTile.landForm].height,
                };
                const minIsoValues = calculateMinIsoValues(tileData, tileSize);
                objectSprite.x = ((lastTile.x - lastTile.y) * tileSize.width) / 2 - minIsoValues.x;
                objectSprite.y = ((lastTile.x + lastTile.y) * tileSize.height) / 4 - minIsoValues.y - 130;
                objectSprite.anchor.set(0.5);
                objectSprite.scale.set(0.5);
                objectSprite.tint = 0x808080;
                objectSprite.zIndex = 2;
                objectSprite.objectId = itemId;
                objectSprite.tileId = lastTile.id;
                objectSprite.interactive = true;
                objectSprite.buttonMode = true;
                objectSprite.objectId = itemId;
                objectSprite.tileId = lastTile.id;
                objectSprite.type = itemType;

                containerRef.current.addChild(objectSprite);

                inventorySpritesRef.current.push(objectSprite);

                // 아이템이 배치된 것으로 상태 업데이트
                setPlacedItems((prevItems) => [
                    ...prevItems,
                    {
                        ...draggingItemRef.current.item,
                        tileId: lastTile.id,
                        objectType: itemType,
                    },
                ]);
            } else {
                console.error('Invalid or no tile was dragged over');
            }

            appRef.current.stage.removeChild(draggingItemRef.current.image);
            draggingItemRef.current.dragging = false;
        }
    }, [setPlacedItems, currentDraggingTileRef, textures, getTileObjectImagePath, tileData, activeTab]);

    const createTile = useCallback(
        (tileData, container, textures, tileSize) => {
            // 모든 타일 데이터를 기반으로 최소 x, y 좌표값을 구합니다.
            const minIsoValues = calculateMinIsoValues(tileData, tileSize);

            // 모든 타일의 위치를 조정하고 타일 위에 ID를 표시합니다.
            tileData.forEach((data, index) => {
                // 타일 스프라이트 생성
                const isoX = ((data.x - data.y) * tileSize.width) / 2 - minIsoValues.x;
                const isoY = ((data.x + data.y) * tileSize.height) / 4 - minIsoValues.y;
                const texture = textures[data.landForm];

                const sprite = new PIXI.Sprite(texture);
                sprite.anchor.set(0.5);
                sprite.name = `tile-${index}`;
                sprite.interactive = true;
                sprite.x = isoX;
                sprite.y = isoY;

                sprite.on('pointerdown', (event) => {
                    onDragStart(data, event); // data 객체를 이벤트 핸들러로 전달
                });

                // 타일 위에 마우스가 올라가는 이벤트
                sprite.on('pointerover', () => {
                    if (draggingItemRef.current && draggingItemRef.current.dragging) {
                        highlightTile(sprite);
                        currentDraggingTileRef.current = data;
                    }
                });

                // 타일에서 마우스가 벗어나는 이벤트
                sprite.on('pointerout', () => {
                    unhighlightTile(sprite);
                });

                container.addChild(sprite);
            });
        },
        [onDragStart]
    );

    useEffect(() => {
        fetchInventory('animals');
        fetchInventory('buildings');
        loadTextures();
        fetchTileData();
    }, [loadTextures]);

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
                    quantityTextContent = `배치가능수량: ${item.placeableQuantity}`;
                } else if (activeTab === 'buildings') {
                    nameTextContent = `${item.building.name}`;
                    quantityTextContent = `배치가능수량: ${item.placeableQuantity}`;
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
                    if (item.placeableQuantity > 0) {
                        onDragStart(item, event);
                    }
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
                    button.visible = isEditMode;
                    button.name = identifier;

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
        if (appRef.current) {
            const buttonIdentifiers = [
                'allButton',
                'normalButton',
                'rareButton',
                'superRareButton',
                'uniqueButton',
                'legendButton',
            ];

            buttonIdentifiers.forEach((identifier) => {
                const button = appRef.current.stage.getChildByName(identifier);
                if (button) {
                    button.visible = isEditMode;
                }
            });

            if (animalTabBox.current) {
                animalTabBox.current.visible = isEditMode;
                animalTabBox.current.children.forEach((child) => {
                    child.visible = isEditMode;
                });
            }

            if (buildingTabBox.current) {
                buildingTabBox.current.visible = isEditMode;
                buildingTabBox.current.children.forEach((child) => {
                    child.visible = isEditMode;
                });
            }

            if (ListContainer.current) {
                ListContainer.current.visible = isEditMode;
            }
        }
    }, [isEditMode]);

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
                containerRef.current = new PIXI.Container();
                appRef.current.stage.addChild(containerRef.current);
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
                    const minIsoValues = calculateMinIsoValues(tileData, tileSize);

                    createTile(tileData, containerRef.current, textures, tileSize, minIsoValues);

                    const newSprites = [];

                    tileData.forEach((data) => {
                        if (data.objectId && data.objectType) {
                            const tileObjectImagePath = getTileObjectImagePath(data.objectType, data.objectId);

                            if (tileObjectImagePath) {
                                const inventoryObjectSprite = new PIXI.Sprite(PIXI.Texture.from(tileObjectImagePath));
                                inventoryObjectSprite.anchor.set(0.5);
                                inventoryObjectSprite.x = ((data.x - data.y) * tileSize.width) / 2 - minIsoValues.x;
                                inventoryObjectSprite.y =
                                    ((data.x + data.y) * tileSize.height) / 4 - minIsoValues.y - 130;
                                inventoryObjectSprite.scale.set(0.5);
                                inventoryObjectSprite.zIndex = 1;
                                inventoryObjectSprite.interactive = true;
                                inventoryObjectSprite.buttonMode = true;
                                inventoryObjectSprite.objectId = data.objectId;
                                inventoryObjectSprite.tileId = data.id;
                                inventoryObjectSprite.type = data.objectType;

                                containerRef.current.addChild(inventoryObjectSprite);
                                newSprites.push(inventoryObjectSprite);
                            }
                        }
                        inventorySpritesRef.current = newSprites;
                    });
                }

                const changeableButton = new PIXI.Sprite(placeButtonTexture);
                changeableButton.interactive = true;
                changeableButton.buttonMode = true;
                changeableButton.x = 780; // 화면의 위치를 조정하여 적절한 위치에 버튼이 오도록 설정합니다.
                changeableButton.y = 580;
                changeableButton.scale.set(0.35);
                changeableButtonRef.current = changeableButton;
                appRef.current.stage.addChild(changeableButton);

                changeableButton.on('pointertap', handleSaveButtonClick);

                containerRef.current.interactive = true;
                containerRef.current.buttonMode = true;
                containerRef.current.scale.set(0.5);
                containerRef.current.position.set(app.screen.width / 2, app.screen.height / 2);

                let startPosition = null;

                ListContainer.current = new PIXI.Graphics();
                ListContainer.current.beginFill(0xffffff, 0.8);
                ListContainer.current.drawRoundedRect(0, 70, 400, 500, 20);
                ListContainer.current.x = app.screen.width - 300;
                ListContainer.current.y = 0;
                ListContainer.current.visible = isEditMode;
                app.stage.addChild(ListContainer.current);

                animalTabBox.current = new PIXI.Graphics();
                animalTabBox.current.beginFill(0xffffff, 0.8);
                animalTabBox.current.drawRoundedRect(660, 20, 150, 50, 20);
                animalTabBox.current.interactive = true;
                animalTabBox.current.visible = isEditMode;
                animalTabBox.current.buttonMode = true;
                const animalText = new PIXI.Text('동물', { fill: 0x000000, fontSize: 24 });
                animalText.x = 710;
                animalText.y = 35;
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
                buildingTabBox.current.visible = isEditMode;
                const buildingText = new PIXI.Text('건물', { fill: 0x000000, fontSize: 24 });
                buildingText.x = 860;
                buildingText.y = 35;
                buildingText.visible = isEditMode;
                buildingTabBox.current.addChild(buildingText);
                buildingTabBox.current.on('pointerdown', (event) => {
                    event.stopPropagation();
                    handleTabSelect('buildings');
                });
                app.stage.addChild(buildingTabBox.current);

                updateTabStyle(activeTab);

                // container에 대한 이벤트 핸들러 설정
                containerRef.current
                    .on('pointerdown', (event) => {
                        if (!draggingItemRef.current || !draggingItemRef.current.dragging) {
                            startPosition = event.data.getLocalPosition(containerRef.current.parent);
                            containerRef.current.alpha = 0.5;
                        }
                    })
                    .on('pointerup', (event) => {
                        if (draggingItemRef.current && draggingItemRef.current.dragging) {
                            onDragEnd(event);
                        } else {
                            startPosition = null;
                            containerRef.current.alpha = 1;
                        }
                    })

                    .on('pointermove', (event) => {
                        if (draggingItemRef.current && draggingItemRef.current.dragging) {
                            onDragMove(event); // 드래그 중인 객체 이동 처리
                        } else if (startPosition) {
                            // 타일맵 이동 처리
                            const newPosition = event.data.getLocalPosition(containerRef.current.parent);
                            containerRef.current.x += newPosition.x - startPosition.x;
                            containerRef.current.y += newPosition.y - startPosition.y;
                            startPosition = newPosition;
                        }
                    });

                app.view.addEventListener('wheel', (event) => {
                    event.preventDefault();
                    const direction = event.deltaY > 0 ? -1 : 1;
                    const factor = 0.05;
                    const newScale = containerRef.current.scale.x + factor * direction;
                    containerRef.current.scale.set(newScale, newScale);
                });
            }
        }
    }, [
        textures,
        tileData,
        activeTab,
        handleTabSelect,
        onDragEnd,
        onDragMove,
        handleSaveButtonClick,
        isEditMode,
        placeButtonTexture,
        createTile,
        getTileObjectImagePath,
    ]);

    useEffect(() => {
        if (isEditMode) {
            let removeModeButton = appRef.current.stage.getChildByName('removeModeButton');
            if (!removeModeButton) {
                const removeModeTexture = PIXI.Texture.from(RemoveButtonImage);
                removeModeButton = new PIXI.Sprite(removeModeTexture);
                removeModeButton.name = 'removeModeButton';
                removeModeButton.interactive = true;
                removeModeButton.buttonMode = true;
                removeModeButton.visible = isEditMode;
                removeModeButton.x = 690;
                removeModeButton.y = 575;
                removeModeButton.scale.set(0.13);
                appRef.current.stage.addChild(removeModeButton);
            }
            removeModeButton.visible = true;

            // RemoveButton 클릭 이벤트 핸들러
            removeModeButton.on('pointerdown', async () => {
                try {
                    // 제거된 아이템의 placeableQuantity 업데이트
                    const newInventory = { ...inventory };

                    removeList.forEach((tile) => {
                        const inventoryType = tile.type === 'ANIMAL' ? 'animals' : 'buildings'; // 올바른 배열 이름 얻기

                        const inventoryItems = newInventory[inventoryType];
                        if (inventoryItems) {
                            const index = inventoryItems.findIndex((item) => item.id === tile.objectId); // item.id와 tile.objectId 비교

                            if (index >= 0) {
                                // placeableQuantity 업데이트
                                newInventory[inventoryType][index].placeableQuantity += 1;
                            }
                        }
                    });
                    setInventory(newInventory);

                    // TerrainService 업데이트를 위한 타일 ID 목록 생성
                    const tileIds = removeList.map((tile) => tile.tileId);

                    // TerrainService 업데이트
                    await api('/api/v1/terrain/remove', 'POST', tileIds, {});
                    // 이미지 제거 로직
                    removeList.forEach((tile) => {
                        const sprite = inventorySpritesRef.current.find((s) => s.tileId === tile.tileId);
                        if (sprite) {
                            containerRef.current.removeChild(sprite);
                        }
                    });

                    // InventoryService 업데이트를 위한 요청 생성
                    let animalItems = [];
                    let buildingItems = [];
                    removeList.forEach((tile) => {
                        const item = inventory[tile.type === 'ANIMAL' ? 'animals' : 'buildings'].find(
                            (i) => i.id === tile.objectId
                        );
                        if (!item) return;

                        const removeItem = {
                            itemId: tile.type === 'ANIMAL' ? item.animal.animalId : item.building.buildingId,
                            removeQuantity: 1, // 기존에는 Math.abs(item.placedQuantity - 1) 사용
                            entityType: tile.type,
                        };

                        tile.type === 'ANIMAL' ? animalItems.push(removeItem) : buildingItems.push(removeItem);
                    });

                    const inventoryResponse = await api(
                        '/api/v1/inventory/removePlace',
                        'POST',
                        { animalItems, buildingItems },
                        {}
                    );
                    if (inventoryResponse.success) {
                    }

                    setRemoveList([]);
                    setRemoveButtonClicked(true);
                } catch (error) {
                    console.error('정보 수정에 실패하였습니다', error);
                }
            });
        }
    }, [isEditMode, removeList, inventory]);

    useEffect(() => {
        if (isEditMode) {
            inventorySpritesRef.current.forEach((sprite) => {
                sprite.removeAllListeners('pointerdown');
                sprite.on('pointerdown', (event) => {
                    event.stopPropagation();
                    addToRemoveList({
                        tileId: sprite.tileId,
                        objectId: sprite.objectId,
                        type: sprite.type,
                    });
                    sprite.tint = 0xff0000;
                });
            });
        }
    }, [isEditMode, addToRemoveList]);

    return <div ref={pixiContainer} className="outlet-container"></div>;
};

export default Place;
