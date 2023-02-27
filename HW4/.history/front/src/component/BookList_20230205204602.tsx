import './BookList.css'

import { Book } from './Book'
import Button from '@mui/material/Button'
import axios from 'axios'
import {useState} from 'react'
type Props = {
  booklist: Book[];
  deletebook:()=>void;
  editBook:()=>void;
}

const BookList = (props: Props) => {
  const { booklist ,deletebook,editBook} = props;
  const [delteBookid, setdelteBookid] = useState("xx")
  return (
    <div>
      <table>
        <tr>
          <th>id</th>
          <th>Author_id</th>
          <th>title</th>
          <th>pub_year</th>
          <th>Genre</th>
          <th>Action</th>
        </tr>
        {booklist.map((book) => {
          console.log(book)
          return (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.author_id}</td>
              <td>{book.title}</td>
              <td>{book.pub_year}</td>
              <td>{book.genre}</td>
              <div>
                <Button variant="contained" onClick={editBook}>Edit</Button>

                <Button variant="contained" color="error" onClick={() => {
                  console.log(book.id)
                  axios.delete("http://192.168.1.2:3000/book?id=" + book.id).then((res)=>{
                    if (res.status===200){
                  console.log("show delete after list")
                  deletebook()
                    }
                  })


                }}   >Delete</Button>
              </div>
            </tr>
          )

        })}
      </table>
    </div>
  )
}
export default BookList;
