/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateCity = /* GraphQL */ `subscription OnCreateCity($filter: ModelSubscriptionCityFilterInput) {
  onCreateCity(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCitySubscriptionVariables,
  APITypes.OnCreateCitySubscription
>;
export const onUpdateCity = /* GraphQL */ `subscription OnUpdateCity($filter: ModelSubscriptionCityFilterInput) {
  onUpdateCity(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCitySubscriptionVariables,
  APITypes.OnUpdateCitySubscription
>;
export const onDeleteCity = /* GraphQL */ `subscription OnDeleteCity($filter: ModelSubscriptionCityFilterInput) {
  onDeleteCity(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCitySubscriptionVariables,
  APITypes.OnDeleteCitySubscription
>;
export const onCreateCordinate = /* GraphQL */ `subscription OnCreateCordinate($filter: ModelSubscriptionCordinateFilterInput) {
  onCreateCordinate(filter: $filter) {
    id
    x
    y
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCordinateSubscriptionVariables,
  APITypes.OnCreateCordinateSubscription
>;
export const onUpdateCordinate = /* GraphQL */ `subscription OnUpdateCordinate($filter: ModelSubscriptionCordinateFilterInput) {
  onUpdateCordinate(filter: $filter) {
    id
    x
    y
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCordinateSubscriptionVariables,
  APITypes.OnUpdateCordinateSubscription
>;
export const onDeleteCordinate = /* GraphQL */ `subscription OnDeleteCordinate($filter: ModelSubscriptionCordinateFilterInput) {
  onDeleteCordinate(filter: $filter) {
    id
    x
    y
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCordinateSubscriptionVariables,
  APITypes.OnDeleteCordinateSubscription
>;
