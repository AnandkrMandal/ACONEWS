import * as React from 'react';
import Container from '@mui/material/Container';
import Header from '../components/Header';
import NewsContent from '../components/NewsContent';
import Footer from '../components/Footer';

export default function Home() {

  return (
      <>  
        <Header />
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', my: 1, gap: 4 }}
        >
          <NewsContent />
        </Container>
        <Footer /> 
      </>
  );
}