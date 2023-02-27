import './AddAuthor.css';
import {useState} from 'react';
import {Author} from './Author'
import axios from 'axios'

type Props = {
  backShowListPagh: () => void;
}
const AddAuthor=(props:Props)=>{ 

const [id, setid] = useState("")
const [name, setname] = useState("")
const [bio, setbio] = useState("")
const onChangeSetId = (e:any)=>{
  setid(e.target.value)
}
const onChangeSetName = (e:any)=>{
  setname(e.target.value)
}
const onChangeSetBio = (e:any)=>{
  setbio(e.target.value)
}
  const onSubmitClickHandle=() =>{
    const data:Author={
      id:id,
      name:name,
      bio:bio
    }
    console.log(data)
 axios.post("http://localhost:3000/author",data).then((res =>{
      console.log(res.data)
      if(res.data==="OK"){
        window.alert("author add successfully ")
        backShowListPagh()
      }
      if(res.status==400)
        window.alert("author add successfully ")
      }
    )).catch((res)=>{
        window.alert("error => author id is exist, Please re-enter")
        setid("")
        setname("")
        setbio("")
      })
    
  }
  const {backShowListPagh} =props;
  return <div  className="text-center">
    <div>
      <h3> Add Author Form</h3>
    </div>
    <form >
      <div>
          <label>Author id : </label>
          <input type="text" value={id} onChange={onChangeSetId} />
      </div>
      <div>
         <label>Name :  </label> 
          <input type="text" value={name} onChange={onChangeSetName}/>
      </div>
      <div>
         <label>Bio : </label>
          <input type="text" value={bio} onChange={onChangeSetBio}/>
      </div>
        <div>
          <input type="button" value="back" onClick={backShowListPagh}/>
          <input type="button" value="add author" onClick={ onSubmitClickHandle}/>
      </div>
    </form >
  </div>
}
export default AddAuthor;
