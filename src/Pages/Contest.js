import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getContest, getProblem } from "../Communicate/manageProblem";
import Table from 'react-bootstrap/Table';

export default function Contest(){
    const navigate = useNavigate();
    const [contest, setContest] = useState({});
    const [problems, setProblems] = useState(<></>);
    let { contestid } = useParams(); 

    function problemMover(id){
        navigate("/problem/" + id + "/" + contestid);
    }

    useEffect(() => {
        async function loadCont(){
            let tboard = <></>
            let cont = await getContest(contestid);
            setContest(cont);
            console.log("B")
            console.log(cont.problems)
            for(let i of cont.problems){
                console.log("A")
                let pd = await getProblem(i)
                console.log(pd)
                console.log("P: " + i)
                let tmp = <><tr onClick={() => {problemMover(i)}}> <td>{i}</td> <td>{pd ? pd.name : '존재하지 않는 문제입니다'}</td></tr></>
                tboard = <>{tboard}{tmp}</>;
            }
            console.log(new Date(cont.start.seconds * 1000))
            setProblems(<><Table bordered hover> <thead><tr> <th>문제 아이디</th> <th>문제 이름</th> </tr> </thead> <tbody>{tboard}</tbody></Table></>);
        }
        loadCont();
    }, [contestid]);
    return(
        <>
            <h1>{contest.name}</h1>
            <h4>{contest.info}</h4>
            {problems}
        </>
    );
}