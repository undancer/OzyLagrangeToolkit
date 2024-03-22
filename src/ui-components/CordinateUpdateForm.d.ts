/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Cordinate } from "../API.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CordinateUpdateFormInputValues = {
    x?: number;
    y?: number;
};
export declare type CordinateUpdateFormValidationValues = {
    x?: ValidationFunction<number>;
    y?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CordinateUpdateFormOverridesProps = {
    CordinateUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    x?: PrimitiveOverrideProps<TextFieldProps>;
    y?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CordinateUpdateFormProps = React.PropsWithChildren<{
    overrides?: CordinateUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    cordinate?: Cordinate;
    onSubmit?: (fields: CordinateUpdateFormInputValues) => CordinateUpdateFormInputValues;
    onSuccess?: (fields: CordinateUpdateFormInputValues) => void;
    onError?: (fields: CordinateUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CordinateUpdateFormInputValues) => CordinateUpdateFormInputValues;
    onValidate?: CordinateUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CordinateUpdateForm(props: CordinateUpdateFormProps): React.ReactElement;
