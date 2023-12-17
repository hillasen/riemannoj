import { useState, React, useEffect } from "react";
import { fireAuth, fireStore, storage } from "../Firebase";
import { getAuthority } from "../Communicate/Auth";
import { isProblemExists, addProblem } from "../Communicate/manageProblem";
import { useNavigate } from "react-router-dom";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import AuthorityChecking from "../Components/AuthorityChecking";
import LowAuthority from "../Components/LowAuthority";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function CreateProblem({useremail}){
    const navigate = useNavigate();
    const modules = {
        toolbar: {
          container: [
            ["image"],
            [{ header: [1, 2, 3, 4, 5, false] }],
            ["bold", "underline" , "italic", "strike"],
          ],
        },
      };
    
    const [role, setRole] = useState("");
    const [problemid, setProblemid] = useState("");
    const [problemname, setProblemname] = useState("");
    const [problemscore, setProblemscore] = useState("");
    const [probleminfo, setProbleminfo] = useState("");
    const [probleminputinfo, setProbleminputinfo] = useState("");
    const [problemoutputinfo, setProblemoutputinfo] = useState("");
    const [problemtime, setProblemtime] = useState("");
    const [problemmemory, setProblemmemory] = useState("");
    const [problemsubtaskjson, setProblemsubtaskjson] = useState("");
    const [probleminputexample, setProbleminputexample] = useState("");
    const [problemoutputexample, setProblemoutputexample] = useState("");

    const exampleJson = "[{\"explanation\":\"0 < A, B < 10\", \"score\": 50}, {\"explanation\":\"0 < A, B < 20\", \"score\": 50}]"
    const exampleInput = "[\"1, 2\", \"3, 4\"]"
    const exampleOutput = "[\"3\", \"7\"]"

    function isFull(){
        if(problemid == "" || problemname == "" || problemscore == "" || probleminfo == "" || probleminputinfo == "" || problemoutputinfo == "" || problemtime == "" || problemmemory == "" || problemsubtaskjson == "" || probleminputexample == "" || problemoutputexample == ""){
            return false;
        }
        return true;
    }

    function problemToJson(){
        let prob = {};
        prob["id"] = problemid;
        prob["name"] = problemname;
        prob["score"] = Number(problemscore);
        prob["problem"] = probleminfo;
        prob["input"] = probleminputinfo;
        prob["output"] = problemoutputinfo;
        prob["time"] = Number(problemtime);
        prob["memory"] = Number(problemmemory);
        prob["subtask"] = JSON.parse(problemsubtaskjson);
        prob["example_input"] = JSON.parse(probleminputexample);
        prob["example_output"] = JSON.parse(problemoutputexample);
        console.log(prob);
        return prob;
    }

    async function onSubmitted(){
        if(!isFull()){
            alert("모든 항목을 다 채워주세요!");
        }
        else{
            const prob = problemToJson()
            addProblem(prob);
            alert("문제 추가 완료!");
            navigate("/problem/"+problemid);
        }
    }

    async function idExistsHandler(){
        let res = await isProblemExists(problemid);
        if(res){
            alert("이미 존재하는 ID 입니다! 바꿔주세요!")
        }
        else{
            alert("사용 가능한 ID 입니다!")
        }
    }

    fireAuth.onAuthStateChanged(async function(user) {
        if (user) {
           let authority = await getAuthority()
           console.log(authority)
           setRole(authority)
        } else {
            setRole("No");
        }
      });
    if(role == ""){
        return(
            <AuthorityChecking></AuthorityChecking>
        )
    }
    if(role == "admin" || role == "editor"){
        return(
            <div>
                <h1>Create Problem!</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>문제 ID</Form.Label>
                        <Form.Control placeholder="숫자 4~6자리" onChange={(event) => {setProblemid(event.currentTarget.value)}}/>
                    </Form.Group>
                    <Button variant="primary" onClick={idExistsHandler}>ID 중복확인</Button>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>문제 이름</Form.Label>
                        <Form.Control placeholder="문제 제목"onChange={(event) => {setProblemname(event.currentTarget.value)}}  />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>점수(총)</Form.Label>
                        <Form.Control placeholder="100" onChange={(event) => {setProblemscore(event.currentTarget.value)}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>문제 설명</Form.Label>
                        <ReactQuill
                        style={{ width: "100%", height: "500px" }}
                        onChange={(contents) => {setProbleminfo(contents);}}
                        modules={modules}
                         />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>입력</Form.Label>
                        <Form.Control as="textarea" rows={3}  placeholder="입력 조건을 작성하세요"onChange={(event) => {setProbleminputinfo(event.currentTarget.value)}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>출력</Form.Label>
                        <Form.Control as="textarea" rows={3}  placeholder="출력 조건을 작성하세요" onChange={(event) => {setProblemoutputinfo(event.currentTarget.value)}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>시간제한(초)</Form.Label>
                        <Form.Control placeholder="2"  onChange={(event) => {setProblemtime(event.currentTarget.value)}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>메모리 제한(MB)</Form.Label>
                        <Form.Control placeholder="128" onChange={(event) => {setProblemmemory(event.currentTarget.value)}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>서브테스크 JSON</Form.Label>
                        <Form.Control as="textarea" rows={3}  placeholder={exampleJson} onChange={(event) => {setProblemsubtaskjson(event.currentTarget.value)}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>입력예시 Array</Form.Label>
                        <Form.Control as="textarea" rows={3}  placeholder={exampleInput}onChange={(event) => {setProbleminputexample(event.currentTarget.value)}} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>출력예시 Array</Form.Label>
                        <Form.Control as="textarea" rows={3}  placeholder={exampleOutput}onChange={(event) => {setProblemoutputexample(event.currentTarget.value)}} />
                    </Form.Group>
                    <Button variant="primary" onClick={onSubmitted}>문제 등록</Button>
                </Form>
            </div>
        );
    }
    return(
        <LowAuthority></LowAuthority>
    );
}