import React from "react";
import { useState } from "react";
import queryString from 'query-string';
import { useParams, useLocatio, useNavigate } from "react-router-dom";
import { fireAuth } from "../Firebase";

import { getProblem, submitProblem } from "../Communicate/manageProblem";

import CodeMirror from "@uiw/react-codemirror";

import Button from 'react-bootstrap/Button';

export default function Problem(){
    const [problem, setProblem] = useState({});
    const [problemloaded, setProblemloaded] = useState(false);
    const [code, setCode] = useState("");
    const navigate = useNavigate();

    let { problemid } = useParams(); //router 에 추가한것과 이름이 일치해야함!

    async function getProblemFromDb(){
        if(!problemloaded){
            let pb = await getProblem(problemid)
            console.log(pb)
            setProblemloaded(true)
            setProblem(pb)
        }
    }

    async function codeSubmit(){
        if(fireAuth.currentUser != null){
            for(let i=0;i<problem.subtask.length;i++){
                console.log(JSON.parse(problem.subtask[i]))
                await submitProblem(problem, code, "", i+1, JSON.parse(problem.subtask[i])["score"]);
            }
            navigate("/judgeboard")
        }
        else{
            alert("제출을 위해선 로그인이 필요합니다!")
            navigate("/login")
        }
    }
    getProblemFromDb()
    return (
        <div>
        <h1>{problem.name}</h1>
        <div dangerouslySetInnerHTML={ {__html: problem.problem} }></div>
        <p>{problem.input}</p>
        <p>{problem.output}</p>
        <CodeMirror value={code} name="codeInput" height="400px" onChange={(value, viewUpdate) => {setCode(value)}}/>
        <Button variant="primary" onClick={codeSubmit}>제출</Button>
        </div>
    );
}