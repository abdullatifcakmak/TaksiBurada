import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from "react-native";
import Input from "../components/Input";
import RadioButtonGroup from "../components/RadioButtonGroup";
import AltLogo from "../components/AltLogo";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const UyeOl = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [uyeTipi, setUyeTipi] = useState("");
    const { register } = useAuth();
    const navigation = useNavigation();
    const { themeStyles, theme } = useTheme(); // Tema stillerini al

    const handleRegister = async () => {
        if (!email || !password || !uyeTipi) {
            Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
            return;
        }
        const result = await register(email, password);
        if (result.success) {
            Alert.alert("Başarılı", "Üyeliğiniz oluşturuldu! Giriş yapabilirsiniz.");
            navigation.navigate("Giriş Yap");
        } else {
            Alert.alert("Üyelik Hatası", result.error);
        }
    };

    const uyeTipiOptions = [
        { label: "Taksi Odası", value: "oda" },
        { label: "Taksi Durağı", value: "durak" },
        { label: "Taksi Şoförü", value: "sofor" },
    ];

    return (
        <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logoImage}
                />
                <Text style={[styles.baslik, { color: themeStyles[theme].textColor }]}>HOŞGELDİNİZ..</Text>
            </View>
            <Input
                placeholder="E-posta"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Input
                placeholder="Parola"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <RadioButtonGroup
                options={uyeTipiOptions}
                selectedOption={uyeTipi}
                onSelect={setUyeTipi}
            />
            <TouchableOpacity
                style={[styles.uyeOlButton, { backgroundColor: themeStyles[theme].buttonColor }]}
                onPress={handleRegister}
            >
                <Text style={[styles.uyeOlButtonText, { color: themeStyles[theme].buttonTextColor }]}>Üye Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.girisYapTextContainer} onPress={() => navigation.navigate("Giriş Yap")}>
                <Text style={[styles.girisYapText, { color: themeStyles[theme].textColor }]}>Zaten üye misiniz? <Text style={{ color: 'blue' }}>Giriş Yap</Text></Text>
            </TouchableOpacity>
            <AltLogo />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logoImage: {
        width: 200,
        height: 100,
        resizeMode: "contain",
        marginBottom: 20,
    },
    baslik: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: "bold",
    },
    uyeOlButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    uyeOlButtonText: {
        fontWeight: "bold",
    },
    girisYapTextContainer: {
        marginTop: 15,
    },
    girisYapText: {

    }
});

export default UyeOl;