import React, { useState } from 'react';
import AnimalDraw from './AnimalDraw';
import BuildingDraw from './BuildingDraw';
import '../css/DrawPage.css';

const DrawPage = () => {
    const [showAnimal, setShowAnimal] = useState(true);
    const [showBuilding, setShowBuilding] = useState(false);

    const onClick = (component) => {
        if (component === 'AnimalDraw') {
            setShowAnimal(true);
            setShowBuilding(false);
        } else if (component === 'BuildingDraw') {
            setShowAnimal(false);
            setShowBuilding(true);
        }
    };

    return (
        <div>
            <div className="drawBtn-wrap">
                <button className="AnimalDraw" onClick={() => onClick('AnimalDraw')}>동물</button>
                <button className="BuildingDraw" onClick={() => onClick('BuildingDraw')}>건물</button>
            </div>
            {showAnimal && <AnimalDraw />}
            {showBuilding && <BuildingDraw />}
        </div>
    );
};

export default DrawPage;





