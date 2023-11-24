import AttackerSkill from "./AttackerSkill";
import DefenderSkill from "./DefenderSkill";
import {useState} from "react";

const SkillSelect = () => {
    const [flag,setFlag] = useState(1);

    if (flag === 1) {
        return <AttackerSkill setFlag={setFlag} />;
    } else {
        return <DefenderSkill setFlag={setFlag} />;
    }


}

export default SkillSelect