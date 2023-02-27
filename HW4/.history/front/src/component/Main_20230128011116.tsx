import './Main.style.css'
import BookList from './BookList'
import { useEffect ,useState } from 'react'
import {Book} from './Book'
import axios from 'axios'
import {PageEnum} from './Enum'
import AddBook from './AddBook'
import AddAuthor from './AddAuthor'
import SearchBookList from './SearchBookList'



const Main =()=>{
  const [booklist, setBookList] = useState([]as Book [])
  const [searchbooklist, setsearchbooklist] = useState([]as Book[])
  const [searchdata, setsearchdata] = useState("")
  const [showAddBookPage , setshowAddBookPage] = useState(PageEnum.showlist)
  const addBookMethod =()=>{
    setshowAddBookPage(PageEnum.showaddbook)
  }
  const addAuthorMethod =()=>{
    setshowAddBookPage(PageEnum.showaddauthor)
  }
  useEffect (()=>{
 axios.get("http://localhost:3001/books").then((res =>{
    setBookList(res.data)
    let jsonArray=res.data
    // Sort the data
    jsonArray.sort((a:any, b:any) => a.title.localeCompare(b.name));
    console.log("=========");
    console.log(jsonArray);
      }
  ))
  },[showAddBookPage ])
  const backShowListPagh= ()=>{
    setshowAddBookPage(PageEnum.showlist)
      
  }
  const SearchBookMethod=()=>{
    setshowAddBookPage(PageEnum.showsearchbook)
    
  }

  const onChnageSetSearchData=(e:any)=>{
      setsearchdata(e.target.value)
  }
  const searchAxios =()=>{
 axios.get("http://localhost:3001/genrebook?genre="+searchdata).then((res =>{
    setsearchbooklist(res.data)
    let jsonArray=res.data
    // Sort the data
    jsonArray.sort((a:any, b:any) => a.title.localeCompare(b.name));
    console.log("=========");
    console.log(jsonArray);
      }
  ))
  }
  return (
  <>
      <article className="main-class">
        <header>
          <h1>React book : simple curd application</h1>
        </header>
      </article>
        <section className="content">

        { showAddBookPage === PageEnum.showlist&&(
        <>
          <input type="button" value="Add book" onClick={addBookMethod}/>
          <input type="button" value="Add author" onClick={addAuthorMethod}/>
          <input type="button" value="Search book" onClick={SearchBookMethod}/>
          <BookList booklist={booklist} />
          </>)
      }
        { showAddBookPage === PageEnum.showsearchbook&&(
        <>
            <label>Search Book Genre =  </label>
          <input type="text" value={searchdata} onChange={ onChnageSetSearchData}/>
            <input type="button" onClick={searchAxios } value="Search Book"/>
          <SearchBookList booklist={searchbooklist} backShowListPagh={backShowListPagh} />
          </>)
      }
        { showAddBookPage === PageEnum.showaddbook&& <AddBook backShowListPagh={backShowListPagh}/ >
      }
        { showAddBookPage === PageEnum.showaddauthor&& <AddAuthor backShowListPagh={backShowListPagh}/ >
      }

      </section>
      </>

  )
}
export default Main;
