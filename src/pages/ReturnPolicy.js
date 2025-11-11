import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const ReturnPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Return Policy
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" paragraph>
            We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help. Please review our return policy below.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Return Period
          </Typography>
          <Typography variant="body1" paragraph>
            You have 30 days from the date of delivery to return most items for a full refund or exchange. Some items have different return periods:
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Category</TableCell>
                  <TableCell>Return Period</TableCell>
                  <TableCell>Conditions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Regular Items</TableCell>
                  <TableCell>30 days</TableCell>
                  <TableCell>Unused, in original packaging</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Electronics</TableCell>
                  <TableCell>14 days</TableCell>
                  <TableCell>Factory sealed, unused</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Final Sale Items</TableCell>
                  <TableCell>Non-returnable</TableCell>
                  <TableCell>Marked as final sale</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Custom Orders</TableCell>
                  <TableCell>Non-returnable</TableCell>
                  <TableCell>Made to specifications</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Return Conditions
          </Typography>
          <Typography variant="body1" paragraph>
            To be eligible for a return, your item must be:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="In the original packaging with all tags attached" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Unused and in the same condition you received it" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Accompanied by the original receipt or proof of purchase" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not damaged or altered in any way" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            How to Return an Item
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="1. Contact Customer Service"
                secondary="Email returns@ecommercestore.com or call 1-800-123-4567 to initiate your return"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Package Your Item"
                secondary="Place the item in its original packaging with all accessories and documentation"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Include Documentation"
                secondary="Add the return form and original receipt in the package"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Ship Your Return"
                secondary="Use the provided return shipping label or ship to our return center"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Refund Processing
          </Typography>
          <Typography variant="body1" paragraph>
            Once we receive your return:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Inspection Period"
                secondary="1-3 business days to inspect the returned item"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Refund Initiation"
                secondary="Refunds are processed within 5-7 business days after approval"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Refund Method"
                secondary="Refunds are issued to the original payment method"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Shipping Costs"
                secondary="Original shipping costs are non-refundable unless the return is due to our error"
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Exchanges
          </Typography>
          <Typography variant="body1" paragraph>
            We gladly exchange items for a different size or color, subject to availability. Please contact customer service to arrange an exchange.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Damaged or Defective Items
          </Typography>
          <Typography variant="body1" paragraph>
            If you receive a damaged or defective item, please contact us within 7 days of delivery. We will arrange for a replacement or refund and cover return shipping costs.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1">
            For return-related questions, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Email: returns@ecommercestore.com<br />
            Phone: 1-800-123-4567<br />
            Hours: Monday-Friday, 9 AM - 6 PM EST
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReturnPolicy;