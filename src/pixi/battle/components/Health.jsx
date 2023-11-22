import React from 'react';

const HealthBar = ({ currentHealth, maxHealth, barColor }) => {
    const calculateHealthPercentage = () => {
        return (currentHealth / maxHealth) * 100;
    };

    return (
        <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '5px', overflow: 'hidden' }}>
            <div
                style={{
                    width: `${calculateHealthPercentage()}%`,
                    backgroundColor: barColor || 'green',
                    height: '20px',
                    transition: 'width 0.5s ease',
                }}
            />
        </div>
    );
};

export default HealthBar;
