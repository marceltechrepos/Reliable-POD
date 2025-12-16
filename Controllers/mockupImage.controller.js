import mockupImageModel from "../Models/mockupImage.model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";

export const getAllMockupImage = async (req, res) => {
  try {
    const mockupImage = await mockupImageModel.find();
    res.status(200).json(mockupImage);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, success: false, status: 500 });
  }
};

export const uploadMockupImage = async (req, res) => {
  try {
    const image = req.file;
    const body = req.body;
    const validation = [
      {
        field: "category",
        required: true,
        errorMessage: "Please provide Category",
      },
      {
        field: "name",
        required: true,
        errorMessage: "Please provide Name",
      },
      {
        field: "size",
        required: true,
        errorMessage: "Please provide Size",
      },
    ];
    if (!image) {
      return res
        .status(400)
        .json({ success: false, status: 400, message: "No image uploaded" });
    }
    for (const validationItem of validation) {
      if (validationItem.required && !body[validationItem.field]) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: validationItem.errorMessage,
        });
      }
    }
    const uploadResult = await cloudinary.uploader.upload(image.path);

    const newMockupImage = new mockupImageModel({
      mockupImage: uploadResult.secure_url,
      category: body.category,
      name: body.name,
      size: body.size,
    });

    res.status(201).json({
      success: true,
      data: newMockupImage,
      status: 201,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, success: false, status: 500 });
  }
};

export const deleteMockupImage = async (req, res) => {
  const { id } = req.params;
  try {
    const mockupImage = await mockupImageModel.findByIdAndDelete(id);
    if (!mockupImage) {
      return res
        .status(404)
        .json({
          message: "Mockup Image not found",
          status: 404,
          success: false,
        });
    }
    res.status(200).json({ success: true, data: mockupImage, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: 500, success: false });
  }
};
