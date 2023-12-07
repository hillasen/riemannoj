import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { loginUser } from "../Communicate/Auth";

export default function Login(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let alertComponents = <></>;

    function emailChangeHandler(event){
        setEmail(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    function passwordChangeHandler(event){
        setPassword(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }
    async function handleClick(){
        setIsLoading(true);
        let isLoginSuccess = false;
        isLoginSuccess = await loginUser(email, password);
        setIsLoading(false);
        if(isLoginSuccess){
            navigate("/")
        }
        else{
            alertComponents = <></>
        }
    }
    if(isLoading){
        return(
            <h1>Loading..</h1>
        )
    }
    else{
    return (
        <div>
            {alertComponents}
            <Form>
            <Form.Control id="email" aria-describedby="idHelpBlock" placeholder="Email" onChange={emailChangeHandler}/>
            <Form.Control type="password" id="password" aria-describedby="passwordHelpBlock" placeholder="PS(Problem Solving 이 아닙니다!)" onChange={passwordChangeHandler}/>
            <Button variant="primary" type="submit" onClick={handleClick}>Login</Button>
            </Form>
        </div>
    );
    }
}