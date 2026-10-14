import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';

import AnaEkran from "./src/screen/AnaEkran";
import TaksiListesi from "./src/screen/TaksiListesi";
import TaksiCagir from "./src/screen/TaksiCagir";
import UyeOl from "./src/screen/UyeOl";
import GirisYap from "./src/screen/GirisYap";
import Profil from "./src/screen/Profil";
import KonumSecici from "./src/screen/KonumSecici";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { openDb } from "./src/database/database";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TaksiCagirStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TaksiCagirAna" component={TaksiCagir} />
            <Stack.Screen name="KonumSecici" component={KonumSecici} />
        </Stack.Navigator>
    );
};

const AppContent = () => {
    const { user, loading: authLoading } = useAuth();
    const [dbLoading, setDbLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await openDb();
                console.log("Veritabanı başlatma tamamlandı.");
            } catch (err) {
                console.error("Veritabanı başlatılırken hata oluştu:", err);
            } finally {
                setDbLoading(false);
            }
        };
        initializeApp();
    }, []);

    if (authLoading || dbLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case 'Ana Ekran':
                                iconName = 'home';
                                break;
                            case 'Taksi Listesi':
                                iconName = 'bars';
                                break;
                            case 'Taksi Çağır':
                                iconName = 'phone';
                                break;
                            case 'Giriş Yap':
                                iconName = 'login';
                                break;
                            case 'Üye Ol':
                                iconName = 'user';
                                break;
                            case 'Profil':
                                iconName = 'profile';
                                break;
                            default:
                                iconName = 'questioncircle';
                        }

                        return <AntDesign name={iconName} size={size} color={focused ? 'blue' : 'gray'} />;
                    },
                    tabBarActiveTintColor: 'blue',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
                {user ? (
                    <>
                        <Tab.Screen name="Ana Ekran" component={AnaEkran} />
                        <Tab.Screen name="Taksi Listesi" component={TaksiListesi} />
                        <Tab.Screen name="Taksi Çağır" component={TaksiCagirStack} />
                        <Tab.Screen name="Profil" component={Profil} />
                    </>
                ) : (
                    <>
                        <Tab.Screen name="Giriş Yap" component={GirisYap} />
                        <Tab.Screen name="Üye Ol" component={UyeOl} />
                    </>
                )}
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
