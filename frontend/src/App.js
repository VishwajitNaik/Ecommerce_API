import Header from "./components/layou/Headers/Header.js"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/layou/Footer/Footer.js";
import Home from "./components/Home/Home.js"
import Loader from "./components/layou/Loader/Loader.js";
import ProductDetails from "./components/product/ProductDetails.js"
import Products from "./components/product/Products.js"

function App() {
  return (
      <Router>
        <Header />
        <Routes>
          <Route extact path="/" Component={Home} />
          <Route extact path="/product/:id" Component={ProductDetails} />
          {/* <Route extact path="/products" Component={Products} /> */}
          </Routes>
        <Footer />
      </Router>
  );
}

export default App;
