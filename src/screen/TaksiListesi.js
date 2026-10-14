import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  Modal,
  RefreshControl,
} from "react-native";
import {
  getTaksilerFromDb,
  addTaksiToDb,
  updateTaksiInDb,
  deleteTaksiFromDb,

} from "../database/database";
import { useTheme } from "../context/ThemeContext";
import AltLogo from "../components/AltLogo";

const TaksiListesi = () => {
  const [taksiler, setTaksiler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTaksi, setCurrentTaksi] = useState(null);
  const [taksiAdi, setTaksiAdi] = useState("");
  const [plaka, setPlaka] = useState("");
  const [telefon, setTelefon] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { theme, themeStyles } = useTheme();


  const getTaksiler = useCallback(async () => { // Asenkron hale getirildi
    setLoading(true);
    try {
      const data = await getTaksilerFromDb();
      setTaksiler(data);
    } catch (err) {
      console.error("Taksiler çekilirken hata oluştu:", err);
      Alert.alert("Hata", "Taksi listesi yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getTaksiler();
  }, [getTaksiler]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTaksiler();
  }, [getTaksiler]);


  const handleSaveTaksi = async () => {
    if (!taksiAdi || !plaka || !telefon) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      if (currentTaksi) {
        await updateTaksiInDb(currentTaksi.id, taksiAdi, plaka, telefon);
        Alert.alert("Başarılı", "Taksi bilgisi güncellendi.");
      } else {
        await addTaksiToDb(taksiAdi, plaka, telefon); // await eklendi
        Alert.alert("Başarılı", "Yeni taksi eklendi.");
      }
      setModalVisible(false);
      resetForm();
      getTaksiler();
    } catch (err) {
      console.error("Taksi kaydedilirken hata oluştu:", err);
      Alert.alert("Hata", "Taksi bilgisi kaydedilirken bir sorun oluştu.");
    }
  };

  // Taksi silme (DELETE)
  const handleDeleteTaksi = async (id) => {
    Alert.alert(
        "Onay",
        "Bu taksiyi silmek istediğinizden emin misiniz?",
        [
          {
            text: "İptal",
            style: "cancel",
          },
          {
            text: "Sil",
            onPress: async () => { // Asenkron hale getirildi
              try {
                await deleteTaksiFromDb(id); // await eklendi
                Alert.alert("Başarılı", "Taksi başarıyla silindi.");
                getTaksiler();
              } catch (err) {
                console.error("Taksi silinirken hata oluştu:", err);
                Alert.alert("Hata", "Taksi silinirken bir sorun oluştu.");
              }
            },
          },
        ]
    );
  };

  const openAddModal = () => {
    setCurrentTaksi(null);
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (taksi) => {
    setCurrentTaksi(taksi);
    setTaksiAdi(taksi.taksiAdi);
    setPlaka(taksi.plaka);
    setTelefon(taksi.telefon);
    setModalVisible(true);
  };

  const resetForm = () => {
    setTaksiAdi("");
    setPlaka("");
    setTelefon("");
  };

  if (loading) {
    return (
        <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: themeStyles[theme].textColor }}>Taksiler Yükleniyor...</Text>
        </View>
    );
  }

  return (
      <View style={[styles.container, { backgroundColor: themeStyles[theme].backgroundColor }]}>
        <Text style={[styles.title, { color: themeStyles[theme].textColor }]}>Taksi Listesi</Text>

        <TouchableOpacity
            style={[styles.addButton, { backgroundColor: themeStyles[theme].buttonColor }]}
            onPress={openAddModal}
        >
          <Text style={[styles.addButtonText, { color: themeStyles[theme].buttonTextColor }]}>Yeni Taksi Ekle</Text>
        </TouchableOpacity>

        {taksiler.length === 0 ? (
            <Text style={[styles.noTaxisText, { color: themeStyles[theme].textColor }]}>Henüz taksi bulunamadı. Yeni bir tane ekleyin!</Text>
        ) : (
            <FlatList
                data={taksiler}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.taksiItem, { backgroundColor: themeStyles[theme].cardColor }]}>
                      <Text style={[styles.taksiText, { color: themeStyles[theme].textColor }]}>
                        <Text style={styles.taksiLabel}>Taksi Adı:</Text> {item.taksiAdi}
                      </Text>
                      <Text style={[styles.taksiText, { color: themeStyles[theme].textColor }]}>
                        <Text style={styles.taksiLabel}>Plaka:</Text> {item.plaka}
                      </Text>
                      <Text style={[styles.taksiText, { color: themeStyles[theme].textColor }]}>
                        <Text style={styles.taksiLabel}>Telefon:</Text> {item.telefon}
                      </Text>
                      <View style={styles.itemButtons}>
                        <TouchableOpacity
                            style={[styles.editButton, { backgroundColor: '#28a745' }]}
                            onPress={() => openEditModal(item)}
                        >
                          <Text style={styles.buttonText}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.deleteButton, { backgroundColor: '#dc3545' }]}
                            onPress={() => handleDeleteTaksi(item.id)}
                        >
                          <Text style={styles.buttonText}>Sil</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                )}
                style={styles.list}
                refreshControl={
                  <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor={themeStyles[theme].textColor}
                  />
                }
            />
        )}

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { backgroundColor: themeStyles[theme].cardColor }]}>
              <Text style={[styles.modalTitle, { color: themeStyles[theme].textColor }]}>
                {currentTaksi ? "Taksi Düzenle" : "Yeni Taksi Ekle"}
              </Text>
              <TextInput
                  style={[styles.input, { borderColor: themeStyles[theme].textColor, color: themeStyles[theme].textColor, backgroundColor: themeStyles[theme].backgroundColor }]}
                  placeholder="Taksi Adı"
                  placeholderTextColor={theme === 'dark' ? '#bbb' : '#888'}
                  value={taksiAdi}
                  onChangeText={setTaksiAdi}
              />
              <TextInput
                  style={[styles.input, { borderColor: themeStyles[theme].textColor, color: themeStyles[theme].textColor, backgroundColor: themeStyles[theme].backgroundColor }]}
                  placeholder="Plaka"
                  placeholderTextColor={theme === 'dark' ? '#bbb' : '#888'}
                  value={plaka}
                  onChangeText={setPlaka}
              />
              <TextInput
                  style={[styles.input, { borderColor: themeStyles[theme].textColor, color: themeStyles[theme].textColor, backgroundColor: themeStyles[theme].backgroundColor }]}
                  placeholder="Telefon Numarası"
                  placeholderTextColor={theme === 'dark' ? '#bbb' : '#888'}
                  value={telefon}
                  onChangeText={setTelefon}
                  keyboardType="phone-pad"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: themeStyles[theme].buttonColor }]}
                    onPress={handleSaveTaksi}
                >
                  <Text style={[styles.buttonText, { color: themeStyles[theme].buttonTextColor }]}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'gray' }]}
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                >
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <AltLogo />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noTaxisText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  list: {
    width: "100%",
  },
  taksiItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taksiText: {
    fontSize: 16,
    marginBottom: 5,
  },
  taksiLabel: {
    fontWeight: "bold",
  },
  itemButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
});

export default TaksiListesi;