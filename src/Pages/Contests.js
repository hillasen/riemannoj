import {React, useState} from 'react'
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function Contests(){
    const navigate = useNavigate();

    function moveTo(){
        navigate("/contest/christmas")
    }
    return(
        <>
        <h1>Contests</h1>
        <h2>크리스마스 코딩파티 진행중!!</h2>
        <Button variant="primary" onClick={moveTo}>이동하기!</Button>
        </>
    );
}