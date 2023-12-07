import React, { useTransition } from "react";
import { useState } from "react";

import { getJudgeResultList } from "../Communicate/manageProblem";

export default function JudgeBoard(){
    const [judgeResults, setJudgeResults] = useState({});
    const [isResultsLoaded, setisResultsLoaded] = useState(false);
    const [board, setBoard] = useState("");
    
    async function getBoard(){
        if(!isResultsLoaded){
            setisResultsLoaded(true);
            let res = await getJudgeResultList();
            setJudgeResults(res);
            console.log(res)
            let tmpBoard = "";
            for(let i in res){
                console.log(res[i]);
                tmpBoard = res[i].judgeId + "/" + res[i].result + "|" + tmpBoard;
            }
            setBoard(tmpBoard);
        }
    }
    getBoard();

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
         