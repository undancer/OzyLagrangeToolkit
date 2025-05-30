/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getCity = /* GraphQL */ `query GetCity($id: ID!) {
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
    type
    createdAt
    owner
    updatedAt
    cityPosId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetCityQueryVariables, APITypes.GetCityQuery>;
export const listCities = /* GraphQL */ `query ListCities(
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
      type
      createdAt
      owner
      updatedAt
      cityPosId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCitiesQueryVariables,
  APITypes.ListCitiesQuery
>;
export const listCitiesWithSortedTime = /* GraphQL */ `query ListCitiesWithSortedTime(
  $type: String!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelCityFilterInput
  $limit: Int
  $nextToken: String
) {
  listCitiesWithSortedTime(
    type: $type
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
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
      type
      createdAt
      owner
      updatedAt
      cityPosId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCitiesWithSortedTimeQueryVariables,
  APITypes.ListCitiesWithSortedTimeQuery
>;
export const getCordinate = /* GraphQL */ `query GetCordinate($id: ID!) {
  getCordinate(id: $id) {
    id
    x
    y
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCordinateQueryVariables,
  APITypes.GetCordinateQuery
>;
export const listCordinates = /* GraphQL */ `query ListCordinates(
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
` as GeneratedQuery<
  APITypes.ListCordinatesQueryVariables,
  APITypes.ListCordinatesQuery
>;
