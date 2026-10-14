# TaksiBurada

Konumunu haritadan seçip taksi çağırabildiğin, taksi listesini yönetebildiğin bir mobil uygulama.
Android Uygulama Geliştirme dersi için ekip projesi olarak geliştirildi.

## Özellikler

- E-posta ve parolayla üyelik ve giriş (Firebase Authentication)
- Haritadan konum seçme ve mevcut konumu bulma; seçilen konumun adresini gösterme (Google Geocoding)
- Taksi çağırma ekranı
- Taksi listesi: ekleme, düzenleme, silme (cihazda SQLite)
- Kamerayla profil fotoğrafı çekme
- Açık ve koyu tema

## Teknolojiler

React Native, Expo, Firebase Authentication, React Navigation, react-native-maps, Expo Location, Expo Image Picker, Expo SQLite

## Çalıştırma

1. Bağımlılıkları kur: `npm install`
2. `.env.example` dosyasını `.env` adıyla kopyala ve kendi Firebase ve Google Maps anahtarlarını yaz.
   `.env` git'e eklenmez; anahtarlar asla koda yazılmaz.
3. Uygulamayı başlat: `npx expo start`

## Geliştirenler

- Abdullatif Çakmak
- Gizem Yerlikaya
