import { useParams } from "react-router-dom";


import { fireAuth, dataBase } from "../Firebase";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { React, useEffect, useState } from "react";

import Table from 'react-bootstrap/Table';


export default function ContestRanking(){

    const [rankboard, setRankboard] = useState(<></>)


    function deleteDuplication(records){
        const uniqueSubmissions = new Map();
        let returnRecord = []
        for(let i=0;i<records.length;i++){
            const record = records[i];
            const key = `${record.user}-${record.problemId}-${record.subtask}`;
            if(record.result == "Correct"){
                if(!uniqueSubmissions.has(key) || uniqueSubmissions.get(key).timestamp > record.timestamp){
                    uniqueSubmissions.set(key, record);
                }
            }
            else{
                returnRecord.push(record)
            }
        }
        const iterator = uniqueSubmissions.entries();
        for (const entry of iterator) {
            const [key, value] = entry;
            returnRecord.push(value);
        }
        return returnRecord;
    }

    function getUniqueValues(array, property) {
        const uniqueValues = new Set();
      
        for (const item of array) {
          const value = item[property];
          uniqueValues.add(value);
        }
      
        return Array.from(uniqueValues);
    }

    function sumScoresByNameAndResult(array, targetName) {
        let totalScore = 0;
      
        for (let i = 0; i < array.length; i++) {
          const item = array[i];
          console.log(item)
          if (item.user === targetName && item.result === 'Correct') {
            totalScore += item.score;
          }
        }
      
        return totalScore;
    }

    function totalCorrected(array, targetName) {
        let corrected = []
      
        for (let i = 0; i < array.length; i++) {
          const item = array[i];
          console.log(item)
          if (item.user === targetName && item.result === 'Correct' && corrected.indexOf(item.problemId) == -1) {
            corrected.push(item.problemId);
          }
        }
      
        return corrected
    }

    function sumSubmitted(array, targetName) {
        let totalSubmitted = 0;
      
        for (let i = 0; i < array.length; i++) {
          const item = array[i];
          console.log(item)
          if (item.user === targetName) {
            totalSubmitted += 1
          }
        }
      
        return totalSubmitted;
    }

    function compareFunction(a, b) {
        if (a.score < b.score) {
            return 1; // 더 높은 score가 더 앞으로
        } else if (a.score > b.score) {
            return -1; // 더 높은 score가 더 뒤로
        } else {
            // score가 같은 경우 submittedCount로 비교
            return a.submittedCount - b.submittedCount;
        }
    }

    async function getRankBoard(res){
        console.log(res)
        let rankCount = 1;
        let tboard = <></>
        for(let i=0;i<res.length;i++){
            if(i != 0 && (res[i-1].score != res[i].score || res[i-1].submittedCount != res[i].submittedCount)){
                rankCount += 1;
            }
            let tmp = <><tr> <td>{rankCount}</td><td>{res[i].user}</td> <td>{res[i].score}</td>  <td>{res[i].submittedCount}</td>  <td>{res[i].corrected.toString()}</td>  </tr></>
            tboard = <>{tboard}{tmp}</>;
        }
        setRankboard(<><Table bordered hover> <thead><tr><th>순위</th> <th>사용자</th> <th>점수</th> <th>제출횟수</th>  <th>해결한 문제</th> </tr> </thead> <tbody>{tboard}</tbody></Table></>);
    }

    function calculateRankings(submissionRecords){
        const records = Object.values(submissionRecords);
        const deleted = deleteDuplication(records);
        const participants = getUniqueValues(deleted, "user")
        const scoreResult = []
        for(let i=0;i<participants.length;i++){
            console.log(sumScoresByNameAndResult(deleted, participants[i]))
            console.log(sumSubmitted(deleted, participants[i]))
            let data = {
                user: participants[i],
                score: sumScoresByNameAndResult(deleted, participants[i]),
                submittedCount: sumSubmitted(deleted, participants[i]),
                corrected: totalCorrected(deleted, participants[i])
            };
            console.log(data)
            scoreResult.push(data)
        }
        scoreResult.sort(compareFunction);
        console.log(scoreResult);
        getRankBoard(scoreResult)
    }

    let {contestid} = useParams()
    const judgeRef = query(ref(dataBase, 'judgeresults'), orderByChild('contest'), equalTo(contestid));

    useEffect(() => {
        onValue(judgeRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            calculateRankings(data);
          });
    }, [])//re-render 방지, 꼭 array 붙여줘야함!

    return(
        <div>
            <h1>Ranking!</h1>
            {rankboard}
        </div>
        
    );
}