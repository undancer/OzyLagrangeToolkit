/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CordinateCreateFormInputValues = {
    x?: number;
    y?: number;
};
export declare type CordinateCreateFormValidationValues = {
    x?: ValidationFunction<number>;
    y?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CordinateCreateFormOverridesProps = {
    CordinateCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    x?: PrimitiveOverrideProps<TextFieldProps>;
    y?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CordinateCreateFormProps = React.PropsWithChildren<{
    overrides?: CordinateCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CordinateCreateFormInputValues) => CordinateCreateFormInputValues;
    onSuccess?: (fields: CordinateCreateFormInputValues) => void;
    onError?: (fields: CordinateCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CordinateCreateFormInputValues) => CordinateCreateFormInputValues;
    onValidate?: CordinateCreateFormValidationValues;
} & React.CSSProperties>;
export default function CordinateCreateForm(props: CordinateCreateFormProps): React.ReactElement;
