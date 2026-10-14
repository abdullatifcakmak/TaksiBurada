import * as SQLite from 'expo-sqlite';


let db = null;

export const openDb = async () => {
    if (db) {
        return db;
    }
    try {
        db = await SQLite.openDatabaseAsync("taksiUygulamasi.db");
        console.log("Veritabanı başarıyla açıldı veya oluşturuldu.");


        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS taksiler (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    taksiAdi TEXT NOT NULL,
                                                    plaka TEXT NOT NULL,
                                                    telefon TEXT NOT NULL
            );
        `);
        console.log("Taksiler tablosu oluşturuldu veya zaten mevcut.");


        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS profilePhoto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL
      );
    `);
        console.log("ProfilePhoto tablosu oluşturuldu veya zaten mevcut.");

        return db;
    } catch (error) {
        console.error("Veritabanı açılırken veya tablo oluşturulurken hata oluştu:", error);
        throw error;
    }
};


export const getTaksilerFromDb = async () => {
    try {
        const database = await openDb();
        const allRows = await database.getAllAsync("SELECT * FROM taksiler ORDER BY taksiAdi ASC;");
        return allRows;
    } catch (error) {
        console.error("Taksiler çekilirken hata oluştu:", error);
        throw error;
    }
};

export const addTaksiToDb = async (taksiAdi, plaka, telefon) => {
    try {
        const database = await openDb();
        const result = await database.runAsync(
            "INSERT INTO taksiler (taksiAdi, plaka, telefon) VALUES (?, ?, ?);",
            taksiAdi, plaka, telefon
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error("Taksi eklenirken hata oluştu:", error);
        throw error;
    }
};

export const updateTaksiInDb = async (id, taksiAdi, plaka, telefon) => {
    try {
        const database = await openDb();
        const result = await database.runAsync(
            "UPDATE taksiler SET taksiAdi = ?, plaka = ?, telefon = ? WHERE id = ?;",
            taksiAdi, plaka, telefon, id
        );
        return result.changes;
    } catch (error) {
        console.error("Taksi güncellenirken hata oluştu:", error);
        throw error;
    }
};

export const deleteTaksiFromDb = async (id) => {
    try {
        const database = await openDb();
        const result = await database.runAsync(
            "DELETE FROM taksiler WHERE id = ?;",
            id
        );
        return result.changes;
    } catch (error) {
        console.error("Taksi silinirken hata oluştu:", error);
        throw error;
    }
};

export const dropTable = async () => {
    try {
        const database = await openDb();
        await database.execAsync(`DROP TABLE IF EXISTS taksiler;`);
        console.log("Taksiler tablosu başarıyla silindi.");
        await openDb(); // Tekrar oluştur
    } catch (error) {
        console.error("Tablo silinirken hata oluştu:", error);
    }
};


export const saveProfilePhotoUri = async (uri) => {
    try {
        const db = await openDb();
        await db.execAsync(`DELETE FROM profilePhoto;`); // Önceki URI varsa sil
        await db.runAsync("INSERT INTO profilePhoto (uri) VALUES (?);", uri);
        console.log("Profil fotoğrafı URI'si kaydedildi:", uri);
    } catch (error) {
        console.error("Profil fotoğrafı URI'si kaydedilirken hata:", error);
    }
};

export const getSavedProfilePhotoUri = async () => {
    try {
        const db = await openDb();
        const rows = await db.getAllAsync("SELECT uri FROM profilePhoto LIMIT 1;");
        return rows.length > 0 ? rows[0].uri : null;
    } catch (error) {
        console.error("Profil fotoğrafı URI'si alınırken hata:", error);
        return null;
    }
};
