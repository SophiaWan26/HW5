import { useState } from 'react';

import axios from 'axios'
import './AddBook.css'
import {Book} from './Book'



type Props = {
  backShowListPagh: () => void;
}

const AddBook =(props:Props)=>{ 
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
 axios.post("http://localhost:3000/book",data).then((res =>{
      console.log(res.data)
                    if(res.data=="token undefined"){
                  window.alert("please login")
                     return 
                    }
      if(res.data.message==="insert id"){
        window.alert("book add successfully ")
        backShowListPagh()
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
  const {backShowListPagh} =props;
  return <div className="text-center">
    <div >
      <h3> Add Book Form</h3>
    </div>
    <form>
      <div>
         <label>Book id : </label>
          <input type="text" value={id} onChange={onChangeSetId} />
      </div>
      <div>
          <label>Author id : </label>
          <input type="text"  value={author_id} onChange={onChangeSetAuthor_id}/>
      </div>
      <div>
         <label>Title : </label>
          <input type="text" value={title} onChange={onChangeSetTitle}/>
      </div>
      <div>
         <label>Pub_year : </label>
          <input type="text" value={pub_year} onChange={onChangeSetPub_year} />
      </div>
      <div>
         <label>Genre : </label>
          <input type="text" value={genre} onChange={onChangeSetGenre}/>
      </div>
        <div>
          <input type="button" value="add Book" onClick={addBookPost}/><div>&nbsp;</div>
          <input type="button" value="back" onClick={backShowListPagh}/> 
      </div>
    </form>
  </div>
}
export default AddBook;
