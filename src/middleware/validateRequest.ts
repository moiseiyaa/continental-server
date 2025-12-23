import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, Result, ValidationError } from 'express-validator';

interface FormattedError {
  message: string;
  field?: string;
  value?: any;
}

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = errors.array().map((err): FormattedError => {
      if ('param' in err) {
        return {
          message: err.msg,
          field: err.param,
          value: 'value' in err ? err.value : undefined,
        };
      }
      return { message: err.msg };
    });

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: formattedErrors,
    });
  };
};

export const validate = (validations: ValidationChain[]) => {
  return [
    ...validations,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err): FormattedError => ({
          message: err.msg,
          ...('param' in err && { field: err.param }),
          ...('value' in err && { value: err.value })
        }));
        
        return res.status(400).json({ 
          success: false,
          errors: formattedErrors
        });
      }
      next();
    }
  ];
};
