import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { RestaurantDetailsPage } from './pages/RestaurantDetailsPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
