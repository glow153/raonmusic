import React from 'react';
import { BasePage } from '../components/templates';
import { Header } from '../layouts/header';

const Home = () => {
  return (
    <BasePage>
      <Header />
      <h1>홈</h1>
      <p>홈, 그 페이지는 가장 먼저 보여지는 페이지.</p>
    </BasePage>
  );
};

export default Home;