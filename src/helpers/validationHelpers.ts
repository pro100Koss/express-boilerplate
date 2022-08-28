import _ from 'lodash';
import {Request, Response} from 'express';
import {RequestValidation} from 'express-validator';

export const sendValidationErrors = (req: Request | RequestValidation, res: Response) => {
  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).send({
      errors: _.uniq(errors.map((item: any) => item.msg)),
    });
  }
};
