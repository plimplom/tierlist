import React, {ChangeEvent, FC, useState} from 'react'
import './App.css'
import {Button, Checkbox, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography} from "@mui/material";

interface VoteData {
  [rating: number]: number
}

interface VoteData2 {
  [rating: number]: string
}

function App() {
  const [numberOfVoters, setNumberOfVoters] = useState(0)

  const handleVotersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;

    if (event.target.value === '' || re.test(event.target.value)) {
      setNumberOfVoters(Number(event.target.value))
    }
  }

  return (
      <>
        <TextField value={numberOfVoters} onChange={handleVotersChange} label={"Teilnehmer"}/>

        {numberOfVoters !== 0 && <DisplayVotes numberOfVoters={numberOfVoters}/>}
      </>
  )
}

interface DisplayVotesProps {
  numberOfVoters: number
}

const DisplayVotes: FC<DisplayVotesProps> = ({numberOfVoters}) => {
  const [weights, setWeights] = useState<VoteData2>({0: "1", 1: "1", 2: "1", 3: "1", 4: "1", 5: "1"})
  const [voteData, setVoteDate] = useState<VoteData>({})
  const [mirrorWeights, setMirrorWeights] = useState(false)
  let numberVotes = 0

  for (const voteDataKey in voteData) {
    numberVotes += voteData[voteDataKey]
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

  const onWeightChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    let val = event.target.value
    const re = /^\d*[.,]?\d*$/;

    if (val === '' || re.test(val)) {
      if(mirrorWeights){
        setWeights({...weights, [5-index]: val, [index]: val})
      }else{
        setWeights({...weights, [index]: val})
      }
    }s
  }

  const onWeightBlur = (index: number) => {
    const currentVal = weights[index]

    if (currentVal.length === 0) {
      if(mirrorWeights){
        setWeights({...weights, [5-index]: "1", [index]: "1"})
      }else{
        setWeights({...weights, [index]: "1"})
      }
    }
  }

  const mapToRating = (res: number): string => {
    switch (Math.round(res)) {
      case 1:
        return "S"
      case 2:
        return "A"
      case 3:
        return "B"
      case 4:
        return "C"
      case 5:
        return "D"
      case 6:
        return "F"
      default:
        return String(res)
    }
  }

  const calculateRating = (): string => {
    let voteWeight = 0
    let rating = 0

    for (const voteDataKey in voteData) {
      const numVotes = Number(voteData[voteDataKey])
      const weight = Number(weights[Number(voteDataKey) + 1].replace(",", "."))

      voteWeight += numVotes * weight
      rating += numVotes * weight * (Number(voteDataKey) + 1)
    }

    const res = rating / voteWeight
    return isNaN(res) || !isFinite(res) ? "-" : mapToRating(res)
  }

  return <>
    <Checkbox value={mirrorWeights} checked={mirrorWeights} onChange={(event)=>setMirrorWeights(event.target.checked)}/>
    {["S", "A", "B", "C", "D", "F"].map((item, index) => (
        <div key={item}>
          <Stack direction={"row"} spacing={2}>
            <TextField value={String(weights[index])} onChange={(event) => onWeightChange(event, index)}
                       onBlur={() => onWeightBlur(index)} disabled={mirrorWeights&&index>2}/>
            <InputLabel>{item}</InputLabel>
            <Button onClick={() => onButton(-1, index)} disabled={voteData[index] == undefined || voteData[index] == 0}>-1</Button>
            <Select
                value={voteData[index] ? String(voteData[index]) : "0"}
                onChange={(event) => handleChange(event, index)}
            >
              {Array.from({length: numberOfVoters + 1}, (_, i) => i).map(value => <MenuItem key={value} value={value}
                                                                                            disabled={value > numberOfVoters - numberVotes}>{value}</MenuItem>)}
            </Select>
            <Button onClick={() => onButton(1, index)}
                    disabled={voteData[index] >= numberOfVoters || numberVotes >= numberOfVoters}>+1</Button>
          </Stack>
        </div>
    ))}
    <Button onClick={() => setVoteDate({})}>Reset</Button>
    <Typography>{calculateRating()}</Typography>
  </>
}

export default App
