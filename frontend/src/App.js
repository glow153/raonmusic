import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { About, Home } from './components/pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} exact={true} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <div>
    //       <ul>
    //         <li>
    //           <Link to='/'>홈</Link>
    //         </li>
    //         <li>
    //           <Link to='/about'>소개</Link>
    //         </li>
    //       </ul>
    //       <hr />
    //       <Routes>
    //         <Route path={['/', '/index']} element={<Home />} exact={true} />
    //         <Route path='/about' element={<About />} />
    //       </Routes>
    //     </div>
    //   </header>
    // </div>
  );
}

export default App;
