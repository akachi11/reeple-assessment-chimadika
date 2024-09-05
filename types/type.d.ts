import {TextInputProps} from "react-native";

declare interface InputFieldProps extends TextInputProps {
    icon?: string;
    containerStyle?: string;
    inputStyle?: string;
    curr?: string;
    val?: number
}