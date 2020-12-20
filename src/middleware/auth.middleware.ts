import { Injectable, NestMiddleware, NestModule } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";

import * as jwt from "jsonwebtoken";
import * as winston from "winston";
import { jwtSecret } from '../config/config';

@Injectable()
export class Auth implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        let token = req.header('x-access-token') || req.header('Authorization');
        try {

            if (!token) return res.status(200).json({ err: 20, message: 'No token provided.' });
            if (!token || !token.startsWith('Bearer')) return res.status(200).send({
                err: 17,
                message: 'Invalid schema provided'
            });

            /* for verified token if expired or still iat */
            token = token.slice(7, token.length).trimLeft();

            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    return res.status(200).send({
                        err: 1,
                        message: 'Failed to authenticate token.'
                    })
                }
                // @ts-ignore
                req.decoded = decoded;
                next()
            });
        } catch (rejectedValue) {

            winston.error(rejectedValue.message);
            return res.status(500).send({ err: 21, message: 'Internal Server Error' });

        }
    }

};