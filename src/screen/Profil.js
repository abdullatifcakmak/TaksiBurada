import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AltLogo from '../components/AltLogo';
import { getSavedProfilePhotoUri, saveProfilePhotoUri } from '../database/database';
import { List, Provider as PaperProvider } from 'react-native-paper';

const Profil = () => {
    const { user, logout } = useAuth();
    const { theme, themeStyles } = useTheme();

    const [localPhotoUri, setLocalPhotoUri] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const userEmail = user?.email || 'Bilgi Yok';
    const defaultImage = require('../../assets/default-profile.png');

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            const savedUri = await getSavedProfilePhotoUri();
            if (savedUri) {
                setLocalPhotoUri({ uri: savedUri });
            }
        };
        fetchProfilePhoto();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Kamera erişimi için izin vermeniz gerekiyor.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setLocalPhotoUri({ uri });
            await saveProfilePhotoUri(uri);
        }
    };

    const handleAccordionPress = () => setExpanded(!expanded);

    return (
        <PaperProvider>
            <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
                <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Kullanıcı Profili</Text>

                <View style={[styles.profileCard, { backgroundColor: themeStyles[theme].cardColor }]}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image source={localPhotoUri || defaultImage} style={styles.profileImage} />
                    </TouchableOpacity>

                    <Text style={[styles.emailText, { color: themeStyles[theme].textColor }]}>
                        E-posta: {userEmail}
                    </Text>
                </View>

                <List.Section style={{ width: '90%' }}>
                    <List.Accordion
                        title="Ek Bilgiler"
                        left={props => <List.Icon {...props} icon="information-outline" />}
                        expanded={expanded}
                        onPress={handleAccordionPress}
                        titleStyle={{ color: themeStyles[theme].textColor }}
                        style={{ backgroundColor: themeStyles[theme].cardColor }}
                    >
                        <List.Item
                            title="Uygulama Sürümü: 1.0.0"
                            titleStyle={{ color: themeStyles[theme].textColor }}
                            style={{ backgroundColor: themeStyles[theme].cardColor }}
                        />
                        <List.Item
                            title={`Tema: ${theme === 'light' ? 'Açık' : 'Koyu'}`}
                            titleStyle={{ color: themeStyles[theme].textColor }}
                            style={{ backgroundColor: themeStyles[theme].cardColor }}
                        />
                        <List.Item
                            title="Giriş durumu: Aktif"
                            titleStyle={{ color: themeStyles[theme].textColor }}
                            style={{ backgroundColor: themeStyles[theme].cardColor }}
                        />
                    </List.Accordion>
                </List.Section>

                <Pressable style={[styles.logoutButton, { backgroundColor: themeStyles[theme].buttonColor }]} onPress={logout}>
                    <Text style={{ color: themeStyles[theme].buttonTextColor, fontWeight: 'bold' }}>Çıkış Yap</Text>
                </Pressable>

                <AltLogo />
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 20,
    },
    profileCard: {
        width: '90%',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginBottom: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#fcbd01',
    },
    emailText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: '600',
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginTop: 20,
    },
});

export default Profil;
