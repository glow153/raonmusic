import { Route, Routes, useLocation } from "react-router-dom";
import { About, Home, Repair, Sheet } from "../pages";


const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes key={location.pathname} location={location}>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/sheet/' element={<Sheet />} />
      <Route path='/example/:lang' element={<Sheet />} />
      <Route path='/repair' element={<Repair />} />
      <Route path='/*' element={<Repair />} />
    </Routes>
  );
};

export default AnimatedRoutes;
