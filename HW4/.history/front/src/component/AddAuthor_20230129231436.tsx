import './AddAuthor.css';
import {useState} from 'react';
import {Author} from './Author'
import axios from 'axios'

/**
 * Props is an object with a backShowListPagh property that is a function that takes no arguments and
 * returns nothing.
 * @property backShowListPagh - This is a function that will be called when the user clicks the back
 * button.
 */
type Props = {
  backShowListPagh: () => void;
}
const AddAuthor=(props:Props)=>{ 

/* A hook that allows us to use state in a functional component. */
const [id, setid] = useState("")
const [name, setname] = useState("")
const [bio, setbio] = useState("")
const onChangeSetId = (e:any)=>{
  setid(e.target.value)
}
const onChangeSetName = (e:any)=>{
  setname(e.target.value)
}
/**
 * It sets the bio state to the value of the input field.
 * @param {any} e - any - this is the event that is triggered when the input is changed.
 */
const onChangeSetBio = (e:any)=>{
  setbio(e.target.value)
}
  const onSubmitClickHandle=() =>{
      if(!id ||!name||!bio){
          window.alert("Please |fill in the complete book information")
          return
      }
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
      }
    )).catch((res)=>{
        window.alert("error => author id is exist, Please re-enter id")
        setid("")
      })
    
  }
  const {backShowListPagh} =props;
  const[DDK[[]]]
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
          <input type="button" value="add author" onClick={ onSubmitClickHandle}/><div>&nbsp;</div>

          <input type="button" value="back" onClick={backShowListPagh}/> 
      </div>
    </form >
  </div>
}
export default AddAuthor;
