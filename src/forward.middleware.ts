import { Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import * as https from 'https';

@Injectable()
export class ForwardMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // Configurações específicas para desativar a validação SSL
            const axiosInstance = axios.create({
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false  // Opção para desativar a validação SSL
                }),
                responseType: 'stream' // Para lidar com streaming
            });

            console.log('Original URL:', req.originalUrl);
            console.log('Request Method:', req.method);
            console.log('Request Headers:', req.headers);
            console.log('Request Body:', req.body);

            // URL do servidor de destino
            const targetUrl = 'https://192.168.18.17:3333' + req.originalUrl;
            console.log('Target URL:', targetUrl);

            // Realiza a chamada para o servidor de destino
            const response = await axiosInstance({
                method: req.method as any,
                url: targetUrl,
                headers: req.headers,
                data: req.body,
            });

            // Encaminha a resposta para o cliente que fez a chamada original
            res.writeHead(response.status, response.headers);
            response.data.pipe(res); // Transmite os dados diretamente

        } catch (error) {
            // Trata os erros se necessário
            console.error('Erro ao encaminhar requisição:', error);
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                res.status(error.response.status).json(error.response.data);
            } else {
                next(error);
            }
        }
    }
}
