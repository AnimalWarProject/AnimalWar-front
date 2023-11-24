import React from 'react';

const DefenderHealth = ({ currentHealth, maxHealth, barColor }) => {
    const calculateHealthPercentage = () => {
        return (currentHealth / maxHealth) > 0 ? (currentHealth / maxHealth) * 100 : 0  ;
    };

    return (
        <div style={{
            width: "243px",
            height: "63px",
            backgroundColor: '#211919',
            borderRadius: '23px',
            paddingLeft: '2.5px',
            paddingTop: '3px',

        }}>

        <div style={{
            width: 240,
            borderRadius: '20px',
            overflow: 'hidden',
        }}>
            <div
                style={{
                    width: `${calculateHealthPercentage()}%`,
                    backgroundColor: barColor || 'green',
                    height: '60px',
                    transition: 'width 0.4s ease',
                    display : 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    opacity : currentHealth < 1 ? '0' : undefined
                }}
            >

                <div style = {{
                    position: "absolute",
                    top: "7px",
                    left: "62%",
                    transform: "translateX(-50%)",
                    fontWeight: "bolder",
                    color: "white",
                    overflow: "hidden",
                    display: "inline-block",
                    alignItems: 'center',
                    textShadow: '2px 1px 4px black',
                    WebkitTextStroke: "1px black",
                    fontFamily: "Arial, sans-serif",
                }}>

                    <h3 style={{fontSize: '28px', letterSpacing: "0.8px" }}>{currentHealth}</h3>
                </div>
            </div>
        </div>
        </div>
    );
};

export default DefenderHealth;
