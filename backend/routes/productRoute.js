const express = require('express');
const { route } = require('../app');
const { getAllproducts, createProduct,updateProduct, deleteAproduct, getProductDetails, createProductRiview, getAllProductReviews, deleteReviews } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// const {getAlluser} = require("../controllers/productController");
// router.get("/products", getAllproducts);

router.route("/products").get(getAllproducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin") , createProduct)
router.route("/admin/product/:id")
.put(isAuthenticatedUser, authorizeRoles("admin") , updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin") , deleteAproduct);


router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductRiview);
router.route("/reviews").get(getAllProductReviews).delete(isAuthenticatedUser ,deleteReviews);

module.exports = router