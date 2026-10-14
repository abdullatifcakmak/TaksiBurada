import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Button,
} from "react-native";
import AppInfo from "../components/AppInfo";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const AnaEkran = () => {
  const { theme, toggleTheme, themeStyles } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation();

  const appInfoText = `Değerli yolcularımız, Taksi uygulamamıza hoş geldiniz! Şehrin karmaşasında kaybolmadan, en yakın taksiyi bulmanın ve konforlu bir yolculuğa çıkmanın keyfini çıkarın. Uygulamamız, size güvenli, hızlı ve ekonomik bir ulaşım deneyimi sunmak için tasarlandı. İster aceleniz olsun, ister sadece rahat bir yolculuk yapmak isteyin, Taksi yanınızda! Hemen giriş yaparak veya üye olarak, size özel avantajlardan yararlanmaya başlayabilirsiniz. Unutmayın, Taksi ile yolculuk etmek sadece bir ulaşım şekli değil, aynı zamanda bir yaşam tarzıdır.`;

  return (
      <ImageBackground
          source={require("../../assets/anaekran.png")}
          style={styles.background}
      >
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <AppInfo text={appInfoText} />

        {!user && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={[
                    styles.girisYapButton,
                    { backgroundColor: themeStyles[theme].buttonColor },
                  ]}
                  onPress={() => navigation.navigate("Giriş Yap")}
              >
                <Text
                    style={[
                      styles.girisYapButtonText,
                      { color: themeStyles[theme].buttonTextColor },
                    ]}
                >
                  Giriş Yap
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[
                    styles.uyeOlButton,
                    { backgroundColor: themeStyles[theme].buttonColor },
                  ]}
                  onPress={() => navigation.navigate("Üye Ol")}
              >
                <Text
                    style={[
                      styles.uyeOlButtonText,
                      { color: themeStyles[theme].buttonTextColor },
                    ]}
                >
                  Üye Ol
                </Text>
              </TouchableOpacity>
            </View>
        )}

        <View style={styles.altLogoContainer}>
          <Text
              style={[styles.altLogoText, { color: themeStyles[theme].textColor }]}
          >
            GL soft
          </Text>
        </View>
        <View style={styles.themeToggleButtonContainer}>
          <Button title="Temayı Değiştir" onPress={toggleTheme} />
        </View>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    marginBottom: 100,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    position: "absolute",
    top: 20,
  },
  girisYapButton: {
    width: 100,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  girisYapButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  uyeOlButton: {
    width: 100,
    height: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uyeOlButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  altLogoContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  altLogoText: {
    fontSize: 16,
  },
  themeToggleButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  }
});

export default AnaEkran;