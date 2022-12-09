import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Root } from './layout/root';
import { Header } from './layout/root/header';
import { Main } from './layout/root/main';
import { About, Home, Repair } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Root>
        <Header />
        <Main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/repair' element={<Repair />} />
            <Route path='/*' element={<Repair />} />
          </Routes>
        </Main>
      </Root>
    </BrowserRouter>
  );
}

export default App;
