import React, { useEffect, useState } from 'react';
import { api } from '../../../network/api';
import {useLocation} from "react-router";
import '../css/Battle.css';
import HealthBar from "./Health";

const Battle = () => {
    const [attackerAtkPower, setAttackerAtkPower] = useState(null);
    const [attackerDefPower, setAttackerDefPower] = useState(null);
    const [defenderAtkPower, setDefenderAtkPower] = useState(null);
    const [defenderDefPower, setDefenderDefPower] = useState(null);
    const [battleLog, setBattleLog] = useState([]);
    const [renderedLogs, setRenderedLogs] = useState([]);

    const location = useLocation();
    const data = location.state;
    const [attackerLife, setAttackerLife] = useState(data.state.state.attacker.life);
    const [defenderLife, setDefenderLife] = useState(data.state.state.depender.life);

    const sendBattleDataToServer = async () => {
        try {
            const requestBody = {
                attacker: {
                    id: data.state.state.attacker.id,
                    nickName: data.state.state.attacker.nickName,
                    species: data.state.state.attacker.species,
                    profileImage: data.state.state.attacker.profileImage,
                    life: data.state.state.attacker.life,
                    maxLife: data.state.state.attacker.maxLife,
                    attackPower: data.state.state.attacker.attackPower,
                    defensePower: data.state.state.attacker.defensePower,
                    stringAttackTypeSkill: data.state.state.attacker.attackerAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.attacker.attackerDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.attacker.attackerUtilityTypeSkill,
                    food: data.state.state.attacker.food,
                    gold : data.state.state.attacker.gold,
                    iron: data.state.state.attacker.iron,
                    wood: data.state.state.attacker.wood
                },
                defender: {
                    id: data.state.state.depender.id,
                    nickName: data.state.state.depender.nickName,
                    species: data.state.state.depender.species,
                    profileImage: data.state.state.depender.profileImage,
                    life: data.state.state.depender.life,
                    maxLife: data.state.state.depender.maxLife,
                    attackPower: data.state.state.depender.attackPower,
                    defensePower: data.state.state.depender.defensePower,
                    stringAttackTypeSkill: data.state.state.depender.defenderAttackTypeSkill,
                    stringDefenseTypeSkill: data.state.state.depender.defenderDefenseTypeSkill,
                    stringUtilityTypeSkill: data.state.state.depender.defenderUtilityTypeSkill,
                    food: data.state.state.depender.food,
                    gold : data.state.state.depender.gold,
                    iron: data.state.state.depender.iron,
                    wood: data.state.state.depender.wood
                },
            };

            const stateToken = localStorage.getItem('stateToken');
            const response = await api('/api/v1/battle', 'POST', requestBody, {
                headers: {
                    Authorization: `Bearer ${stateToken}`,
                },
            });

            const logEntries = response.data;
            let count = 0;

            if (logEntries) {

                const intervalId = setInterval(() => {
                    if (count < logEntries.length) {
                        setBattleLog((prevState) => [...prevState, logEntries[count]]);
                        count += 1;

                        // 로그 상자의 맨 아래로 스크롤
                        const logBox = document.getElementById('battleLogBox');
                        logBox.scrollTop = logBox.scrollHeight;

                        setAttackerLife(logEntries[count]?.attackerLife || attackerLife);
                        setDefenderLife(logEntries[count]?.defenderLife || defenderLife);
                    } else {
                        clearInterval(intervalId);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('전투 데이터 전송 오류:', error);
        }
    };


    useEffect(() => {
        // // 공격자 및 수비자 파워 업데이트
        // setAttackerAtkPower( /* 업데이트된 값 */ );
        // setAttackerDefPower( /* 업데이트된 값 */ );
        // setDefenderAtkPower( /* 업데이트된 값 */ );
        // setDefenderDefPower( /* 업데이트된 값 */ );

        // 전투 로그 업데이트를 시뮬레이션
        setBattleLog(prevLogs => [...prevLogs]);

        // 서버로 전투 데이터 전송
        sendBattleDataToServer();

    }, []);
    return (
        <div className="battleLogBackGround">
            <div className="battleLogBackGroundInner">
                {/* 공격자와 수비자 상자 */}
                <div>
                    <h3>Attacker</h3>
                    <p>Life: {attackerLife}</p>
                    <HealthBar currentHealth={attackerLife} maxHealth={data.state.state.attacker.maxLife} barColor="green" />
                </div>
                <div>
                    <h3>Defender</h3>
                    <p>Life: {defenderLife}</p>
                    <HealthBar currentHealth={defenderLife} maxHealth={data.state.state.attacker.maxLife} barColor="red" />
                </div>

                <div className="battleLogBoxOut">
                    {/* 스킵 버튼 및 전투 로그 상자 */}
                    {/*<button onClick={handleSkipLogs}>스킵하기</button>*/}
                    <div id="battleLogBox" className="fixed-width-log-box">
                        {battleLog.map((item, idx) => (
                            <p key={idx}>{item}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Battle;

