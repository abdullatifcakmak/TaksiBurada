import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Button, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const KonumSecici = ({ route }) => {
    const navigation = useNavigation();
    const { theme, themeStyles } = useTheme();


    const initialRegion = route.params?.initialLocation
        ? {
            latitude: route.params.initialLocation.latitude,
            longitude: route.params.initialLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }
        : {
            latitude: 39.9334,
            longitude: 32.8597,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };

    const [selectedLocation, setSelectedLocation] = useState(initialRegion);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mapReady, setMapReady] = useState(false);


    const getLocation = useCallback(async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Konum İzni Gerekli', 'Uygulamanın konumunuza erişebilmesi için izin vermeniz gerekiyor.');
            setLoading(false);
            return;
        }

        try {
            let location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setSelectedLocation(newRegion);
            setCurrentLocation(newRegion);
            console.log("GPS konumu:", location.coords);
        } catch (error) {
            console.error("Konum alınırken hata oluştu:", error);
            Alert.alert('Hata', 'Konumunuz alınamadı. Lütfen GPS ayarlarınızı kontrol edin.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getLocation();
    }, [getLocation]);

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ ...selectedLocation, latitude, longitude });
    };

    const handleSelectLocation = () => {
        if (selectedLocation) {

            navigation.navigate(route.params?.fromScreen, { selectedLocation: selectedLocation });
        } else {
            Alert.alert("Hata", "Lütfen harita üzerinde bir konum seçin.");
        }
    };

    const onMapLayout = () => {
        setMapReady(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
            <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Haritadan Konum Seçin</Text>

            {loading && !mapReady ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={themeStyles[theme].textColor} />
                    <Text style={[styles.loadingText, { color: themeStyles[theme].textColor }]}>Konum alınıyor...</Text>
                </View>
            ) : (
                <MapView
                    style={styles.map}
                    initialRegion={initialRegion}
                    onPress={handleMapPress}
                    onLayout={onMapLayout}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    region={selectedLocation}
                >
                    {selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                            }}
                            title="Seçilen Konum"
                            description="Bu konuma taksi çağırılacak"
                            draggable
                            onDragEnd={(e) => handleMapPress(e)}
                        />
                    )}
                    {currentLocation && !selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Mevcut Konumunuz"
                            pinColor="blue"
                        />
                    )}
                </MapView>
            )}

            {selectedLocation && (
                <View style={[styles.selectedInfoContainer, { backgroundColor: themeStyles[theme].cardColor }]}>
                    <Text style={[styles.selectedInfoText, { color: themeStyles[theme].textColor }]}>
                        Seçilen Enlem: {selectedLocation.latitude.toFixed(6)}
                    </Text>
                    <Text style={[styles.selectedInfoText, { color: themeStyles[theme].textColor }]}>
                        Seçilen Boylam: {selectedLocation.longitude.toFixed(6)}
                    </Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button
                    title="Bu Konumu Seç"
                    onPress={handleSelectLocation}
                    color={themeStyles[theme].buttonColor}
                    disabled={!selectedLocation || loading}
                />
                <Button
                    title="Mevcut Konumu Kullan"
                    onPress={getLocation}
                    color="gray"
                    disabled={loading}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    map: {
        width: '90%',
        height: '60%',
        borderRadius: 10,
        marginBottom: 20,
    },
    selectedInfoContainer: {
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedInfoText: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginTop: 10,
    },
});

export default KonumSecici;