import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import ReactNativeModal from "react-native-modal";
import errorImg from "../assets/images/error-icon.png"
import reeple from "../assets/images/reeple-1.png"
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import InputField from "@/components/InputField";
import CountryFlag from "react-native-country-flag"
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CurrencyRates {
    USD: number;
    EUR: number;
    GBP: number;
    CAD: number;
    NGN: number;
    JPY: number;
    AUD: number;
    CNY: number;
    INR: number;
    ZAR: number;
}

interface CurrencyInfo {
    symbol: string;
    countryCode: string;
    name: string;
};

const currencies = [
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "NGN",
    "JPY",
    "AUD",
    "CNY",
    "INR",
    "ZAR"
]

const Home = () => {

    const [baseCurrency, setBaseCurrency] = useState<string>("USD")
    const [convCurrency, setConvCurrency] = useState<string>("NGN")
    const [allCurrencies, setAllCurrencies] = useState<string[]>([])
    const [favCurrencies, setFavCurrencies] = useState<CurrencyInfo[]>([])
    const [favoritesRates, setFavoritesRates] = useState<Record<string, number>>({});
    const [convAmount, setConvAmount] = useState<number>(1000)
    const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(null);
    const [dropdown, setDropdown] = useState<boolean>(false)
    const [errorModal, setErrorModal] = useState<boolean>(false)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const scrollViewRef = useRef<ScrollView>(null);
    const [lastTime, setLastTime] = useState<number>(Date.now())

    const formatDate = (timestamp: number) => {
        const currentDate = new Date();
        const recordedDate = new Date(timestamp);

        // Check if the recorded date is today
        const isToday =
            recordedDate.getDate() === currentDate.getDate() &&
            recordedDate.getMonth() === currentDate.getMonth() &&
            recordedDate.getFullYear() === currentDate.getFullYear();

        if (isToday) {
            return 'Today';
        } else {
            // Return the date in a readable format (e.g., 'YYYY-MM-DD')
            return recordedDate.toLocaleDateString();
        }
    };

    const apiKey = `${process.env.EXPO_PUBLIC_EXCHANGE_RATE_API_KEY}`

    const getRates = async () => {
        try {
            await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`)
                .then((res) => {
                    const filteredRates = Object.keys(res.data.conversion_rates)
                        .filter((currencyCode) => favCurrencies.some(fav => {
                            const code = Object.keys(currencyToCountryMap).find(
                                (key) => currencyToCountryMap[key]?.countryCode === fav?.countryCode
                            );
                            return (code === currencyCode)
                        }))
                        .reduce((acc, currencyCode) => {
                            acc[currencyCode] = res.data.conversion_rates[currencyCode];
                            return acc;
                        }, {} as Record<string, number>);

                    setFavoritesRates(filteredRates);
                })
        } catch (error: any) {
            if (error.response.data["error-type"] === "inactive-account") {
                Alert.alert("Invalid api key")
            } else if (error.response.data["error-type"] === "inactive-account") {
                Alert.alert("Invalid api key")
            } else if (error.response.data["error-type"] === "unsupported-code") {
                Alert.alert("The currency code provided is not supported")
            } else if (error.response.data["error-type"] === "quota-reached") {
                Alert.alert("You have reached your maximum request quota")
            } else {
                console.log(error)
                setErrorModal(true)
            }
        }
    }

    const currencyToCountryMap: Record<string, { symbol: string, countryCode: string, name: string }> = {
        AED: { symbol: "د.إ", countryCode: "AE", name: "United Arab Emirates Dirham" },
        AFN: { symbol: "؋", countryCode: "AF", name: "Afghan Afghani" },
        ALL: { symbol: "L", countryCode: "AL", name: "Albanian Lek" },
        AMD: { symbol: "֏", countryCode: "AM", name: "Armenian Dram" },
        ANG: { symbol: "ƒ", countryCode: "CW", name: "Netherlands Antillean Guilder" },
        AOA: { symbol: "Kz", countryCode: "AO", name: "Angolan Kwanza" },
        ARS: { symbol: "$", countryCode: "AR", name: "Argentine Peso" },
        AUD: { symbol: "$", countryCode: "AU", name: "Australian Dollar" },
        AWG: { symbol: "ƒ", countryCode: "AW", name: "Aruban Florin" },
        AZN: { symbol: "₼", countryCode: "AZ", name: "Azerbaijani Manat" },
        BAM: { symbol: "KM", countryCode: "BA", name: "Bosnia-Herzegovina Convertible Mark" },
        BBD: { symbol: "$", countryCode: "BB", name: "Barbadian Dollar" },
        BDT: { symbol: "৳", countryCode: "BD", name: "Bangladeshi Taka" },
        BGN: { symbol: "лв", countryCode: "BG", name: "Bulgarian Lev" },
        BHD: { symbol: "ب.د", countryCode: "BH", name: "Bahraini Dinar" },
        BIF: { symbol: "Fr", countryCode: "BI", name: "Burundian Franc" },
        BMD: { symbol: "$", countryCode: "BM", name: "Bermudian Dollar" },
        BND: { symbol: "$", countryCode: "BN", name: "Brunei Dollar" },
        BOB: { symbol: "Bs.", countryCode: "BO", name: "Bolivian Boliviano" },
        BRL: { symbol: "R$", countryCode: "BR", name: "Brazilian Real" },
        BSD: { symbol: "$", countryCode: "BS", name: "Bahamian Dollar" },
        BTN: { symbol: "Nu.", countryCode: "BT", name: "Bhutanese Ngultrum" },
        BWP: { symbol: "P", countryCode: "BW", name: "Botswana Pula" },
        BYN: { symbol: "Br", countryCode: "BY", name: "Belarusian Ruble" },
        BZD: { symbol: "$", countryCode: "BZ", name: "Belize Dollar" },
        CAD: { symbol: "$", countryCode: "CA", name: "Canadian Dollar" },
        CDF: { symbol: "Fr", countryCode: "CD", name: "Congolese Franc" },
        CHF: { symbol: "Fr", countryCode: "CH", name: "Swiss Franc" },
        CLP: { symbol: "$", countryCode: "CL", name: "Chilean Peso" },
        CNY: { symbol: "¥", countryCode: "CN", name: "Chinese Yuan" },
        COP: { symbol: "$", countryCode: "CO", name: "Colombian Peso" },
        CRC: { symbol: "₡", countryCode: "CR", name: "Costa Rican Colón" },
        CUP: { symbol: "$", countryCode: "CU", name: "Cuban Peso" },
        CVE: { symbol: "Esc", countryCode: "CV", name: "Cape Verdean Escudo" },
        CZK: { symbol: "Kč", countryCode: "CZ", name: "Czech Koruna" },
        DJF: { symbol: "Fr", countryCode: "DJ", name: "Djiboutian Franc" },
        DKK: { symbol: "kr", countryCode: "DK", name: "Danish Krone" },
        DOP: { symbol: "$", countryCode: "DO", name: "Dominican Peso" },
        DZD: { symbol: "د.ج", countryCode: "DZ", name: "Algerian Dinar" },
        EGP: { symbol: "£", countryCode: "EG", name: "Egyptian Pound" },
        ERN: { symbol: "Nkf", countryCode: "ER", name: "Eritrean Nakfa" },
        ETB: { symbol: "Br", countryCode: "ET", name: "Ethiopian Birr" },
        EUR: { symbol: "€", countryCode: "EU", name: "Euro" },
        FJD: { symbol: "$", countryCode: "FJ", name: "Fijian Dollar" },
        FKP: { symbol: "£", countryCode: "FK", name: "Falkland Islands Pound" },
        FOK: { symbol: "kr", countryCode: "FO", name: "Faroese Króna" },
        GBP: { symbol: "£", countryCode: "GB", name: "British Pound Sterling" },
        GEL: { symbol: "₾", countryCode: "GE", name: "Georgian Lari" },
        GGP: { symbol: "£", countryCode: "GG", name: "Guernsey Pound" },
        GHS: { symbol: "₵", countryCode: "GH", name: "Ghanaian Cedi" },
        GIP: { symbol: "£", countryCode: "GI", name: "Gibraltar Pound" },
        GMD: { symbol: "D", countryCode: "GM", name: "Gambian Dalasi" },
        GNF: { symbol: "Fr", countryCode: "GN", name: "Guinean Franc" },
        GTQ: { symbol: "Q", countryCode: "GT", name: "Guatemalan Quetzal" },
        GYD: { symbol: "$", countryCode: "GY", name: "Guyanese Dollar" },
        HKD: { symbol: "$", countryCode: "HK", name: "Hong Kong Dollar" },
        HNL: { symbol: "L", countryCode: "HN", name: "Honduran Lempira" },
        HRK: { symbol: "kn", countryCode: "HR", name: "Croatian Kuna" },
        HTG: { symbol: "G", countryCode: "HT", name: "Haitian Gourde" },
        HUF: { symbol: "Ft", countryCode: "HU", name: "Hungarian Forint" },
        IDR: { symbol: "Rp", countryCode: "ID", name: "Indonesian Rupiah" },
        ILS: { symbol: "₪", countryCode: "IL", name: "Israeli New Shekel" },
        IMP: { symbol: "£", countryCode: "IM", name: "Isle of Man Pound" },
        INR: { symbol: "₹", countryCode: "IN", name: "Indian Rupee" },
        IQD: { symbol: "ع.د", countryCode: "IQ", name: "Iraqi Dinar" },
        IRR: { symbol: "﷼", countryCode: "IR", name: "Iranian Rial" },
        ISK: { symbol: "kr", countryCode: "IS", name: "Icelandic Króna" },
        JEP: { symbol: "£", countryCode: "JE", name: "Jersey Pound" },
        JMD: { symbol: "$", countryCode: "JM", name: "Jamaican Dollar" },
        JOD: { symbol: "د.ا", countryCode: "JO", name: "Jordanian Dinar" },
        JPY: { symbol: "¥", countryCode: "JP", name: "Japanese Yen" },
        KES: { symbol: "Sh", countryCode: "KE", name: "Kenyan Shilling" },
        KGS: { symbol: "с", countryCode: "KG", name: "Kyrgyzstani Som" },
        KHR: { symbol: "៛", countryCode: "KH", name: "Cambodian Riel" },
        KID: { symbol: "$", countryCode: "KI", name: "Kiribati Dollar" },
        KMF: { symbol: "Fr", countryCode: "KM", name: "Comorian Franc" },
        KRW: { symbol: "₩", countryCode: "KR", name: "South Korean Won" },
        KWD: { symbol: "د.ك", countryCode: "KW", name: "Kuwaiti Dinar" },
        KYD: { symbol: "$", countryCode: "KY", name: "Cayman Islands Dollar" },
        KZT: { symbol: "₸", countryCode: "KZ", name: "Kazakhstani Tenge" },
        LAK: { symbol: "₭", countryCode: "LA", name: "Lao Kip" },
        LBP: { symbol: "ل.ل", countryCode: "LB", name: "Lebanese Pound" },
        LKR: { symbol: "Rs", countryCode: "LK", name: "Sri Lankan Rupee" },
        LRD: { symbol: "$", countryCode: "LR", name: "Liberian Dollar" },
        LSL: { symbol: "L", countryCode: "LS", name: "Lesotho Loti" },
        LYD: { symbol: "ل.د", countryCode: "LY", name: "Libyan Dinar" },
        MAD: { symbol: "د.م.", countryCode: "MA", name: "Moroccan Dirham" },
        MDL: { symbol: "L", countryCode: "MD", name: "Moldovan Leu" },
        MGA: { symbol: "Ar", countryCode: "MG", name: "Malagasy Ariary" },
        MKD: { symbol: "ден", countryCode: "MK", name: "Macedonian Denar" },
        MMK: { symbol: "K", countryCode: "MM", name: "Burmese Kyat" },
        MNT: { symbol: "₮", countryCode: "MN", name: "Mongolian Tögrög" },
        MOP: { symbol: "P", countryCode: "MO", name: "Macanese Pataca" },
        MRU: { symbol: "UM", countryCode: "MR", name: "Mauritanian Ouguiya" },
        MUR: { symbol: "₨", countryCode: "MU", name: "Mauritian Rupee" },
        MVR: { symbol: "ރ.", countryCode: "MV", name: "Maldivian Rufiyaa" },
        MWK: { symbol: "MK", countryCode: "MW", name: "Malawian Kwacha" },
        MXN: { symbol: "$", countryCode: "MX", name: "Mexican Peso" },
        MYR: { symbol: "RM", countryCode: "MY", name: "Malaysian Ringgit" },
        MZN: { symbol: "MT", countryCode: "MZ", name: "Mozambican Metical" },
        NAD: { symbol: "$", countryCode: "NA", name: "Namibian Dollar" },
        NGN: { symbol: "₦", countryCode: "NG", name: "Nigerian Naira" },
        NIO: { symbol: "C$", countryCode: "NI", name: "Nicaraguan Córdoba" },
        NOK: { symbol: "kr", countryCode: "NO", name: "Norwegian Krone" },
        NPR: { symbol: "₨", countryCode: "NP", name: "Nepalese Rupee" },
        NZD: { symbol: "$", countryCode: "NZ", name: "New Zealand Dollar" },
        OMR: { symbol: "ر.ع.", countryCode: "OM", name: "Omani Rial" },
        PAB: { symbol: "B/.", countryCode: "PA", name: "Panamanian Balboa" },
        PEN: { symbol: "S/.", countryCode: "PE", name: "Peruvian Sol" },
        PGK: { symbol: "K", countryCode: "PG", name: "Papua New Guinean Kina" },
        PHP: { symbol: "₱", countryCode: "PH", name: "Philippine Peso" },
        PKR: { symbol: "₨", countryCode: "PK", name: "Pakistani Rupee" },
        PLN: { symbol: "zł", countryCode: "PL", name: "Polish Złoty" },
        PYG: { symbol: "₲", countryCode: "PY", name: "Paraguayan Guaraní" },
        QAR: { symbol: "ر.ق", countryCode: "QA", name: "Qatari Riyal" },
        RON: { symbol: "lei", countryCode: "RO", name: "Romanian Leu" },
        RSD: { symbol: "дин.", countryCode: "RS", name: "Serbian Dinar" },
        RUB: { symbol: "₽", countryCode: "RU", name: "Russian Ruble" },
        RWF: { symbol: "Fr", countryCode: "RW", name: "Rwandan Franc" },
        SAR: { symbol: "ر.س", countryCode: "SA", name: "Saudi Riyal" },
        SBD: { symbol: "$", countryCode: "SB", name: "Solomon Islands Dollar" },
        SCR: { symbol: "₨", countryCode: "SC", name: "Seychellois Rupee" },
        SDG: { symbol: "£", countryCode: "SD", name: "Sudanese Pound" },
        SEK: { symbol: "kr", countryCode: "SE", name: "Swedish Krona" },
        SGD: { symbol: "$", countryCode: "SG", name: "Singapore Dollar" },
        SHP: { symbol: "£", countryCode: "SH", name: "Saint Helena Pound" },
        SLL: { symbol: "Le", countryCode: "SL", name: "Sierra Leonean Leone" },
        SOS: { symbol: "Sh", countryCode: "SO", name: "Somali Shilling" },
        SRD: { symbol: "$", countryCode: "SR", name: "Surinamese Dollar" },
        SSP: { symbol: "£", countryCode: "SS", name: "South Sudanese Pound" },
        STN: { symbol: "Db", countryCode: "ST", name: "São Tomé and Príncipe Dobra" },
        SYP: { symbol: "£", countryCode: "SY", name: "Syrian Pound" },
        SZL: { symbol: "L", countryCode: "SZ", name: "Swazi Lilangeni" },
        THB: { symbol: "฿", countryCode: "TH", name: "Thai Baht" },
        TJS: { symbol: "ЅМ", countryCode: "TJ", name: "Tajikistani Somoni" },
        TMT: { symbol: "T", countryCode: "TM", name: "Turkmenistani Manat" },
        TND: { symbol: "د.ت", countryCode: "TN", name: "Tunisian Dinar" },
        TOP: { symbol: "T$", countryCode: "TO", name: "Tongan Paʻanga" },
        TRY: { symbol: "₺", countryCode: "TR", name: "Turkish Lira" },
        TTD: { symbol: "$", countryCode: "TT", name: "Trinidad and Tobago Dollar" },
        TVD: { symbol: "$", countryCode: "TV", name: "Tuvaluan Dollar" },
        TWD: { symbol: "NT$", countryCode: "TW", name: "New Taiwan Dollar" },
        TZS: { symbol: "Sh", countryCode: "TZ", name: "Tanzanian Shilling" },
        UAH: { symbol: "₴", countryCode: "UA", name: "Ukrainian Hryvnia" },
        UGX: { symbol: "Sh", countryCode: "UG", name: "Ugandan Shilling" },
        USD: { symbol: "$", countryCode: "US", name: "United States Dollar" },
        UYU: { symbol: "$", countryCode: "UY", name: "Uruguayan Peso" },
        UZS: { symbol: "сўм", countryCode: "UZ", name: "Uzbekistani So'm" },
        VES: { symbol: "Bs.S", countryCode: "VE", name: "Venezuelan Bolívar" },
        VND: { symbol: "₫", countryCode: "VN", name: "Vietnamese Đồng" },
        VUV: { symbol: "Vt", countryCode: "VU", name: "Vanuatu Vatu" },
        WST: { symbol: "T", countryCode: "WS", name: "Samoan Tālā" },
        XAF: { symbol: "Fr", countryCode: "CM", name: "Central African CFA Franc" },
        XCD: { symbol: "$", countryCode: "AG", name: "East Caribbean Dollar" },
        XOF: { symbol: "Fr", countryCode: "SN", name: "West African CFA Franc" },
        XPF: { symbol: "Fr", countryCode: "PF", name: "CFP Franc" },
        YER: { symbol: "﷼", countryCode: "YE", name: "Yemeni Rial" },
        ZAR: { symbol: "R", countryCode: "ZA", name: "South African Rand" },
        ZMW: { symbol: "ZK", countryCode: "ZM", name: "Zambian Kwacha" },
        ZWL: { symbol: "$", countryCode: "ZW", name: "Zimbabwean Dollar" }
    };

    const addFavorite = (currencyCode: string) => {
        const currency = currencyToCountryMap[currencyCode];
        if (currency && !favCurrencies.some(fav => fav.name === currency.name)) {
            const updatedCurrencies = ([...favCurrencies, currency]);
            storeData("favCurrencies", updatedCurrencies)
            setFavCurrencies(updatedCurrencies)
        }
    };

    const removeFavorite = (currencyCode: string) => {
        const updatedCurrencies = (favCurrencies.filter(fav => fav.name !== currencyToCountryMap[currencyCode].name));
        storeData("favCurrencies", updatedCurrencies)
        setFavCurrencies(updatedCurrencies)
    };

    const storeData = async (key: string, value: CurrencyInfo[] | string) => {
        try {
            await AsyncStorage.setItem(`${key}`, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    };

    useEffect(() => {
        getRates()
        setLastTime(Date.now());
    }, [favCurrencies, baseCurrency])

    const handleSheetChanges = useCallback((index: number) => {
        if (index !== 0) {
            setDropdown(false);
        }
    }, []);

    useEffect(() => {
        setLastTime(Date.now());
        const fetchData = async () => {
            try {
                const storedCurr = await AsyncStorage.getItem("favCurrencies");
                if (storedCurr !== null) {
                    setFavCurrencies(JSON.parse(storedCurr));
                }
                const storedBase = await AsyncStorage.getItem("baseCurrency");
                if (storedBase !== null) {
                    setBaseCurrency(JSON.parse(storedBase));
                }
            } catch (e) {
                console.error('Error fetching data from AsyncStorage:', e);
            }
        };

        fetchData();
    }, []);

    return (
        <GestureHandlerRootView>
            <SafeAreaView className="px-3 bg-blue-200 h-full">
                <View>
                    <Image source={reeple} className="w-[100px]" resizeMode="contain" />
                </View>

                <View>
                    <InputField onChangeText={(text) => setConvAmount(Number(text))} placeholder={`Enter ${baseCurrency}`} />
                    <View className="flex flex-row justify-between items-center">
                        <View className="flex flex-row justify-between items-center">
                            <View className="flex flex-col gap-5">
                                <View className="mr-2 flex flex-row gap-1 items-center">
                                    <CountryFlag
                                        isoCode={currencyToCountryMap[baseCurrency]?.countryCode}
                                        size={20}
                                        style={{
                                            borderRadius: 4,
                                        }}
                                    />
                                    <TouchableOpacity className="font-JakartaBold flex flex-row items-center" onPress={() => setDropdown(!dropdown)}>
                                        <Text className="font-JakartaBold">
                                            {baseCurrency}
                                        </Text>
                                        <AntDesign name="caretdown" size={10} color="black" />
                                    </TouchableOpacity>
                                </View>
                                {dropdown &&
                                    <View className="absolute bg-blue-100 p-4 pt-1 pl-1 rounded-md flex flex-col gap-1 top-10 z-10">
                                        {currencies.map((currency, i) => {
                                            if (currency !== baseCurrency) {
                                                return (
                                                    <TouchableOpacity key={i} className="flex flex-row gap-1" onPress={() => { setBaseCurrency(currency); setDropdown(false); storeData("baseCurrency", currency) }}>
                                                        <CountryFlag
                                                            isoCode={currencyToCountryMap[currency]?.countryCode}
                                                            size={25}
                                                            style={{
                                                                borderRadius: 4,
                                                                width: 40,
                                                                height: 30,
                                                            }}
                                                        />

                                                        <Text className="font-JakartaBold">{currency}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        })}
                                    </View>
                                }
                            </View>
                        </View>

                        <Text>Prices last updated: {formatDate(lastTime)}</Text>
                    </View>
                </View>

                <ScrollView className="bg-blue-100 w-full h-full mb-[40px] rounded-3xl p-[20px] mt-5 z-1">
                    <Text className="font-JakartaBold text-[15px]">Favorites</Text>

                    <View className="flex flex-col gap-5 mt-2 pb-[100px]">
                        {favCurrencies?.map((curr, i) => {
                            const currencyCode = Object.keys(currencyToCountryMap).find(
                                (key) => currencyToCountryMap[key]?.countryCode === curr?.countryCode
                            );
                            return (
                                <View key={i} className="flex flex-row justify-between items-center bg-gray-100 p-3 rounded-md">
                                    <View className="flex flex-row items-center gap-2">
                                        <CountryFlag
                                            isoCode={currencyToCountryMap[currencyCode!]?.countryCode}
                                            size={25}
                                            style={{
                                                borderRadius: 4,
                                            }}
                                        />
                                        <Text className="font-JakartaBold text-[15px]">{currencyCode}</Text>
                                    </View>

                                    <View className="flex flex-row items-center gap-5">
                                        <View>
                                            <Text className="font-JakartaBold text-[20px]">{currencyToCountryMap[currencyCode!]?.symbol}{(convAmount * favoritesRates[currencyCode!])?.toFixed(2)}</Text>
                                            <Text className="font-Jakarta text-[11px]">{currencyToCountryMap[baseCurrency]?.symbol}1 = {currencyToCountryMap[currencyCode!]?.symbol} {(favoritesRates[currencyCode!])?.toFixed(2)}</Text>
                                        </View>

                                        <AntDesign onPress={() => removeFavorite(currencyCode!)} name="delete" size={25} color="red" />
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>

                <BottomSheet ref={bottomSheetRef} snapPoints={['10%', '85%']} index={0} onChange={handleSheetChanges}>
                    <BottomSheetScrollView ref={scrollViewRef} style={{ flexGrow: 1, padding: 20, paddingTop: 10 }}>
                        <Text className="font-JakartaBold text-[15px] pb-10">Add favorites</Text>
                        <View className="flex flex-col gap-5 flex-1 pb-[100px]">
                            {Object.keys(currencyToCountryMap).map((currency, i) => (
                                <TouchableOpacity key={i} className="flex flex-row justify-between items-center" onPress={() => {
                                    addFavorite(currency);
                                    bottomSheetRef.current?.snapToIndex(0);
                                    setTimeout(() => {
                                        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                                    }, 1000);
                                }}>
                                    <View className="flex flex-row items-center gap-2">
                                        <CountryFlag
                                            isoCode={currencyToCountryMap[currency]?.countryCode}
                                            size={25}
                                            style={{
                                                borderRadius: 4,
                                            }}
                                        />
                                        <Text className="font-JakartaBold text-[15px]">{currency}</Text>
                                    </View>

                                    <Text className="font-JakartaBold ">{currencyToCountryMap[currency]?.symbol}1 = {currencyToCountryMap[baseCurrency]?.symbol}1000</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>

                <ReactNativeModal isVisible={errorModal}>
                    <View className="bg-white p-5 rounded-md">
                        <View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-JakartaExtraBold text-xl mb-2">Error</Text>
                                <Ionicons onPress={() => setErrorModal(false)} name="close" size={30} color="black" />
                            </View>
                            <Image source={errorImg} className="w-[100px] h-[100px] m-auto" />
                            <Text className="m-auto text-[15px]">Sorry, the request ran into an unknown error</Text>

                            <TouchableOpacity onPress={() => { setErrorModal(false); getRates() }}>
                                <View className="bg-blue-300 m-auto px-5 py-2 rounded-md mt-5">
                                    <Text className="font-JakartaExtraBold">Retry</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ReactNativeModal>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}

export default Home;