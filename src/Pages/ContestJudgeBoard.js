import React, { useEffect, useTransition } from "react";
import { useState } from "react";

import { getJudgeResultList } from "../Communicate/manageProblem";

import { fireAuth, dataBase } from "../Firebase";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";

import Table from 'react-bootstrap/Table';
import { useParams } from "react-router-dom";

export default function ContestJudgeBoard(){
    const [judgeResults, setJudgeResults] = useState({});
    const [isResultsLoaded, setisResultsLoaded] = useState(false);
    let {contestid} = useParams()

    const [board, setBoard] = useState("");
    const [queueboard, setqueueBoard] = useState("");
    const judgeRef = query(ref(dataBase, 'judgeresults'), orderByChild('contest'), equalTo(contestid));
    const judgequeueRef = query(ref(dataBase, 'judgequeue'), orderByChild('contest'), equalTo(contestid));

    
    useEffect(() => {
        onValue(judgeRef, (snapshot) => {
            const data = snapshot.val();
            getBoard(data);
          });
        onValue(judgequeueRef, (snapshot) => {
            const data = snapshot.val();
            getqueueBoard(data);
          });
    }, [])//re-render 방지, 꼭 array 붙여줘야함!

    async function getBoard(res){
        console.log(res)
        let tboard = <></>
        for(let i in res){
            var date = new Date(res[i].timestamp * 1000);
            console.log(date)
            let tmp = <><tr> <td>{date.toString()}</td> <td>{i}</td> <td>{res[i].user}</td> <td>{res[i].problemId}</td><td>{res[i].subtask}</td>  <td>{res[i].score}</td> <td>{res[i].result}</td> <td>{res[i].contest}</td></tr></>
            tboard = <>{tmp}{tboard}</>;
        }
        setBoard(<><Table bordered hover> <thead> <tr> <th>채점 시간</th>  <th>채점 결과 ID</th> <th>제출자</th> <th>문제 번호</th> <th>서브테스크 번호</th> <th>문제 배점</th>  <th>채점 결과</th>  <th>대회</th>  </tr></thead><tbody> {tboard} </tbody></Table></>);
    }
    async function getqueueBoard(res){
        console.log(res)
        let tboard = <></>
        for(let i in res){
            let tmp = <><tr> <td>{res[i].user}</td> <td>{res[i].problemId}</td>  <td>{res[i].subtask}</td> </tr></>
            tboard = <>{tmp}{tboard}</>;
        }
        setqueueBoard(<><Table bordered hover> <thead><tr> <th>제출자</th> <th>문제 번호</th> <th>서브테스크 번호</th>  </tr> </thead> <tbody>{tboard}</tbody></Table></>);
    }
    return(
        <div>
        <h1>{contestid} Judge Results Board!</h1>
        <h5>채점 대기 큐</h5>
        {queueboard}
        <h5>채점 결과</h5>
        {board}
        </div>
    );
}

/*
board = res.map(judge =>
            <li
              key={judge.judgeId}
            >
              {judge.result}
            </li>
          );
          */
         