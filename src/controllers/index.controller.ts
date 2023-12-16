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

    /**
     * @openapi
     *
     * /create:
     *  post:
     *    summary: create new authenticator
     *    requestBody:
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              name:
     *                type: string
     *                required: true
     *              key:
     *                type: string
     *                required: true
     *          example:
     *            name: facebook (username)
     *            key: secret
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json: {}
     */

    .post(
      '/create',
      authorizationMiddleware,
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

    /**
     * @openapi
     *
     * /read:
     *  get:
     *    summary: get list of authenticators
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json: {}
     */

    .get(
      '/read',
      authorizationMiddleware,
      wrapper(async function () {
        const authenticators = await authenticatorService.getList();

        return {
          authenticators,
        };
      }),
    )

    /**
     * @openapi
     *
     * /update:
     *  patch:
     *    summary: update existing authenticator
     *    requestBody:
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              id:
     *                type: string
     *                format: uuid
     *                required: true
     *              name:
     *                type: string
     *              key:
     *                type: string
     *    responses:
     *      '200':
     *        description: Successful response
     *        content:
     *          application/json: {}
     */

    .patch(
      '/update',
      authorizationMiddleware,
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

    /**
     * @openapi
     *
     * /delete/{id}:
     *  delete:
     *    summary: delete authenticator by id
     *    parameters:
     *      - name: id
     *        in: path
     *        schema:
     *          type: string
     *          format: uuid
     *          required: true
     *    responses:
     *      '200':
     *        description: Successful response
     */

    .delete(
      '/delete/:id',
      authorizationMiddleware,
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
