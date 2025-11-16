import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Votação de Jogos 2025',
    version: '1.0.0',
    description: 'API REST para gerenciar votação de jogos do ano 2025',
    contact: {
      name: 'Suporte API',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    schemas: {
      Jogo: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'ID único do jogo',
          },
          titulo: {
            type: 'string',
            description: 'Título do jogo',
          },
          plataforma: {
            type: 'string',
            description: 'Plataforma do jogo',
          },
        },
      },
      VotoRequest: {
        type: 'object',
        required: ['voterId', 'escolhas'],
        properties: {
          voterId: {
            type: 'string',
            description: 'ID único do votante',
            example: 'votante123',
          },
          escolhas: {
            type: 'array',
            description: 'Array com 3 IDs dos jogos escolhidos, ordenados por preferência',
            items: {
              type: 'string',
            },
            minItems: 3,
            maxItems: 3,
            example: ['jogo1', 'jogo2', 'jogo3'],
          },
        },
      },
      VotoResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              voterId: {
                type: 'string',
              },
              escolhas: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              dataVoto: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            description: 'Mensagem de erro',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos com anotações
};

export const swaggerSpec = swaggerJsdoc(options);
