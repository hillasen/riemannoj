import React from "react";
import Alert from 'react-bootstrap/Alert';
import { loginUser, logoutUser } from '../Communicate/Auth';

export default function Logout(){
    logoutUser();
    return (
        <Alert variant="success">
            <Alert.Heading>로그아웃 완료</Alert.Heading>
            <p>
                로그아웃에 성공했어요!
            </p>
        </Alert>
    );
}