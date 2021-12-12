import { tipos } from './graphql/types.js';
import { resolvers } from './graphql/resolvers.js';
import { gql } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server-express';
import conectarBD from './db/db.js';
import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();
await conectarBD();

const server = new ApolloServer({
  typeDefs: tipos,
  resolvers: resolvers,
});

it('fetches user', async () => {
  const result = await server.executeOperation({
    query: gql`
      query Usuario($id: String!) {
        Usuario(_id: $id) {
          correo
        }
      }
    `,
    variables: {
      id: '61b2afd47e873cb9b7371da3',
    },
  });

  assert.equal(result.data.Usuario.correo, 'test@test.com');
});

it('creates user', async () => {
  const result = await server.executeOperation({
    query: gql`
      mutation CrearUsuario(
        $nombre: String!
        $apellidos: String!
        $identificacion: String!
        $correo: String!
        $rol: Enum_Rol!
        $password: String!
      ) {
        crearUsuario(
          nombre: $nombre
          apellidos: $apellidos
          identificacion: $identificacion
          correo: $correo
          rol: $rol
          password: $password
        ) {
          _id
        }
      }
    `,
    variables: {
      nombre: 'Alcides',
      apellido: 'Caballero',
      identificacion: '5656664',
      correo: 'alcides@gmail.com',
      rol: 'ADMINISTRADOR',
      password: '12345',
    },
  });

  assert.notEqual(result.data.CrearUsuario, null);
});
