import React, { useEffect, useState } from 'react';
import { api } from '../../../network/api';
import {useLocation} from "react-router";
import '../css/Battle.css';
import AttackerHealth from "./AttackerHealth";
import DefenderHealth from "./DefenderHealth";
import {useHistory} from "react-router-use-history";

const Battle = () => {
    const [battleLog, setBattleLog] = useState([]);
    const location = useLocation();
    const data = location.state;
    const [attackerLife, setAttackerLife] = useState(data.state.state.attacker.life);
    const [defenderLife, setDefenderLife] = useState(data.state.state.depender.life);
    const [attackerAtkPower, setAttackerAtkPower] = useState(data.state.state.attacker.attackPower);
    const [defenderDefPower, setDefenderDefPower] = useState(data.state.state.depender.defensePower);
    const [attackerDefPower, setAttackerDefPower] = useState(data.state.state.attacker.defensePower);
    const [defenderAtkPower, setDefenderAtkPower] = useState(data.state.state.depender.attackPower);
    const speciesAtk = useState(data.state.state.attacker.species);
    const speciesDef = useState(data.state.state.depender.species);
    const attackerNickName = useState(data.state.state.attacker.nickName);
    const defenderNickName = useState(data.state.state.depender.nickName);
    const attackerImg = useState(data.state.state.attacker.profileImage);
    const defenderImg = useState(data.state.state.depender.profileImage);
    const time = useHistory();
    const sendBattleDataToServer = async () => {

        try {
            const requestBody = {
                attacker: {
                    id: data.state.state.attacker.id,
                    uuid: data.state.state.attacker.uuid,
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
                    uuid: data.state.state.depender.uuid,
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
                    try {
                        if (count < logEntries.length-1) {
                            setBattleLog((prevState) => [...prevState, logEntries[count]]);
                            count += 1;
                            if (logEntries[count].includes("공격자 현재체력")){
                                setAttackerLife(parseInt(logEntries[count].match(/-?\d+/)[0]));
                            }
                            if (logEntries[count].includes("수비자 현재체력")){
                                setDefenderLife(parseInt(logEntries[count].match(/-?\d+/)[0]));
                            }
                            if (logEntries[count].includes("공격자 상성확인되었습니다")){
                                const upAttackPower = attackerAtkPower
                                const upDefendPower = attackerDefPower
                                setAttackerAtkPower(Number((upAttackPower * 1.1).toFixed(0)));
                                setAttackerDefPower(Number((upDefendPower * 1.1).toFixed(0)));
                            }
                            if (logEntries[count].includes("수비자 상성확인되었습니다")){
                                const upAttackPower = defenderAtkPower
                                const upDefendPower = defenderDefPower
                                // setDefenderAtkPower(upAttackPower * 1.1);
                                // setDefenderDefPower(upDefendPower * 1.1);
                                setDefenderAtkPower(Number((upAttackPower * 1.1).toFixed(0)));
                                setDefenderDefPower(Number((upDefendPower * 1.1).toFixed(0)));
                            }

                            if (logEntries[count].includes(data.state.state.attacker.nickName + "의 공격형 스킬 버서커")){
                                if (data.state.state.attacker.maxLife * 0.2 >= data.state.state.attacker.life) {
                                    setAttackerAtkPower(attackerAtkPower * 3);
                                }
                            }
                            if (logEntries[count].includes(data.state.state.attacker.nickName + "의 공격형 스킬 버서커")){
                                if (data.state.state.depender.maxLife * 0.2 >= data.state.state.depender.life) {
                                    setDefenderDefPower(defenderDefPower * 3);
                                }
                            }
                            //
                            // if (logEntries[count].includes("공수교대")){
                            //     const attackerAttackPower = attackerAtkPower
                            //     const attackerDefenderPower = attackerDefPower
                            //     setAttackerAtkPower(attackerDefenderPower);
                            //     setAttackerDefPower(attackerAttackPower)
                            //     const defenderAttackerPower = defenderAtkPower;
                            //     const defenderDependerPower = defenderDefPower;
                            //     setDefenderDefPower(defenderAttackerPower);
                            //     setDefenderAtkPower(defenderDependerPower)
                            // }
                            // if (logEntries[count].includes(attackerNickName + "의 유틸형 스킬 "+ "강약약강")){
                            //     setAttackerAtkPower(attackerAtkPower * 1.1);
                            //     setAttackerAtkPower(attackerAtkPower * 0.9);
                            // }
                            // if (logEntries[count].includes(defenderNickName + "의 유틸형 스킬 "+ "강약약강")){
                            //     defenderAttackerPower(attackerAtkPower * 1.1);
                            //     defenderDependerPower(attackerAtkPower * 0.9);
                            // }
                            // 로그 상자의 맨 아래로 스크롤
                            const logBox = document.getElementById('battleLogBox');
                            logBox.scrollTop = logBox.scrollHeight;

                            if (logEntries[count].includes("패배")) {
                                setTimeout(() => {
                                    time.push('/loser' , { state: data });
                                    } ,4000)
                            } else if (logEntries[count].includes("승리")) {
                                setTimeout(() => {
                                    time.push('/winner', { state: data });
                                }, 4000)
                            }
                        } else {
                            clearInterval(intervalId);
                        }
                    }catch (e){
                        clearInterval(intervalId);
                    }

                }, 400);

            }
        } catch (error) {
            console.error('전투 데이터 전송 오류:', error);
        }
    };

    useEffect(() => {

        // 전투 로그 업데이트를 시뮬레이션
        setBattleLog(prevLogs => [...prevLogs]);
        //
        // // 서버로 전투 데이터 전송
        sendBattleDataToServer();

        console.log("Battle Log Data:", battleLog);

    }, []);
    return (
        <div className="battleLogBackGround">
            <div className="battleLogBackGroundInner">
                <div className="battleLogBoxOut">
                    {/* 스킵 버튼 및 전투 로그 상자 */}
                    <div id="battleLogBox" className="fixed-width-log-box">
                        {battleLog.map((item, idx) => (
                            <p key={idx}>{item}</p>
                        ))}
                    </div>
                </div>

                <div className = "stateBox1" style={{display : "flex"}}>
                    <div style = {{paddingLeft: '10px', paddingTop: '20px'}}>
                        <div style = {{display : 'flex', alignItems : 'center', gap : '15px'}}>
                            <p><img src = {attackerImg} alt="Attacker" style={{ width: '70px', height: '70px' }} /></p>
                            <AttackerHealth currentHealth={attackerLife} maxHealth={data.state.state.attacker.maxLife} barColor="#FC5740" />
                        </div>
                        <div style = {{paddingLeft: '13px'}}>
                            <p>{attackerNickName} 님</p>
                        </div>
                        <div style = {{paddingLeft: '100px', fontSize: '15px'}}>
                            <h3>종족: {speciesAtk} /공격력: {attackerAtkPower}</h3>
                        </div>

                    </div>
                    
                </div>
                <div className ="stateBox2">
                    <div style ={{paddingLeft: '10px', paddingTop: '20px'}}>
                        <div style = {{display : 'flex', alignItems : 'center', gap : '15px'}}>
                            <p><img src = {defenderImg} alt="Defender" style={{ width: '70px', height: '70px' }} /></p>
                            <DefenderHealth currentHealth={defenderLife} maxHealth={data.state.state.attacker.maxLife} barColor="#5B7FFF"/>
                        </div>
                        <div style = {{paddingLeft: '13px'}}>
                            <p>{defenderNickName} 님</p>
                        </div>
                        <div style = {{paddingLeft: '100px', fontSize: '15px'}}>
                            <h3>종족: {speciesDef} /수비력: {defenderDefPower}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Battle;

