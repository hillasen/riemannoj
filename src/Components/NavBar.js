import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

export default function NavBar({user}){
    let userMenu;
    if(user == null){
        userMenu = <Nav.Link href="/login">로그인</Nav.Link>
    }
    else{
        userMenu = <><Nav.Link href="/logout">로그아웃</Nav.Link> <Nav.Link href="/mypage">{user.email}</Nav.Link></>
    }
    return(
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">리만 OJ</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">홈</Nav.Link>
            <Nav.Link href="/problems">문제</Nav.Link>
            <Nav.Link href="/contests">대회</Nav.Link>
            <Nav.Link href="/judgeboard">채점 현황</Nav.Link>
            {userMenu}
          </Nav>
        </Container>
      </Navbar>
    );
}