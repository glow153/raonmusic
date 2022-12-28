import { Route, Routes, useLocation } from "react-router-dom";
import { About, Home, Repair, Score } from "../pages";


const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes key={location.pathname} location={location}>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/score/' element={<Score />} />
      <Route path='/example/:lang' element={<Score />} />
      <Route path='/repair' element={<Repair />} />
      <Route path='/*' element={<Repair />} />
    </Routes>
  );
};

export default AnimatedRoutes;
