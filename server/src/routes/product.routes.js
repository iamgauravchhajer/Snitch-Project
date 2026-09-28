import { Router } from "express";
import { authenticate, sellerRoleAuthorization } from "../middleware/auth.middleware.js";
import { createProduct, getAllProducts, unlistProduct, listProduct, getSellerProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import upload from "../config/multer.config.js";
import { parseProductData } from "../middleware/parseFormData.js";
import { createProductValidator, unlistProductValidator, productIdParamValidator, updateProductValidator } from "../validations/product.validator.js";

const productRouter = Router();

productRouter.post(
    '/',
    authenticate,
    sellerRoleAuthorization,
    upload.array('images', 5),
    parseProductData,
    createProductValidator,
    createProduct
);
productRouter.post(
    '/create',
    authenticate,
    sellerRoleAuthorization,
    upload.array('images', 5),
    parseProductData,
    createProductValidator,
    createProduct
);

productRouter.get('/', getAllProducts)
productRouter.get('/seller', authenticate, sellerRoleAuthorization, getSellerProducts)
productRouter.get('/:id', productIdParamValidator, getProductById)
productRouter.put('/:id', authenticate, updateProductValidator, updateProduct)
productRouter.delete('/:id', authenticate, productIdParamValidator, deleteProduct)
productRouter.patch('/list/:id', authenticate, sellerRoleAuthorization, unlistProductValidator, listProduct)
productRouter.patch('/unlist/:id', authenticate, sellerRoleAuthorization, unlistProductValidator, unlistProduct)

export default productRouter;