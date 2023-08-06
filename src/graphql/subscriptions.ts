/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCity = /* GraphQL */ `
  subscription OnCreateCity($filter: ModelSubscriptionCityFilterInput) {
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
`;
export const onUpdateCity = /* GraphQL */ `
  subscription OnUpdateCity($filter: ModelSubscriptionCityFilterInput) {
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
`;
export const onDeleteCity = /* GraphQL */ `
  subscription OnDeleteCity($filter: ModelSubscriptionCityFilterInput) {
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
`;
export const onCreateCordinate = /* GraphQL */ `
  subscription OnCreateCordinate(
    $filter: ModelSubscriptionCordinateFilterInput
  ) {
    onCreateCordinate(filter: $filter) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCordinate = /* GraphQL */ `
  subscription OnUpdateCordinate(
    $filter: ModelSubscriptionCordinateFilterInput
  ) {
    onUpdateCordinate(filter: $filter) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCordinate = /* GraphQL */ `
  subscription OnDeleteCordinate(
    $filter: ModelSubscriptionCordinateFilterInput
  ) {
    onDeleteCordinate(filter: $filter) {
      id
      x
      y
      createdAt
      updatedAt
      __typename
    }
  }
`;
