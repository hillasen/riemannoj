import React from "react";
import { useState } from "react";
import queryString from 'query-string';

import { useParams, useLocation } from "react-router-dom";

import { getProblem, submitProblem } from "../Communicate/manageProblem";

import Button from 'react-bootstrap/Button';

export default function Problem(){
    const [problem, setProblem] = useState({});
    const [problemloaded, setProblemloaded] = useState(false);
    const [code, setCode] = useState(false);

    let { problemid } = useParams(); //router 에 추가한것과 이름이 일치해야함!

    async function getProblemFromDb(){
        if(!problemloaded){
            let pb = await getProblem(problemid)
            console.log(pb)
            setProblemloaded(true)
            setProblem(pb)
        }
    }

    function codeChangeHandler(event){
        setCode(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    async function codeSubmit(){
        await submitProblem(problem, code);
    }

    getProblemFromDb()
    return (
        <div>
        <h1>{problem.name}</h1>
        <p>{problem.problem}</p>
        <p>{problem.input}</p>
        <p>{problem.output}</p>
        <textarea name="codeInput" onChange={codeChangeHandler}/>
        <Button variant="primary" onClick={codeSubmit}>제출</Button>
        </div>
    );
}