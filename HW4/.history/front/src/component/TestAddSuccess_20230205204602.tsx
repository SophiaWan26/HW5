import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Book} from './Book'
import axios from 'axios';

export default function TestAddSuccess() {
  
  const [id, setid] = useState("")
  const [author_id, setauthor_id] = useState("")
  const [title, settitle] = useState("")
  const [pub_year, setpub_year] = useState("")
  const [genre, setgenre] = useState("")
    
  const onChangeSetId= (e:any)=>{
    setid(e.target.value)
  }
  const onChangeSetAuthor_id= (e:any)=>{
    setauthor_id(e.target.value)
  }
  const onChangeSetTitle= (e:any)=>{
    settitle(e.target.value)
  }
  const onChangeSetPub_year= (e:any)=>{
    setpub_year(e.target.value)
  }

  const onChangeSetGenre= (e:any)=>{
    setgenre(e.target.value)
  }
  const addBookPost=()=>{
      if(!id ||!author_id||!title||!pub_year||!genre){
          window.alert("Please |fill in the complete book information")
          return
      }
    const data:Book={
      id:id,
      author_id:author_id,
      title:title,
      pub_year:pub_year,
      genre : genre
    }
    console.log(data)
 axios.post("http://192.168.1.2:3000/book",data).then((res =>{
      console.log(res.data)
      if(res.data.message==="insert id"){
        window.alert("book add successfully ")
      }
      }
    )).catch((res)=>{
        window.alert("error => book id or author id is exist, Please re-enter")
        setid("")
        setauthor_id("")
        settitle("")
        setpub_year("")
        setgenre("")
      })
  }
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="author id" variant="outlined" value={id} onChange={onChangeSetId} />
      <TextField id="outlined-basic" label="author id" variant="outlined" value={author_id} onChange={ onChangeSetAuthor_id} />
      <TextField id="outlined-basic" label="author id" variant="outlined" value={title} onChange={ onChangeSetTitle}/>
      <TextField id="filled-basic" label="title" variant="filled" value={pub_year} onChange={ onChangeSetPub_year} />
      <TextField id="standard-basic" label="pub_year" variant="standard" value={pub_year} onChange={onChangeSetPub_year}/>
      <TextField id="standard-basic" label="genre" variant="standard" value={genre}  onChange={onChangeSetGenre}/>
    </Box>

  );
}
