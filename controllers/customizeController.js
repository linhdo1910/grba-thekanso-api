const Customize = require('../models/customizeModel');

exports.createLayout = async (req, res, next) => {
  try {
    const layoutData = req.body;
    const newLayout = await Customize.create(layoutData);
    res.status(201).json({
      success: true,
      data: newLayout,
      message: 'Layout created successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

exports.getLayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const layout = await Customize.findById(id).populate('items.productId');
    if (!layout) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Layout not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: layout,
      message: 'Layout retrieved',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const layoutData = req.body;
    const updatedLayout = await Customize.findByIdAndUpdate(id, layoutData, {
      new: true
    });
    if (!updatedLayout) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Layout not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: updatedLayout,
      message: 'Layout updated successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLayout = await Customize.findByIdAndDelete(id);
    if (!deletedLayout) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Layout not found',
        error: 'Not found'
      });
    }
    res.status(200).json({
      success: true,
      data: null,
      message: 'Layout deleted successfully',
      error: ''
    });
  } catch (error) {
    next(error);
  }
};
