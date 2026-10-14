import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import Input from "../components/Input";
import AltLogo from "../components/AltLogo";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const GirisYap = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigation = useNavigation();
    const { themeStyles, theme } = useTheme(); // Tema stillerini al

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
            return;
        }
        const result = await login(email, password);
        if (!result.success) {
            Alert.alert("Giriş Hatası", result.error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logoImage}
                />
            </View>
            <Text style={[styles.baslik, { color: themeStyles[theme].textColor }]}>GİRİŞ YAP</Text>
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
            <TouchableOpacity
                style={[styles.girisYapButton, { backgroundColor: themeStyles[theme].buttonColor }]}
                onPress={handleLogin}
            >
                <Text style={[styles.girisYapButtonText, { color: themeStyles[theme].buttonTextColor }]}>GİRİŞ YAP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sifremiUnuttumButton} onPress={() => Alert.alert("Bilgi", "Şifremi unuttum özelliği henüz aktif değil.")}>
                <Text style={[styles.sifremiUnuttumButtonText, { color: themeStyles[theme].textColor }]}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uyeOlButton} onPress={() => navigation.navigate("Üye Ol")}>
                <Text style={{ color: themeStyles[theme].textColor }}>Üye değil misin ? </Text>
                <Text style={styles.uyeOlButtonText}>Üye Ol</Text>
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
    girisYapButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    girisYapButtonText: {
        fontWeight: "bold",
    },
    sifremiUnuttumButton: {
        marginTop: 10,
    },
    sifremiUnuttumButtonText: {

    },
    uyeOlButton: {
        marginTop: 10,
        flexDirection: "row",
    },
    uyeOlButtonText: {
        color: "red",
    },
});

export default GirisYap;