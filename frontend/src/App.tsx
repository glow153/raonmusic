import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AnimatedRoutes } from './layout';
import { Root } from './layout/root';
import { Footer } from './layout/root/footer';
import { Header } from './layout/root/header';
import { Main } from './layout/root/main';

const App = () => {
  return (
    <BrowserRouter>
      <Root>
        <Header />
        <Main>
          <AnimatedRoutes />
        </Main>
        <Footer />
      </Root>
    </BrowserRouter>
  );
}

export default App;
