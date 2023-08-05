/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCity = /* GraphQL */ `
  query GetCity($id: ID!) {
    getCity(id: $id) {
      id
      level
      pos {
        id
        x
        y
        createdAt
        updatedAt
        __typename
      }
      submitter
      createdAt
      updatedAt
      cityPosId
      __typename
    }
  }
`;
export const listCities = /* GraphQL */ `
  query ListCities(
    $filter: ModelCityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCities(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        level
        pos {
          id
          x
          y
          createdAt
          updatedAt
          __typename
        }
        submitter
        createdAt
        updatedAt
        cityPosId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCordinate = /* GraphQL */ `
  query GetCordinate($id: ID!) {
    getCordinate(id: $id) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCordinates = /* GraphQL */ `
  query ListCordinates(
    $filter: ModelCordinateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCordinates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        x
        y
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
