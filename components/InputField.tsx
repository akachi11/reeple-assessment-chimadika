import { InputFieldProps } from "@/types/type";
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import CountryFlag from "react-native-country-flag"

const currencyToCountryMap: { [key: string]: string } = {
    USD: 'US',
    EUR: 'EU',
    GBP: 'GB',
    CAD: 'CA',
    NGN: 'NG',
    JPY: 'JP',
    AUD: 'AU',
    CNY: 'CN',
    INR: 'IN',
    ZAR: 'ZA',
};

const InputField = ({ icon, containerStyle, inputStyle, curr, val, ...props }: InputFieldProps) => {

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="mt-1 w-full">

                    <View className="px-5 flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500">
                        {val ?
                            <TextInput
                                className={`rounded-full p-2 font-JakartaSemiBold w-[230px] text-[20px] text-left`}
                                {...props}
                                keyboardType="numeric"
                                editable={false}
                                value={`${val}`}
                            />
                            :
                            <TextInput
                                className={`rounded-full p-2 font-JakartaSemiBold w-[230px] text-[20px] text-left`}
                                {...props}
                                keyboardType="numeric"
                            />
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default InputField