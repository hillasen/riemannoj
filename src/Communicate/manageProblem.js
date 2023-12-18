import { fireAuth, fireStore, dataBase } from "../Firebase";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { ref, child, push, update, get } from "firebase/database";
import { getName } from "./Auth";

async function getProblem(id){
    console.log("ID:" + id)
    
    const docRef = doc(fireStore, "problems", id);
    const problem = await getDoc(docRef)

    if (!problem.exists()) {
        console.log('No such problem');
        return null;
    }
    else{
        console.log(problem.data())
        return problem.data();
    }
}

async function getProblemList(){
    async function getAuthority(){
        const querySnapshot = await getDocs(collection(fireStore, "problems"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
    }
}

async function submitProblem(problem, code, contest, subtask, score){
    if(contest != ""){
        let conte = await getContest(contest);
        const currentTime = new Date().getTime();
        if(conte.end.seconds *1000 < currentTime){
            alert("대회가 종료되었습니다!");
            return 0;
        }
    }
    let name = await getName();
    const user = fireAuth.currentUser
    if(user != null){
        const sendData = {problemId: problem.id, language: "cpp", code: code, user: name, memory: problem.memory, time: problem.time, contest: contest, subtask: subtask, score:score}
        const newProblemQueueKey = push(child(ref(dataBase), 'judgequeue')).key;
    
        const updates = {};
        updates['/judgequeue/' + newProblemQueueKey] = sendData;
    
        update(ref(dataBase), updates);
    }
    else{
        console.log("User must login to submit problem")
    }
}

async function getJudgeResultList(){
    const dbRef = ref(dataBase);
    let snapshot = await get(child(dbRef, `judgeresults`))
    if(snapshot.exists()){
        return snapshot.val();
    }
    else{
        console.log("No Data")
        return null;
    }

}

async function getContest(id){
    console.log("ID:" + id)
    
    const docRef = doc(fireStore, "contests", id);
    const contest = await getDoc(docRef)

    if (!contest.exists()) {
        console.log('No such problem');
        return null;
    }
    else{
        console.log(contest.data())
        return contest.data();
    }
}

async function isProblemExists(id){
    
    const docRef = doc(fireStore, "problems", id);
    const problem = await getDoc(docRef)
    if (!problem.exists()) {
        console.log("WW")
        return false;
    }
    else{
        return true;
    }
}

async function addProblem(problem){
    await setDoc(doc(fireStore, "problems", problem.id), problem);
}

export {getProblem, submitProblem, getJudgeResultList, getProblemList, getContest, isProblemExists, addProblem};