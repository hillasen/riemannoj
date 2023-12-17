import {Reac, useState} from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { createUser } from "../Communicate/Auth";

export default function CreateUser(){
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function emailChangeHandler(event){
        setEmail(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    function nameChangeHandler(event){
        setName(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }

    function passwordChangeHandler(event){
        setPassword(event.currentTarget.value);
        console.log(event.currentTarget.value);
    }
    async function handleClick(){
        setIsLoading(true);
        await createUser(name, email, password)
        alert("OK!");
        setIsLoading(false);
    }
    if(isLoading){
        return(
            <h1>Loading..</h1>
        )
    }

    return(
        <div>
            <h1>Create User!</h1>
            <Form>
                <Form.Control id="name" aria-describedby="idHelpBlock" placeholder="Name" onChange={nameChangeHandler}/>
                <Form.Control id="email" aria-describedby="idHelpBlock" placeholder="Email" onChange={emailChangeHandler}/>
                <Form.Control type="password" id="password" aria-describedby="passwordHelpBlock" placeholder="PS(Problem Solving 이 아닙니다!)" onChange={passwordChangeHandler}/>
                <Button variant="primary" type="submit" onClick={handleClick}>Login</Button>
            </Form>
        </div>
    )
}