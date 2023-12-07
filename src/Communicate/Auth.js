import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, getAuth, updatePassword } from "firebase/auth";
import { fireAuth } from "../Firebase";

async function loginUser(email, password){
    try {
        const userLoginInfo = await signInWithEmailAndPassword(fireAuth, email, password);
        console.log(userLoginInfo.user);
        return true;
      } catch (error) {
        console.log(error.message);
        return false;
      }
}

async function logoutUser(){
  await signOut(fireAuth);
}

export {loginUser, logoutUser};