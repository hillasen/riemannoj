import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Register(){
    return (
        <div>
            <Form.Control id="inputId" aria-describedby="idHelpBlock" placeholder="ID"/>
            <Form.Control type="password" id="inputPassword5" aria-describedby="passwordHelpBlock" placeholder="PS(Problem Solving 이 아닙니다!)"/>
            <Button variant="primary">회원가입</Button>
        </div>
    );
}