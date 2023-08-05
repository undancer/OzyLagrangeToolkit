/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCity = /* GraphQL */ `
  mutation CreateCity(
    $input: CreateCityInput!
    $condition: ModelCityConditionInput
  ) {
    createCity(input: $input, condition: $condition) {
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
export const updateCity = /* GraphQL */ `
  mutation UpdateCity(
    $input: UpdateCityInput!
    $condition: ModelCityConditionInput
  ) {
    updateCity(input: $input, condition: $condition) {
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
export const deleteCity = /* GraphQL */ `
  mutation DeleteCity(
    $input: DeleteCityInput!
    $condition: ModelCityConditionInput
  ) {
    deleteCity(input: $input, condition: $condition) {
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
export const createCordinate = /* GraphQL */ `
  mutation CreateCordinate(
    $input: CreateCordinateInput!
    $condition: ModelCordinateConditionInput
  ) {
    createCordinate(input: $input, condition: $condition) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCordinate = /* GraphQL */ `
  mutation UpdateCordinate(
    $input: UpdateCordinateInput!
    $condition: ModelCordinateConditionInput
  ) {
    updateCordinate(input: $input, condition: $condition) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCordinate = /* GraphQL */ `
  mutation DeleteCordinate(
    $input: DeleteCordinateInput!
    $condition: ModelCordinateConditionInput
  ) {
    deleteCordinate(input: $input, condition: $condition) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
