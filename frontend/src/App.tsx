import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Root } from './layout/root';
import { Footer } from './layout/root/footer';
import { Header } from './layout/root/header';
import { Main } from './layout/root/main';
import { About, Home, Repair, Score } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Root>
        <Header />
        <Main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/score/' element={<Score />} />
            <Route path='/example/:lang' element={<Score />} />
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
