import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from './Product.js'
import Metadata from "../layou/Metadata";
import {getProduct} from "../../actions/ProductAction"
import { useSelector, useDispatch } from 'react-redux'
import Loader from "../layou/Loader/Loader";
import {useAlert} from "react-alert"


const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const {loading, error, products, productCount}= useSelector(
    (state) => state.products
  );

  useEffect(() =>{
    if(error){
      return alert.error(error);
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  useEffect(() =>{
    dispatch(getProduct());
  },[dispatch]);

  return (
      
      <Fragment>
        {loading ? <Loader /> : (
      <>  
      <Metadata title="Home pages"  />
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCT BELLOW</h1>

        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
        </div>
        <h2 className="homeHeading">Featured Products</h2>

        <div className="container" id="container">
          {products && products.map(product => (
            <Product product={product} />
          ))}

        </div>
      </>
        )}
      </Fragment>
     
  );
};

export default Home;