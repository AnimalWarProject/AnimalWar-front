import { useState } from "react";


const Skill = () => {
    const [selectSkills, setSelectSkills] = useState({
        attackSkill: null,
        defensiveSkill: null,
        utilitySkill: null,
    });

    const handleSkillSelection = (skillType, selectSkill) => {
        selectSkills({...selectSkills, [skillType]: selectSkill});
    };

    const sendDataToServer = () => {
        fetch('http://localhost:3000/battle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectSkills),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error: ', error)
            })
    }
}
export default Skill;