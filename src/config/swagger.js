import swaggerJsdoc from 'swagger-jsdoc';
import { __dirname } from '../utils/utils.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentación de las APIs",
            description: "Información de productos y carrito",
            version: "1.0.0",
            contact: {
                name: "Matias Sanhueza"
            }
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
}

const spec = swaggerJsdoc(swaggerOptions);

export default spec;