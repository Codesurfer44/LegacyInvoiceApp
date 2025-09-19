// Backend/utils/validateRequest.js
const Joi = require('joi');

const invoiceSchema = Joi.object({
  invoiceNumber: Joi.string().required(),
  clientName: Joi.string().required(),
  clientEmail: Joi.string().email().required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  tax: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional(),
  status: Joi.string().valid('Pending', 'Paid', 'Draft', 'Sent').optional(),
  currency: Joi.string().optional(),
  dueDate: Joi.date().optional(),
  paymentMethod: Joi.string().optional(),
  notes: Joi.string().optional(),
  createdBy: Joi.string().optional(),

  invoiceDate: Joi.date().optional(),
  clientCompany: Joi.string().allow('').optional(),
  clientPhone: Joi.string().allow('').optional(),
  clientAddress: Joi.string().allow('').optional(),
  paymentTerms: Joi.string().allow('').optional()
});

const validateInvoice = (req, res, next) => {
  const { error } = invoiceSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map(d => d.message),
    });
  }
  next();
};

module.exports = { validateInvoice };