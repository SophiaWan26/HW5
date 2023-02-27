import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Book} from './Book'
import axios from 'axios';
import Button from '@mui/material/Button';

type Props = {
  backShowListPagh: () => void;
}
export default function TestAddSuccess(props: Props) {
  const {backShowListPagh} = props;
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
  const TestDataAddTest=()=>{
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
 axios.get("http://localhost:3000/book?id="+id).then((res =>{
      console.log(res.data[0])
      if(res.status===200){

      if(res.data[0].id=id&&res.data[0].author_id==author_id && res.data[0].title==title&& res.data[0].pub_year==pub_year&&res.data[0].genre==genre){
        window.alert("the book data add test successfully ")
      }
      }
      }
    )).catch((res)=>{
        window.alert("error => book info not equal to data")
        setid("")
        setauthor_id("")
        settitle("")
        setpub_year("")
        setgenre("")
      })
  }
  return (
      <div>
    <div>
  <h1> Test Book Data Add is Success or Failure
      </h1>
    </div>
      <TextField id="outlined-basic" label="id" variant="outlined" value={id} onChange={onChangeSetId} />
      <br/>
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
      <Button variant='contained'color="success" onClick={TestDataAddTest}>Commit</Button>
      </div>
      </div>


  );
}
