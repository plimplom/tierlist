import React, {FC, useState} from 'react'
import './App.css'
import {Button, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography} from "@mui/material";

interface VoteData {
  [rating: number]: number
}

function App() {
  const [weights, setWeights] = useState({1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1})
  const [numberOfVoters, setNumberOfVoters] = useState(0)

  const handleVotersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex

    if (event.target.value === '' || re.test(event.target.value)) {
      setNumberOfVoters(Number(event.target.value))
    }
  }

  return (
      <>
        <TextField value={numberOfVoters} onChange={handleVotersChange}/>

        {numberOfVoters !== 0 && <DisplayVotes numberOfVoters={numberOfVoters} weights={weights}/>}
      </>
  )
}

interface DisplayVotesProps {
  numberOfVoters: number
  weights: VoteData
}

const DisplayVotes: FC<DisplayVotesProps> = ({numberOfVoters, weights}) => {
  const [voteData, setVoteDate] = useState<VoteData>({})
  let rating = 0
  let total = 0

  for (const voteDataKey in voteData) {
    console.log(voteData, voteDataKey)
    rating += voteData[voteDataKey] * voteDataKey
    total += voteData[voteDataKey]
  }

  const handleChange = (event: SelectChangeEvent, index: number) => {
    setVoteDate({...voteData, [index]: Number(event.target.value)});
  };

  const onButton = (change: number, index: number) => {
    let thisVoteData = voteData[index]
    if (!thisVoteData) {
      thisVoteData = 1
    } else {
      thisVoteData += change;
    }
    setVoteDate({...voteData, [index]: thisVoteData});
  }

  return <>
    {["S", "A", "B", "C", "D", "F"].map((item, index) => (
        <div key={item}>
          <Stack direction={"row"} spacing={2}>
            <InputLabel>{item}</InputLabel>
            <Button onClick={() => onButton(-1, index)} disabled={voteData[index] == undefined || voteData[index] == 0}>-1</Button>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={voteData[index] ? String(voteData[index]) : "0"}
                label="Age"
                onChange={(event) => handleChange(event, index)}
            >
              {Array.from({length: numberOfVoters + 1}, (_, i) => i).map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </Select>
            <Button onClick={() => onButton(1, index)} disabled={voteData[index] >= numberOfVoters}>+1</Button>
          </Stack>
        </div>
    ))}
    <Button onClick={() => setVoteDate({})}>Reset</Button>
    <Typography>{rating/total}</Typography>
  </>
}

export default App
