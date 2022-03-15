import * as prismic from '@prismicio/client';

export const repositoryName = '1rocketseat-ignews';
const endpoint = prismic.getRepositoryEndpoint(repositoryName);

// This factory function allows smooth preview setup
// export function createClient() {
//   const client = prismic.createClient(endpoint, {
//     accessToken: process.env.PRISMIC_ACCESS_TOKEN
//   })

//   return client
// }

export function createClient(config = {}) {
  const client = prismic.createClient(endpoint, {
    ...config,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  })

  return client
}
//========================react
// export const prismicClient = prismic.createClient(endpoint, {
//   accessToken: process.env.PRISMIC_ACCESS_TOKEN
// })
//=============rocketseat old
// export function getPrismicClient() {
//   const prismic = Prismic.createClient(
//     process.env.PRISMIC_ACCESS_TOKEN,
//     {
//       accessToken: process.env.PRISMIC_ACCESS_TOKEN
//     }
//   )

//   return prismic;
// }