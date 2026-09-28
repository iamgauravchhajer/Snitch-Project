import { body, param, validationResult } from "express-validator"

export const createProductValidator = [
    body("title")
        .exists().withMessage("Title is required").bail()
        .isString().withMessage("Title must be a string").bail()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Title length must be between 2 to 100 characters").bail(),

    body("description")
        .exists().withMessage("Description is required").bail()
        .isString().withMessage("Description must be String").bail()
        .trim()
        .isLength({ min: 20, max: 500 }).withMessage("Description length must be between 20 to 500 characters"),

    body("price.amount")
        .exists().withMessage("price amount is required").bail()
        .isFloat({ min: 0 }).withMessage("price amount must be a floating number and must be greater that 0"),

    body("price.currency")
        .exists().withMessage("Currency is required").bail()
        .isString().withMessage("Currency must be a string value")
        .isIn([ "INR", "USD" ]).withMessage("Currency either be INR or USD"),

    body('sizes')
        .exists().withMessage("Sizes is required").bail()
        .isArray().withMessage("Sizes must be an array").optional(),

    body('sizes.*.size')
        .exists().withMessage("Size is required").bail()
        .isString().withMessage("Size must be a string value").optional()
        .trim()
        .isIn([ "XS", "S", "M", "L", "XL", "XXL" ]).withMessage("Size must be one of XS, S, M, L, XL, XXL").optional(),

    body('sizes.*.stock')
        .exists().withMessage("Quantity is required").bail()
        .isInt({ min: 0 }).withMessage("Quantity must be a integer number and must be greater that 0").optional(),


    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        return res.status(400).json({
            success: false,
            message: "Invalid product",
            errors: errors.array()
        })
    }
]

export const productIdParamValidator = [
    param('id')
        .exists().withMessage("Product ID is required").bail()
        .isMongoId().withMessage("Product ID must be a valid Mongo ID"),

    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        return res.status(400).json({
            success: false,
            message: "Invalid Product ID",
            errors: errors.array()
        })
    }
]

export const updateProductValidator = [
    param('id')
        .exists().withMessage("Product ID is required").bail()
        .isMongoId().withMessage("Product ID must be a valid Mongo ID"),

    body("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Title length must be between 2 to 100 characters"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .trim()
        .isLength({ min: 20, max: 500 }).withMessage("Description length must be between 20 to 500 characters"),

    body("price.amount")
        .optional()
        .isFloat({ min: 0 }).withMessage("Price amount must be a floating number and greater than 0"),

    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        return res.status(400).json({
            success: false,
            message: "Invalid product update data",
            errors: errors.array()
        })
    }
]

export const unlistProductValidator = [
    param('id')
        .exists().withMessage("Product ID is required").bail()
        .isMongoId().withMessage("Product ID must be a valid mongo ID"),

    (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        return res.status(400).json({
            message: "Invalid product",
            errors: errors.array()
        })
    }
]