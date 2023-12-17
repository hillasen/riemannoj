import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, getAuth, updatePassword } from "firebase/auth";
import { fireAuth } from "../Firebase";
import { fireStore } from "../Firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

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

async function createUser(name, email, password){
  await createUserWithEmailAndPassword(fireAuth, email, password);
  await setDoc(doc(fireStore, "authority", email), {
    name: name,
    role: "user"
  });
}

async function getAuthority(){
  const docRef = doc(fireStore, "authority", fireAuth.currentUser.email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().role;
  } else {
    return "noauth"
  }
}

async function getName(){
  const docRef = doc(fireStore, "authority", fireAuth.currentUser.email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().name;
  } else {
    return "noname"
  }
}


async function logoutUser(){
  await signOut(fireAuth);
}

export {loginUser, logoutUser, getAuthority, getName, createUser};