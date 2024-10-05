// src/ItemList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Box
} from '@mui/material';

const ItemList = () => {

  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, name: '', email: '' });

  // Fetch items from the API
  useEffect(() => {
   
    fetchItems();
  }, []);

  const fetchItems = async () => {

    try {
      const response = await axios.get('https://backend-crudoperation.vercel.app/api/items');
      
      setItems(response.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const handleOpen = (item = { id: null, name: '', email: '' }) => {
    setCurrentItem(item);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem({ id: null, name: '', email: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentItem.id) {
      // Update item
      await axios.put(`https://backend-crudoperation.vercel.app/api/items${currentItem.id}`, currentItem);
    } else {
      // Add new item
      await axios.post('https://backend-crudoperation.vercel.app/api/items', currentItem);
    }
    handleClose();
    fetchItems();

  };

  const handleDelete = async (id) => {
    
    await axios.delete(`https://backend-crudoperation.vercel.app/api/items${id}`);
    fetchItems();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center" margin-top="20px">
        User Managment System
      </Typography>
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Item
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpen(item)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentItem.id ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
        <TextField
  autoFocus
  margin="dense"
  name="name" // This ensures the name field gets updated
  label="Name"
  type="text"
  fullWidth
  value={currentItem.name}
  onChange={handleChange}
/>

<TextField
  margin="dense"
  name="email" // This ensures the email field gets updated
  label="Email"
  type="email"
  fullWidth
  value={currentItem.email}
  onChange={handleChange}
/>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemList;
