import './BookList.css'

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
                <Button variant="contained" onClick={()=>{
                  editBook(book.id)
                }
                }>Edit</Button>

                <Button variant="contained" color="error" onClick={() => {
                  console.log(book.id)
                  axios.delete("http://localhost:3000/book?id=" + book.id).then((res)=>{
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

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
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
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
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