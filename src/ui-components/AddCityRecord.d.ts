/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AddCityRecordInputValues = {};
export declare type AddCityRecordValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AddCityRecordOverridesProps = {
    AddCityRecordGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type AddCityRecordProps = React.PropsWithChildren<{
    overrides?: AddCityRecordOverridesProps | undefined | null;
} & {
    onSubmit: (fields: AddCityRecordInputValues) => void;
    onChange?: (fields: AddCityRecordInputValues) => AddCityRecordInputValues;
    onValidate?: AddCityRecordValidationValues;
} & React.CSSProperties>;
export default function AddCityRecord(props: AddCityRecordProps): React.ReactElement;
