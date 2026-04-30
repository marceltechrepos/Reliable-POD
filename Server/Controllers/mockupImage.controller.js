import mongoose from "mongoose";
import mockupImageModel from "../Models/mockupImage.model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";

export const createMockupImage = async (req, res) => {
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
      mockupImage: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      category: body.category,
      name: body.name,
      size: body.size,
    });

    await newMockupImage.save();
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

export const getAllMockupImage = async (req, res) => {
  try {
    const mockupImage = await mockupImageModel.find();
    res.status(200).json({ success: true, data: mockupImage, status: 200 });
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
    const { id } = req.params; // Assuming you're using :id in the route

    // Check if this is an update (id provided) or create (no id)
    if (id) {
      // UPDATE EXISTING MOCKUP

      // Find existing mockup
      const existingMockup = await mockupImageModel.findById(id);

      if (!existingMockup) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "Mockup not found",
        });
      }

      // Prepare update data - only update fields that are provided
      const updateData = {};

      // Update text fields if provided, otherwise keep existing
      if (body.category !== undefined) {
        updateData.category = body.category;
      }
      if (body.name !== undefined) {
        updateData.name = body.name;
      }
      if (body.size !== undefined) {
        updateData.size = body.size;
      }

      // Handle image update if new image is provided
      if (image) {
        // Upload new image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image.path, {
          folder: "mockups",
          resource_type: "auto",
        });

        // Remove file from local storage after upload
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }

        // Delete old image from Cloudinary if exists
        if (
          existingMockup.mockupImage &&
          existingMockup.mockupImage.public_id
        ) {
          try {
            await cloudinary.uploader.destroy(
              existingMockup.mockupImage.public_id
            );
          } catch (cloudinaryError) {
            console.error(
              "Error deleting old image from Cloudinary:",
              cloudinaryError
            );
            // Continue with update even if delete fails
          }
        }

        // Update image data
        updateData.mockupImage = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      }

      // Update the mockup
      const updatedMockup = await mockupImageModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        data: updatedMockup,
        status: 200,
        message: "Mockup updated successfully",
      });
    } else {
      // CREATE NEW MOCKUP

      // Validation array for creation only
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

      // Check if image is uploaded (required for creation)
      if (!image) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "No image uploaded",
        });
      }

      // Validate required fields for creation
      for (const validationItem of validation) {
        if (validationItem.required && !body[validationItem.field]) {
          return res.status(400).json({
            success: false,
            status: 400,
            message: validationItem.errorMessage,
          });
        }
      }

      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image.path, {
        folder: "mockups",
        resource_type: "auto",
      });

      // Remove file from local storage after upload
      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      // Create new mockup image document
      const newMockupImage = await mockupImageModel.create({
        mockupImage: {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        },
        category: body.category,
        name: body.name,
        size: body.size,
      });

      return res.status(201).json({
        success: true,
        data: newMockupImage,
        status: 201,
        message: "Mockup image uploaded successfully",
      });
    }
  } catch (error) {
    // Handle specific Cloudinary errors
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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Mockup with this name already exists",
      });
    }

    // Generic error
    return res.status(500).json({
      message: error.message,
      success: false,
      status: 500,
    });
  }
};

export const getSingleMockupImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockup ID"
      });
    }

    const mockup = await mockupImageModel.findById(id);

    if (!mockup) {
      return res.status(404).json({
        success: false,
        message: "Mockup not found"
      });
    }

    res.status(200).json({
      success: true,
      data: mockup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteMockupImage = async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Find mockup first (to check if exists)
    const mockupImage = await mockupImageModel.findById(id);
    if (!mockupImage) {
      return res.status(404).json({
        message: "Mockup Image not found",
        status: 404,
        success: false,
      });
    }

    // 2. Delete all associated layers
    const Layer = mongoose.model("Layer");
    const deletedLayers = await Layer.deleteMany({ mockupId: id });
    console.log(`Deleted ${deletedLayers.deletedCount} layers for mockup ${id}`);

    // 3. Delete the mockup image from Cloudinary (if exists)
    if (mockupImage.mockupImage?.public_id) {
      try {
        await cloudinary.uploader.destroy(mockupImage.mockupImage.public_id);
        console.log(`Deleted Cloudinary image: ${mockupImage.mockupImage.public_id}`);
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with deletion even if Cloudinary fails
      }
    }

    // 4. Delete the mockup document itself
    await mockupImageModel.findByIdAndDelete(id);

    // 5. Also remove this mockup ID from all products that reference it
    const Product = mongoose.model("Product");
    const updateResult = await Product.updateMany(
      { mockupIds: id },
      { $pull: { mockupIds: id } }
    );
    console.log(`Removed mockup ID from ${updateResult.modifiedCount} products`);

    res.status(200).json({
      message: "Mockup image and all associated layers deleted successfully",
      success: true,
      data: {
        mockup: mockupImage,
        layersDeleted: deletedLayers.deletedCount,
        productsUpdated: updateResult.modifiedCount
      },
      status: 200
    });

  } catch (error) {
    console.error("Delete mockup error:", error);
    res.status(500).json({
      message: error.message,
      status: 500,
      success: false
    });
  }
};

// DUPLICATE MOCKUP WITH ALL LAYERS
export const duplicateMockup = async (req, res) => {
  try {
    const { mockupId } = req.params;
    const { productId } = req.body; // optional - agar naya mockup kisi specific product mein add karna hai

    // 1. Find original mockup
    const originalMockup = await mockupImageModel.findById(mockupId);
    if (!originalMockup) {
      return res.status(404).json({
        success: false,
        message: "Mockup not found"
      });
    }

    // 2. Create new mockup document (copy all fields except _id)
    const newMockupData = originalMockup.toObject();
    delete newMockupData._id;
    delete newMockupData.__v;
    delete newMockupData.createdAt;
    delete newMockupData.updatedAt;

    // Modify name to indicate it's a copy
    newMockupData.name = `${newMockupData.name} (Copy)`;

    // If productId provided, associate with it (optional)
    // Note: mockupImageModel doesn't have productId field; association is via product.mockupIds
    // So we don't need to set productId here.

    const newMockup = new mockupImageModel(newMockupData);
    await newMockup.save();

    // 3. Duplicate all layers associated with original mockup
    const Layer = mongoose.model("Layer"); // assuming Layer model is registered
    const originalLayers = await Layer.find({ mockupId: mockupId });

    const duplicatedLayers = [];
    for (const layer of originalLayers) {
      const layerData = layer.toObject();
      delete layerData._id;
      delete layerData.__v;
      delete layerData.createdAt;
      delete layerData.updatedAt;

      // Assign new mockupId
      layerData.mockupId = newMockup._id;

      // If there's an image, keep the same URL/public_id (no need to re-upload)
      // Cloudinary URLs remain valid.

      const newLayer = new Layer(layerData);
      await newLayer.save();
      duplicatedLayers.push(newLayer);
    }

    // 4. Return new mockup with layers
    res.status(201).json({
      success: true,
      message: "Mockup duplicated successfully",
      data: {
        mockup: newMockup,
        layersCount: duplicatedLayers.length
      }
    });

  } catch (error) {
    console.error("Duplicate mockup error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const updateMockup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mockup ID"
      });
    }

    const mockup = await mockupImageModel.findById(id);

    if (!mockup) {
      return res.status(404).json({
        success: false,
        message: "Mockup not found"
      });
    }

    mockup.name = name;
    await mockup.save();

    res.status(200).json({
      success: true,
      message: "Mockup updated successfully",
      data: mockup
    });
  } catch (error) {
    console.error("Update mockup error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};