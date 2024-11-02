const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');

exports.deleteOne = Model =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document found for this ID ${id}`, 404));
    }

    res.status(204).send();
  });

exports.updateOne = Model =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = model =>
  asyncHandler(async (req, res) => {
    const document = await model.create(req.body);
    res.status(201).json(document);
  });

exports.getOne = (model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = model.findById(id);

    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const document = await query;

    if (!document) {
      return next(new ApiError('document not found', 404));
    }
    res.status(200).json(document);
  });

exports.getAll = (model, nameModel) =>
  asyncHandler(async (req, res) => {
    const mongoosQuery = model.find(req.filterObj || {});

    const apiFeatures = new ApiFeatures(mongoosQuery, req.query)
      .filter()
      .search(nameModel)
      .sort()
      .fields()
      .pagination();

    const documents = await apiFeatures.queryObj.exec();

    const totalDocuments = await model.countDocuments(apiFeatures.filters);

    const currentPage = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const totalPages = Math.ceil(totalDocuments / limit);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;

    res.status(200).json({
      result: documents.length,
      totalDocuments,
      totalPages,
      currentPage,
      nextPage,
      prevPage,
      documents,
    });
  });
