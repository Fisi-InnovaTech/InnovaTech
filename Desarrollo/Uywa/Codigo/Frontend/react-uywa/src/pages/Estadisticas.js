import React from 'react';
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Card, Container } from '@mui/material';
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const data = [
  { month: 'Jan', report: 20 },
  { month: 'Feb', report: 45 },
  { month: 'Mar', report: 30 },
  { month: 'Apr', report: 35 },
  { month: 'May', report: 40 },
  { month: 'Jun', report: 25 },
  { month: 'Jul', report: 35 },
  { month: 'Aug', report: 20 },
  { month: 'Sep', report: 30 },
  { month: 'Oct', report: 25 },
  { month: 'Nov', report: 15 },
  { month: 'Dec', report: 10 },
];

const transactions = [
  { id: '#UW1572', date: '04 Apr, 2020', name: 'Walter Brown', amount: '172', status: 'Aceptado' },
  { id: '#UW1571', date: '03 Apr, 2020', name: 'Jimmy Barker', amount: '165', status: 'Revision' },
  { id: '#UW1570', date: '03 Apr, 2020', name: 'Donald Bailey', amount: '146', status: 'Aceptado' },
  { id: '#UW1569', date: '02 Apr, 2020', name: 'Paul Jones', amount: '183', status: 'Aceptado' },
  { id: '#UW1568', date: '04 Apr, 2020', name: 'Walter Brown', amount: '172', status: 'Denegado' },
];

const getStatusColor = (status) => {
    switch (status) {
      case 'Aceptado':
        return 'green';
      case 'Revision':
        return 'orange';
      case 'Denegado':
        return 'red';
      default:
        return 'black';
    }
  };
  

  const Estadisticas = () => {
    return (
      <Container display="flex" flexDirection="column" height="100vh" >
          <Box  
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="100vh"
              padding='1.5rem'>
              <Card style={{ marginTop: '100px', width: '90%', border: '1px solid #ccc' }} >
                  <Box style={{ padding: '16px', marginTop: '16px', marginRight: '2rem' }}>
                  <Typography variant="h6">Estadisticas</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="report" fill="#8884d8" barSize={10} />
                          <Line type="monotone" dataKey="report" stroke="#82ca9d" />
                      </ComposedChart>
                      </ResponsiveContainer>
                  </Box>
              </Card>
          </Box>
        
          <Box  
              display="flex" 
              justifyContent="center" 
              alignItems="center"
              padding='1.5rem'>
              <Card style={{ width: '90%', border: '1px solid #ccc'}}>
                  <Box style={{ padding: '16px', marginTop: '16px'}}>
                      <Typography variant="h6" gutterBottom>
                      Reportes
                      </Typography>
                      <TableContainer>
                      <Table>
                          <TableHead>
                          <TableRow >
                              <TableCell>No.</TableCell>
                              <TableCell>ID</TableCell>
                              <TableCell>Fecha</TableCell>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Reportes</TableCell>
                              <TableCell>Estado</TableCell>
                              <TableCell>Acciones</TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {transactions.map((transaction, index) => (
                              <TableRow key={transaction.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{transaction.id}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.name}</TableCell>
                              <TableCell>{transaction.amount}</TableCell>
                              <TableCell>
                                  <span style={{
                                  color: getStatusColor(transaction.status),
                                  fontWeight: 'bold'
                                  }}>
                                  {transaction.status}
                                  </span>
                              </TableCell>
                              <TableCell>
                                  <IconButton><EditIcon /></IconButton>
                                  <IconButton><DeleteIcon /></IconButton>
                                  <IconButton><VisibilityIcon /></IconButton>
                              </TableCell>
                              </TableRow>
                          ))}
                          </TableBody>
                      </Table>
                      </TableContainer>
                      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                          <Button mx={1} px={0.5} py={0.2} style={{ minWidth: '24px', textAlign: 'center', border: '1px solid #ccc' }} >1</Button>
                          <Button mx={1} px={0.5} py={0.2} style={{ minWidth: '24px', textAlign: 'center', border: '1px solid #ccc' }}>2</Button>
                          <Button mx={1} px={0.5} py={0.2} style={{ minWidth: '24px', textAlign: 'center', border: '1px solid #ccc' }}>3</Button>
                      </Box>
                  </Box>
              </Card>
          </Box>
      </Container>
    );
  };

export default Estadisticas;
