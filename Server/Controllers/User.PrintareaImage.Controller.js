import printAreaImageModel from "../Models/User.PrintareaImage.Model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";
import fs from "fs";

export const createPrintareaImage = async (req, res) => {
  try {
    const image = req.file;
    const body = req.body;
    const userId = req.UserId; // Assuming auth middleware sets req.user

    console.log(userId , "<<< userId")

    // Validation array
    const validation = [
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

    // Check if image is uploaded
    if (!image) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No print area image uploaded",
      });
    }

    // Validate required fields
    for (const validationItem of validation) {
      if (validationItem.required && !body[validationItem.field]) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: validationItem.errorMessage,
        });
      }
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image.path, {
      folder: "printareas",
      resource_type: "auto",
    });

    // Remove file from local storage
    if (fs.existsSync(image.path)) {
      fs.unlinkSync(image.path);
    }

    // Create new print area image document
    const newPrintAreaImage = new printAreaImageModel({
      printAreaImage: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      productId: body.productId || null,
      UserId: body.UserId || null,
      name: body.name,
      size: body.size,
    });

    await newPrintAreaImage.save();

    res.status(201).json({
      success: true,
      data: newPrintAreaImage,
      status: 201,
      message: "Print area image uploaded successfully",
    });
  } catch (error) {
    // Handle Cloudinary errors
    if (error.message.includes("Cloudinary")) {
      return res.status(500).json({
        message: "Failed to upload image to Cloudinary",
        success: false,
        status: 500,
      });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        status: 400,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      message: error.message,
      success: false,
      status: 500,
    });
  }
};

export const getAllPrintareaImages = async (req, res) => {
  try {
    const { productId, userId } = req.query;
    let query = {};

    // Filter by productId if provided
    if (productId) {
      query.productId = productId;
    }

    // Filter by userId if provided
    if (userId) {
      query.UserId = userId;
    }

    const printAreaImages = await printAreaImageModel
      .find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: printAreaImages,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      status: 500,
    });
  }
};

export const uploadPrintareaImage = async (req, res) => {
  try {
    const image = req.file;
    const body = req.body;
    const { id } = req.params;
    const userId = req.user?.id;

    if (id) {
      // UPDATE EXISTING PRINT AREA IMAGE
      const existingPrintArea = await printAreaImageModel.findById(id);

      if (!existingPrintArea) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Print area image not found",
        });
      }

      // Check ownership (optional - if you want to restrict)
      if (existingPrintArea.UserId && existingPrintArea.UserId.toString() !== userId?.toString()) {
        return res.status(403).json({
          success: false,
          status: 403,
          message: "You don't have permission to update this image",
        });
      }

      // Prepare update data
      const updateData = {};

      // Update text fields if provided
      if (body.name !== undefined) {
        updateData.name = body.name;
      }
      if (body.size !== undefined) {
        updateData.size = body.size;
      }
      if (body.productId !== undefined) {
        updateData.productId = body.productId;
      }

      // Handle image update if new image is provided
      if (image) {
        // Upload new image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image.path, {
          folder: "printareas",
          resource_type: "auto",
        });

        // Remove file from local storage
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }

        // Delete old image from Cloudinary if exists
        if (
          existingPrintArea.printAreaImage &&
          existingPrintArea.printAreaImage.public_id
        ) {
          try {
            await cloudinary.uploader.destroy(
              existingPrintArea.printAreaImage.public_id
            );
          } catch (cloudinaryError) {
            console.error(
              "Error deleting old image from Cloudinary:",
              cloudinaryError
            );
          }
        }

        // Update image data
        updateData.printAreaImage = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      }

      // Update the document
      const updatedPrintArea = await printAreaImageModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        data: updatedPrintArea,
        status: 200,
        message: "Print area image updated successfully",
      });
    } else {
      // CREATE NEW PRINT AREA IMAGE (same as createPrintareaImage)
      // Validation array
      const validation = [
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
        return res.status(400).json({
          success: false,
          status: 400,
          message: "No print area image uploaded",
        });
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

      const uploadResult = await cloudinary.uploader.upload(image.path, {
        folder: "printareas",
        resource_type: "auto",
      });

      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      const newPrintAreaImage = await printAreaImageModel.create({
        printAreaImage: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
        productId: body.productId || null,
        UserId: userId || null,
        name: body.name,
        size: body.size,
      });

      return res.status(201).json({
        success: true,
        data: newPrintAreaImage,
        status: 201,
        message: "Print area image uploaded successfully",
      });
    }
  } catch (error) {
    if (error.message.includes("Cloudinary")) {
      return res.status(500).json({
        message: "Failed to upload image to Cloudinary",
        success: false,
        status: 500,
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        status: 400,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      message: error.message,
      success: false,
      status: 500,
    });
  }
};

export const deletePrintareaImage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const printAreaImage = await printAreaImageModel.findById(id);

    if (!printAreaImage) {
      return res.status(404).json({
        message: "Print area image not found",
        status: 404,
        success: false,
      });
    }

    // Check ownership (optional)
    if (printAreaImage.UserId && printAreaImage.UserId.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "You don't have permission to delete this image",
      });
    }

    // Delete from Cloudinary
    if (printAreaImage.printAreaImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(printAreaImage.printAreaImage.public_id);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
      }
    }

    // Delete from database
    await printAreaImageModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Print area image deleted successfully",
      success: true,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      success: false,
    });
  }
};

export const getPrintareaImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const printAreaImage = await printAreaImageModel.findById(id);

    if (!printAreaImage) {
      return res.status(404).json({
        message: "Print area image not found",
        status: 404,
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: printAreaImage,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 500,
      success: false,
    });
  }
};