import React from "react";
import { useState } from "react";
import queryString from 'query-string';
import { useParams, useLocatio, useNavigate } from "react-router-dom";
import { fireAuth } from "../Firebase";

import { getProblem, submitProblem } from "../Communicate/manageProblem";

import CodeMirror from "@uiw/react-codemirror";

import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function Problem(){
    const [problem, setProblem] = useState({});
    const [problemloaded, setProblemloaded] = useState(false);
    const [code, setCode] = useState("");
    const [inputOutputExample, setInputOutputExample] = useState(<></>)
    const [subtaskExample, setSubtaskExample] = useState(<></>)
    const navigate = useNavigate();

    let { problemid } = useParams(); //router 에 추가한것과 이름이 일치해야함!

    function setInputOutputExampleTable(inp, out){
        let tboard = <></>
        console.log(inp)
        for(let i=0; i<inp.length;i++){
            console.log(inp[i])
            inp[i] = inp[i].replace(/(?:\r\n|\r|\n)/g, '<br/>');
            out[i] = out[i].replace(/(?:\r\n|\r|\n)/g, '<br/>');
            let tmp = <><tr style={{"white-space": "pre-wrap"}}> <td>{(i+1).toString() + "번 입력"}</td> <td dangerouslySetInnerHTML={ {__html: inp[i]} }></td> </tr> <tr> <td>{(i+1).toString() + "번 출력"}</td> <td dangerouslySetInnerHTML={ {__html: out[i]} }></td> </tr></>
            tboard = <>{tboard}{tmp}</>;
        }
        setInputOutputExample(<><Table bordered hover> <thead><tr> <th>번호</th> <th>데이터</th>  </tr> </thead> <tbody>{tboard}</tbody></Table></>);
  
    }

    function setSubtaskExampleTable(subs){
        let tboard = <></>
        console.log(subs)
        for(let i=0; i<subs.length;i++){
            console.log(subs[i])
            subs[i].explanation = subs[i].explanation.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            let tmp = <><tr style={{"white-space": "pre-wrap"}}> <td>{(i+1).toString()}</td> <td>{subs[i].explanation}</td> <td>{subs[i].score}</td> </tr></>
            tboard = <>{tboard}{tmp}</>;
        }
        setSubtaskExample(<><Table bordered hover> <thead><tr> <th>번호</th> <th>설명</th> <th>점수</th>  </tr> </thead> <tbody>{tboard}</tbody></Table></>);
  
    }

    async function getProblemFromDb(){
        if(!problemloaded){
            let pb = await getProblem(problemid)
            console.log(pb)
            if(pb == null){
                alert("문제가 존재하지 않습니다!")
                setProblemloaded(true)
                navigate("/");
            }
            else{
                setProblemloaded(true)
                setProblem(pb)
                setInputOutputExampleTable(pb.example_input, pb.example_output);
                setSubtaskExampleTable(pb.subtask)
            }
        }
    }

    async function codeSubmit(){
        if(fireAuth.currentUser != null){
            for(let i=0;i<problem.subtask.length;i++){
                console.log(problem.subtask[i]["score"])
                await submitProblem(problem, code, "", i+1, problem.subtask[i]["score"]);
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
        <p>시간제한: {problem.time}초 / 메모리 제한: {problem.memory}MB</p>
        <h4>문제</h4>
        <div dangerouslySetInnerHTML={ {__html: problem.problem} }></div>
        <h4>입력</h4>
        <p>{problem.input}</p>
        <h4>출력</h4>
        <p>{problem.output}</p>
        {inputOutputExample}
        {subtaskExample}
        <CodeMirror value={code} name="codeInput" height="400px" onChange={(value, viewUpdate) => {setCode(value)}}/>
        <Button variant="primary" onClick={codeSubmit}>제출</Button>
        </div>
    );
}