import React, { useEffect, useTransition } from "react";
import { useState } from "react";

import { getJudgeResultList } from "../Communicate/manageProblem";

import { fireAuth, dataBase } from "../Firebase";
import { ref, onValue } from "firebase/database";

import Table from 'react-bootstrap/Table';

export default function JudgeBoard(){
    const [judgeResults, setJudgeResults] = useState({});
    const [isResultsLoaded, setisResultsLoaded] = useState(false);
    const [board, setBoard] = useState("");
    const judgeRef = ref(dataBase, 'judgeresults');
    
    useEffect(() => {
        onValue(judgeRef, (snapshot) => {
            const data = snapshot.val();
            getBoard(data);
          });
    }, [])//re-render 방지, 꼭 array 붙여줘야함!

    async function getBoard(res){
        console.log(res)
        let tboard = <></>
        for(let i in res){
            var date = new Date(res[i].timestamp * 1000);
            console.log(date)
            let tmp = <><tr> <td>{date.toString()}</td> <td>{i}</td> <td>{res[i].user}</td> <td>{res[i].problemId}</td> <td>{res[i].result}</td> </tr></>
            tboard = <>{tmp}{tboard}</>;
        }
        setBoard(<><Table bordered hover> <thead> <tr> <th>채점 시간</th>  <th>채점 결과 ID</th> <th>제출자</th> <th>문제 번호</th> <th>채점 결과</th> </tr></thead><tbody> {tboard} </tbody></Table></>);
    }

    return(
        <div>
        <h1>Judge Results Board!</h1>
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
         