import moment from 'moment';
import Api from '../../Api'
import Swal from 'sweetalert2';
import ModalEditUser from '../Modals/ModalEditUser';
import { useState, useEffect, useCallback } from 'react';

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-right',
  iconColor: 'green',
  customclassName: {
    popup: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});

const Table = ({ data, column, showModal1 }) => {

  function passValue(val){
        return showModal1(true);
  }
  return (
    <table className="blueTable">
      
    <thead className="text-center">
      <tr>
        {column.map((item, index) => <TableHeadItem item={item} />)}
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => <TableRow item={item} column={column}passValue={passValue} />)}
    </tbody>
  </table>
  )
}

const TableHeadItem = ({ item }) => <th>{item.heading}</th>
const TableRow = ({ item, column, passValue }) => (
  <tr>
    {column.map((columnItem, index) => {

      if(columnItem.value.includes('.')) {
        const itemSplit = columnItem.value.split('.') //['address', 'city']
        return <td className="text-center">{item[itemSplit[0]][itemSplit[1]]}</td>
      }
      if (columnItem.value === "user_id"){
        var current = item[`${columnItem.value}`];
        return <td onClick={() => passValue(current)} className="text-center">{current}</td>
      } else {
        return <td className="text-center">{item[`${columnItem.value}`]}</td>
      }  
    })}
  </tr>
)

export default Table