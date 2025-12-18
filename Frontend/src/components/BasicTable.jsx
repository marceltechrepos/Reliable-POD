import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available) {
  return { id, sku, color, size, colorHex, weight, price, comparePrice, baseCost, available};
}

const rows = [
  createData(87632492, 159, "White", "24'", "#ffffff", "", 1, null, null, "available"),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>TIB Variant ID</TableCell>
            <TableCell>Fulfield SKU</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Color Hex</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Price(GBP)</TableCell>
            <TableCell>Compare Price</TableCell>
            <TableCell>Base Cost</TableCell>
            <TableCell>Available</TableCell>
            <TableCell>Add to Campaigns</TableCell>
            <TableCell>Create at</TableCell>
            <TableCell>Update at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{row.color}</TableCell>
              <TableCell>{row.size}</TableCell>
              <TableCell>{row.colorHex}</TableCell>
              <TableCell>{row.weight}</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.comparePrice}</TableCell>
              <TableCell>{row.baseCost}</TableCell>
              <TableCell>{row.available}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}