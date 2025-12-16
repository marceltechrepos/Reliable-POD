import productModel from "../Models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({ success: true, data: products, status: 200 });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please provide product details",
    });
  }

  const productValidations = [
    {
      field: "productTitle",
      required: true,
      errorMessage: "Please provide a product title",
    },
    {
      field: "fulfilmentProvider",
      required: true,
      errorMessage: "Please provide a fulfilment provider",
    },
    {
      field: "fulfilmentCatalogID",
      required: true,
      errorMessage: "Please provide a fulfilment catalog ID",
    },
  ];

  for (const validation of productValidations) {
    const value = product[validation.field];

    if (validation.required && !value) {
      return res.status(400).json({
        message: validation.errorMessage,
        status: 400,
        field: validation.field,
        success: false,
      });
    }

    // Add custom validations as needed
    if (validation.validate && typeof validation.validate === "function") {
      const customError = validation.validate(value);
      if (customError) {
        return res.status(400).json({
          message: customError,
          status: 400,
          field: validation.field,
        });
      }
    }
  }

  const newProduct = new productModel(product);
  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct, status: 201 });
  } catch (error) {
    res
      .status(409)
      .json({ message: error.message, status: 409, success: false });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: 404, success: false });
    }
    res.status(200).json({ success: true, data: product, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: 500, success: false });
  }
};
