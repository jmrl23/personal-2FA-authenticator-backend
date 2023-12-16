import { Router } from 'express';
import { validate, wrapper } from '@jmrl23/express-helper';
import { AuthenticatorService } from '../services/authenticator.service';
import { AuthenticatorCreateDto } from '../dtos/AuthenticatorCreate.dto';
import { AuthenticatorUpdateDto } from '../dtos/AuthenticatorUpdate.dto';
import { AuthenticatorDeleteDto } from '../dtos/AuthenticatorDelete.dto';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';

export const controller = Router();

(async function () {
  const authenticatorService = await AuthenticatorService.getInstance();

  controller

    .get(
      '/',
      wrapper(function (_request, response) {
        response.status(200).end('OK');
      }),
    )

    .use(authorizationMiddleware)

    .post(
      '/create',
      validate('BODY', AuthenticatorCreateDto),
      wrapper(async function (request) {
        const authenticator = await authenticatorService.create(
          request.body.name,
          request.body.key,
        );

        return {
          authenticator,
        };
      }),
    )

    .get(
      '/read',
      wrapper(async function () {
        const authenticators = await authenticatorService.getList();

        return {
          authenticators,
        };
      }),
    )

    .patch(
      '/update',
      validate('BODY', AuthenticatorUpdateDto),
      wrapper(async function (request) {
        const authenticator = await authenticatorService.update(
          request.body.id,
          request.body.name,
          request.body.key,
        );

        return {
          authenticator,
        };
      }),
    )

    .delete(
      '/delete/:id',
      validate('PARAMS', AuthenticatorDeleteDto),
      wrapper(async function (request) {
        const authenticator = await authenticatorService.deleteById(
          request.params.id,
        );

        return {
          authenticator,
        };
      }),
    );
})();
