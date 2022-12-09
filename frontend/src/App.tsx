import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Root } from './layout/root';
import { Footer } from './layout/root/footer';
import { Header } from './layout/root/header';
import { Main } from './layout/root/main';
import { About, Example, Home, Repair } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Root>
        <Header />
        <Main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/example' element={<Example />} />
            <Route path='/repair' element={<Repair />} />
            <Route path='/*' element={<Repair />} />
          </Routes>
        </Main>
        <Footer />
      </Root>
    </BrowserRouter>
  );
}

export default App;
