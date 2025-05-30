/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createCity = /* GraphQL */ `mutation CreateCity(
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
    type
    createdAt
    owner
    updatedAt
    cityPosId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCityMutationVariables,
  APITypes.CreateCityMutation
>;
export const updateCity = /* GraphQL */ `mutation UpdateCity(
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
    type
    createdAt
    owner
    updatedAt
    cityPosId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCityMutationVariables,
  APITypes.UpdateCityMutation
>;
export const deleteCity = /* GraphQL */ `mutation DeleteCity(
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
    type
    createdAt
    owner
    updatedAt
    cityPosId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCityMutationVariables,
  APITypes.DeleteCityMutation
>;
export const createCordinate = /* GraphQL */ `mutation CreateCordinate(
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
` as GeneratedMutation<
  APITypes.CreateCordinateMutationVariables,
  APITypes.CreateCordinateMutation
>;
export const updateCordinate = /* GraphQL */ `mutation UpdateCordinate(
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
` as GeneratedMutation<
  APITypes.UpdateCordinateMutationVariables,
  APITypes.UpdateCordinateMutation
>;
export const deleteCordinate = /* GraphQL */ `mutation DeleteCordinate(
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
` as GeneratedMutation<
  APITypes.DeleteCordinateMutationVariables,
  APITypes.DeleteCordinateMutation
>;
