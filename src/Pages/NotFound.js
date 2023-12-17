import React from "react";
import Alert from 'react-bootstrap/Alert';

export default function NotFound(){
    return (
        <>
        <Alert variant="danger">
            <Alert.Heading>404 Not Found</Alert.Heading>
            <p>
                존재하지 않는 페이지 입니다!
            </p>
        </Alert>
        <img src="img/kaguya.png"
         style={{ width: "500px", height: "300px" }}
          ></img>
        </>
    );
}