import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { About, Home, Repair } from './pages';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} exact={true} />
        <Route path='/about' element={<About />} />
        <Route path='/repair' element={<Repair />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
