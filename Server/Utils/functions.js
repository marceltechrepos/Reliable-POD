export const asyncHandler = (req, res, next) => {
  try {
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate entry found.",
        status: 409,
        success: false,
        error: error.keyValue,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};
