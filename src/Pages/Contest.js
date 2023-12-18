import React from "react";
import { useParams, useNavigate, useAsyncError } from "react-router-dom";
import { useEffect, useState } from "react";

import { getContest, getProblem } from "../Communicate/manageProblem";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


export default function Contest(){
    const navigate = useNavigate();
    const [contest, setContest] = useState({});
    const [problems, setProblems] = useState(<></>);
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    let { contestid } = useParams(); 
    const [isTimeElapsed, setIsTimeElapsed] = useState(false);

    

    function problemMover(id){
        navigate("/problem/" + id + "/" + contestid);
    }

    function rankingMover(){
        navigate("/ranking/" + contestid);
    }

    function judgeMover(){
        navigate("/judgeboard/" + contestid);
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
            setStartTime(new Date(cont.start.seconds * 1000));
            setEndTime(new Date(cont.end.seconds * 1000));
            setProblems(<><Table bordered hover> <thead><tr> <th>문제 아이디</th> <th>문제 이름</th> </tr> </thead> <tbody>{tboard}</tbody></Table></>);

            const targetTime = new Date(cont.end.seconds * 1000)
  
            // 1초마다 실행되는 함수
            const intervalID = setInterval(() => {
              // 현재 시간
              const currentTime = new Date().getTime();
        
              // 주어진 시간이 지났는지 확인
              if (currentTime > targetTime) {
                // 지났으면 상태 업데이트
                setIsTimeElapsed(true);
                // 타이머 해제
                clearInterval(intervalID);
              }
            }, 1000);
        
            // 컴포넌트가 언마운트될 때 타이머 해제
            return () => clearInterval(intervalID);
        }
        loadCont();
    }, [contestid]);

    if(startTime > new Date()){
        return(
            <>
            <h1>대회 시작 전입니다!</h1>
            </>
        )
    }
    if(isTimeElapsed){
        return(
            <>
            <h1>대회가 종료되었습니다!</h1>
            </>
        )
    }
    return(
        <>
            <h1>{contest.name}</h1>
            <h4>{contest.info}</h4>
            <Button variant="primary" onClick={rankingMover}>랭킹</Button>
            <Button variant="primary" onClick={judgeMover}>채점기록</Button>
            <h4>시작: {startTime.toString()}</h4>
            <h4>종료: {endTime.toString()}</h4>
            {problems}
        </>
    );
}