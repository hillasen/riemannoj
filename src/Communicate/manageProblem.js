import { fireAuth, fireStore, dataBase } from "../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { ref, child, push, update, get } from "firebase/database";

async function getProblem(id){
    console.log("ID:" + id)
    
    const docRef = doc(fireStore, "problems", id);
    const problem = await getDoc(docRef)

    if (!problem.exists) {
        console.log('No such problem');
        return null;
    }
    else{
        console.log(problem.data())
        return problem.data();
    }
}

async function getProblemList(){

}

async function submitProblem(problem, code){
    const sendData = {problemId: problem.id, language: "cpp", code: code, user: "test@test.com", memory: problem.memory, time: problem.time}
    const newProblemQueueKey = push(child(ref(dataBase), 'judgequeue')).key;

    const updates = {};
    updates['/judgequeue/' + newProblemQueueKey] = sendData;

    update(ref(dataBase), updates);
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

export {getProblem, submitProblem, getJudgeResultList, getProblemList};