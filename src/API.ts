/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateCityInput = {
  id?: string | null,
  level: number,
  submitter: string,
  type: string,
  createdAt?: string | null,
  owner?: string | null,
  cityPosId: string,
};

export type ModelCityConditionInput = {
  level?: ModelIntInput | null,
  submitter?: ModelStringInput | null,
  type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelCityConditionInput | null > | null,
  or?: Array< ModelCityConditionInput | null > | null,
  not?: ModelCityConditionInput | null,
  cityPosId?: ModelIDInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type City = {
  __typename: "City",
  id: string,
  level: number,
  pos: Cordinate,
  submitter: string,
  type: string,
  createdAt: string,
  owner?: string | null,
  updatedAt: string,
  cityPosId: string,
};

export type Cordinate = {
  __typename: "Cordinate",
  id: string,
  x: number,
  y: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateCityInput = {
  id: string,
  level?: number | null,
  submitter?: string | null,
  type?: string | null,
  createdAt?: string | null,
  owner?: string | null,
  cityPosId?: string | null,
};

export type DeleteCityInput = {
  id: string,
};

export type CreateCordinateInput = {
  id?: string | null,
  x: number,
  y: number,
};

export type ModelCordinateConditionInput = {
  x?: ModelIntInput | null,
  y?: ModelIntInput | null,
  and?: Array< ModelCordinateConditionInput | null > | null,
  or?: Array< ModelCordinateConditionInput | null > | null,
  not?: ModelCordinateConditionInput | null,
};

export type UpdateCordinateInput = {
  id: string,
  x?: number | null,
  y?: number | null,
};

export type DeleteCordinateInput = {
  id: string,
};

export type ModelCityFilterInput = {
  id?: ModelIDInput | null,
  level?: ModelIntInput | null,
  submitter?: ModelStringInput | null,
  type?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelCityFilterInput | null > | null,
  or?: Array< ModelCityFilterInput | null > | null,
  not?: ModelCityFilterInput | null,
  cityPosId?: ModelIDInput | null,
};

export type ModelCityConnection = {
  __typename: "ModelCityConnection",
  items:  Array<City | null >,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelCordinateFilterInput = {
  id?: ModelIDInput | null,
  x?: ModelIntInput | null,
  y?: ModelIntInput | null,
  and?: Array< ModelCordinateFilterInput | null > | null,
  or?: Array< ModelCordinateFilterInput | null > | null,
  not?: ModelCordinateFilterInput | null,
};

export type ModelCordinateConnection = {
  __typename: "ModelCordinateConnection",
  items:  Array<Cordinate | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionCityFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  level?: ModelSubscriptionIntInput | null,
  submitter?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCityFilterInput | null > | null,
  or?: Array< ModelSubscriptionCityFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionCordinateFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  x?: ModelSubscriptionIntInput | null,
  y?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionCordinateFilterInput | null > | null,
  or?: Array< ModelSubscriptionCordinateFilterInput | null > | null,
};

export type CreateCityMutationVariables = {
  input: CreateCityInput,
  condition?: ModelCityConditionInput | null,
};

export type CreateCityMutation = {
  createCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type UpdateCityMutationVariables = {
  input: UpdateCityInput,
  condition?: ModelCityConditionInput | null,
};

export type UpdateCityMutation = {
  updateCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type DeleteCityMutationVariables = {
  input: DeleteCityInput,
  condition?: ModelCityConditionInput | null,
};

export type DeleteCityMutation = {
  deleteCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type CreateCordinateMutationVariables = {
  input: CreateCordinateInput,
  condition?: ModelCordinateConditionInput | null,
};

export type CreateCordinateMutation = {
  createCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCordinateMutationVariables = {
  input: UpdateCordinateInput,
  condition?: ModelCordinateConditionInput | null,
};

export type UpdateCordinateMutation = {
  updateCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCordinateMutationVariables = {
  input: DeleteCordinateInput,
  condition?: ModelCordinateConditionInput | null,
};

export type DeleteCordinateMutation = {
  deleteCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetCityQueryVariables = {
  id: string,
};

export type GetCityQuery = {
  getCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type ListCitiesQueryVariables = {
  filter?: ModelCityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCitiesQuery = {
  listCities?:  {
    __typename: "ModelCityConnection",
    items:  Array< {
      __typename: "City",
      id: string,
      level: number,
      submitter: string,
      type: string,
      createdAt: string,
      owner?: string | null,
      updatedAt: string,
      cityPosId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListCitiesWithSortedTimeQueryVariables = {
  type: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCitiesWithSortedTimeQuery = {
  listCitiesWithSortedTime?:  {
    __typename: "ModelCityConnection",
    items:  Array< {
      __typename: "City",
      id: string,
      level: number,
      submitter: string,
      type: string,
      createdAt: string,
      owner?: string | null,
      updatedAt: string,
      cityPosId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCordinateQueryVariables = {
  id: string,
};

export type GetCordinateQuery = {
  getCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCordinatesQueryVariables = {
  filter?: ModelCordinateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCordinatesQuery = {
  listCordinates?:  {
    __typename: "ModelCordinateConnection",
    items:  Array< {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateCitySubscriptionVariables = {
  filter?: ModelSubscriptionCityFilterInput | null,
};

export type OnCreateCitySubscription = {
  onCreateCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type OnUpdateCitySubscriptionVariables = {
  filter?: ModelSubscriptionCityFilterInput | null,
};

export type OnUpdateCitySubscription = {
  onUpdateCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type OnDeleteCitySubscriptionVariables = {
  filter?: ModelSubscriptionCityFilterInput | null,
};

export type OnDeleteCitySubscription = {
  onDeleteCity?:  {
    __typename: "City",
    id: string,
    level: number,
    pos:  {
      __typename: "Cordinate",
      id: string,
      x: number,
      y: number,
      createdAt: string,
      updatedAt: string,
    },
    submitter: string,
    type: string,
    createdAt: string,
    owner?: string | null,
    updatedAt: string,
    cityPosId: string,
  } | null,
};

export type OnCreateCordinateSubscriptionVariables = {
  filter?: ModelSubscriptionCordinateFilterInput | null,
};

export type OnCreateCordinateSubscription = {
  onCreateCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCordinateSubscriptionVariables = {
  filter?: ModelSubscriptionCordinateFilterInput | null,
};

export type OnUpdateCordinateSubscription = {
  onUpdateCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCordinateSubscriptionVariables = {
  filter?: ModelSubscriptionCordinateFilterInput | null,
};

export type OnDeleteCordinateSubscription = {
  onDeleteCordinate?:  {
    __typename: "Cordinate",
    id: string,
    x: number,
    y: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
