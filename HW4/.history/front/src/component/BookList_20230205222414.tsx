import './BookList.css'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Book } from './Book'
import Button from '@mui/material/Button'
import axios from 'axios'
import {useState} from 'react'
type Props = {
  booklist: Book[];
  deletebook:()=>void;
  editBook:(id:string)=>void;
}

const BookList = (props: Props) => {
  const { booklist ,deletebook,editBook} = props;
  const [delteBookid, setdelteBookid] = useState("xx")
//   return (
//     <div>
//       <table>
//         <tr>
//           <th>id</th>
//           <th>Author_id</th>
//           <th>title</th>
//           <th>pub_year</th>
//           <th>Genre</th>
//           <th>Action</th>
//         </tr>
//         {booklist.map((book) => {
//           console.log(book)
//           return (
//             <tr key={book.id}>
//               <td>{book.id}</td>
//               <td>{book.author_id}</td>
//               <td>{book.title}</td>
//               <td>{book.pub_year}</td>
//               <td>{book.genre}</td>
//               <div>
//                 <Button variant="contained" onClick={()=>{
//                   editBook(book.id)
//                 }
//                 }>Edit</Button>

//                 <Button variant="contained" color="error" onClick={() => {
//                   console.log(book.id)
//                   axios.delete("http://localhost:3000/book?id=" + book.id).then((res)=>{
//                     if (res.status===200){
//                   console.log("show delete after list")
//                   deletebook()
//                     }
//                   })


//                 }}   >Delete</Button>
//               </div>
//             </tr>
//           )

//         })}
//       </table>
//     </div>
//   )
// }


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {booklist.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.author_id}
              </TableCell>
              <TableCell align="right">{row.tit}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
 export default BookList;