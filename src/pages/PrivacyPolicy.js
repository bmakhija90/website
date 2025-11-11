import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to E-Commerce Store. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We may collect the following types of information:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Personal Information: Name, email address, phone number, shipping address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Payment Information: Credit card details, billing address (processed securely through our payment partners)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Technical Information: IP address, browser type, device information, cookies" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Usage Data: Pages visited, products viewed, shopping cart contents" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            How We Use Your Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Process and fulfill your orders" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide customer support and respond to inquiries" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Send order confirmations and shipping updates" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Improve our website and services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Send marketing communications (with your consent)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Prevent fraud and enhance security" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell your personal information to third parties. We may share your information with:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Shipping carriers to deliver your orders" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Payment processors to handle transactions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Service providers who assist in our operations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Legal authorities when required by law" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Access and review your personal information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Correct inaccurate information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Request deletion of your information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Opt-out of marketing communications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Data portability" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1">
            Email: privacy@ecommercestore.com<br />
            Phone: 1-800-123-4567<br />
            Address: 123 Commerce St, Business City, BC 12345
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;