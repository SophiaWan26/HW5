import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Book} from './Book'
import axios from 'axios';
import Button from '@mui/material/Button'
import { Alert } from '@mui/material';

type Props = {
  backShowListPagh: () => void;
  id:string
}
export default function EditBook(prop :Props) {
const {backShowListPagh,id}=prop;
  
  const [author_id, setauthor_id] = useState("")
  const [title, settitle] = useState("")
  const [pub_year, setpub_year] = useState("")
  const [genre, setgenre] = useState("")
    
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
  const PutUpdateBook=()=>{
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
 axios.put("http://localhost:3000/updateBook",data).then((res =>{
      console.log(res.data)
                    if(res.data=="token undefined"){
                  window.alert("please login")
                     return 
                    }
      if(res.status==200){
        window.alert("book  update success")
      }
      }
    )).catch((res)=>{
        window.alert("error => book id or author id is exist, Please re-enter")
        setauthor_id("")
        settitle("")
        setpub_year("")
        setgenre("")
      })
  }
  return (
      <div>
    <div>
  <h1> Book id : {id} 
      </h1>
    </div>
      <TextField id="outlined-basic" label="author id" variant="outlined" value={author_id} onChange={ onChangeSetAuthor_id} />
      <br/>
      <TextField id="outlined-basic" label="title" variant="outlined" value={title} onChange={ onChangeSetTitle}/>
      <br/>
      <TextField id="standard-basic" label="pub_year" variant="standard" value={pub_year} onChange={onChangeSetPub_year}/>
      <br/>
      <TextField id="standard-basic" label="genre" variant="standard" value={genre}  onChange={onChangeSetGenre}/>
      <br/>
     < div>
      <Button variant='contained'color="success" onClick={backShowListPagh}>Back</Button>
      </div>
     < div>
      <Button variant='contained'color="success" onClick={PutUpdateBook}>Commit</Button>
      </div>
      </div>

  );
}
