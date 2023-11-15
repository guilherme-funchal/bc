import moment from 'moment';

const Table = ({ data, column }) => {
  return (
    <table className="blueTable">
      <thead className="text-center">
        <tr>
          {column.map((item, index) => <TableHeadItem item={item} />)}
          <th>Operação</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => <TableRow item={item} column={column} />)}
      </tbody>
    </table>
  )
}

const TableHeadItem = ({ item }) => <th>{item.heading}</th>
const TableRow = ({ item, column }) => (
  <tr>
    {column.map((columnItem, index) => {

      if(columnItem.value.includes('.')) {
        const itemSplit = columnItem.value.split('.') //['address', 'city']
        return <td className="text-center">{item[itemSplit[0]][itemSplit[1]]}</td>
      }
      if (columnItem.value === "data" || columnItem.value === "data_inicio" | columnItem.value === "data_fim"){
        var date_time = item[`${columnItem.value}`];
        var current = moment(date_time)
            .utcOffset('-03:00')
            .format('DD/MM/YYYY');
        return <td className="text-center">{current}</td>
      } else if (columnItem.value === "valor_total" || columnItem.value === "valor" || columnItem.value === "saldo") {
        var valor = item[`${columnItem.value}`].replace(".", ",");
        return <td className="text-center">{valor}</td>
      } else {
        return <td className="text-center">{item[`${columnItem.value}`]}</td>
      }  
    })}
    <td className="text-center"><button type="button" class="btn"><i class="fas fa-edit fa-2xs"></i></button><button  type="button" class="btn"><i class="fas fa-trash fa-2xl"></i></button></td>
  </tr>
)

export default Table