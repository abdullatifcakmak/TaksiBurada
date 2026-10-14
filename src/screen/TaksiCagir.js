import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, TextInput, ScrollView, TouchableOpacity , ActivityIndicator} from "react-native";
import { useTheme } from "../context/ThemeContext";
import AltLogo from "../components/AltLogo";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from 'expo-location';
import Constants from 'expo-constants';


// Anahtar .env dosyasından gelir (bkz. .env.example)
const GOOGLE_GEOCODING_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const TaksiCagir = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, themeStyles } = useTheme();

  const [pickupLocation, setPickupLocation] = useState(null);
  const [address, setAddress] = useState("Konum Seçilmedi");
  const [loadingAddress, setLoadingAddress] = useState(false);


  useEffect(() => {
    if (route.params?.selectedLocation) {
      setPickupLocation(route.params.selectedLocation);
      reverseGeocode(route.params.selectedLocation.latitude, route.params.selectedLocation.longitude);
    }
  }, [route.params?.selectedLocation]);


  const handleGetCurrentLocation = async () => {
    setLoadingAddress(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Konum İzni Gerekli', 'Uygulamanın mevcut konumunuza erişebilmesi için izin vermeniz gerekiyor.');
      setLoadingAddress(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setPickupLocation(newLocation);
      await reverseGeocode(newLocation.latitude, newLocation.longitude);
      Alert.alert("Başarılı", "Mevcut konumunuz algılandı.");
    } catch (error) {
      console.error("Mevcut konum alınırken hata oluştu:", error);
      Alert.alert('Hata', 'Mevcut konumunuz alınamadı. Lütfen GPS ayarlarınızı kontrol edin.');
    } finally {
      setLoadingAddress(false);
    }
  };


  const reverseGeocode = async (latitude, longitude) => {
    setLoadingAddress(true);
    try {

      const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_API_KEY}&language=tr`
      );
      const data = await response.json();

      console.log("Google Geocoding API Yanıtı:", data);

      if (data.results && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
        console.log("Çözümlenen Adres:", formattedAddress);
      } else {
        setAddress("Adres bulunamadı.");
        console.warn("Bu konum için adres bulunamadı.");
      }
    } catch (error) {
      console.error("Adres çözümlenirken hata oluştu:", error);
      setAddress("Adres çözümlenemedi.");
      Alert.alert("Hata", "Adresiniz çözümlenirken bir sorun oluştu.");
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleCallTaxi = () => {
    if (!pickupLocation) {
      Alert.alert("Uyarı", "Lütfen bir konum seçin.");
      return;
    }
    Alert.alert(
        "Taksi Çağır",
        `Taksi şu konuma çağrılıyor:\n${address}\nEnlem: ${pickupLocation.latitude.toFixed(6)}\nBoylam: ${pickupLocation.longitude.toFixed(6)}`
    );

  };

  return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
        <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Taksi Çağır</Text>

        <View style={[styles.locationBox, { backgroundColor: themeStyles[theme].cardColor }]}>
          <Text style={[styles.locationLabel, { color: themeStyles[theme].textColor }]}>Seçilen Konum:</Text>
          {loadingAddress ? (
              <ActivityIndicator size="small" color={themeStyles[theme].textColor} />
          ) : (
              <Text style={[styles.locationText, { color: themeStyles[theme].textColor }]}>
                {address}
              </Text>
          )}
          {pickupLocation && (
              <Text style={[styles.coordsText, { color: themeStyles[theme].textColor }]}>
                Enlem: {pickupLocation.latitude.toFixed(6)}, Boylam: {pickupLocation.longitude.toFixed(6)}
              </Text>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: themeStyles[theme].buttonColor }]}
              onPress={() => navigation.navigate('KonumSecici', { fromScreen: 'TaksiCagirAna', initialLocation: pickupLocation })}
          >
            <Text style={[styles.actionButtonText, { color: themeStyles[theme].buttonTextColor }]}>Haritadan Konum Seç</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: themeStyles[theme].buttonColor }]}
              onPress={handleGetCurrentLocation}
              disabled={loadingAddress}
          >
            <Text style={[styles.actionButtonText, { color: themeStyles[theme].buttonTextColor }]}>
              {loadingAddress ? "Konum Alınıyor..." : "Mevcut Konumu Kullan"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
            style={[styles.callTaxiButton, { backgroundColor: 'green' }]}
            onPress={handleCallTaxi}
            disabled={!pickupLocation || loadingAddress}
        >
          <Text style={styles.callTaxiButtonText}>TAKSİ ÇAĞIR</Text>
        </TouchableOpacity>

        <AltLogo />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  locationBox: {
    width: '95%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  locationLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  coordsText: {
    fontSize: 14,
    color: 'gray',
  },
  buttonGroup: {
    width: '95%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  callTaxiButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  callTaxiButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default TaksiCagir;