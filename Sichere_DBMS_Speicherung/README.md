
# Administration Aufgabe II – Sichere Datenspeicherung innerhalb eines DBMS

Diese Anleitung erklärt, wie man:

1. **pgAdmin** unter Windows oder Ubuntu installiert.
2. **PostgreSQL** auf einer VM über SSH einrichtet.
3. Über einen **SSH-Tunnel** mit PuTTY eine Verbindung zur PostgreSQL-Datenbank auf der VM herstellt.
4. Mit `pgcrypto` Felder in der Datenbank wie **Passwörter** sicher speichert, indem `crypt()` mit Salt verwendet wird — alles über pgAdmin.

---

## 📦 1. Installation von pgAdmin (Windows & Ubuntu)

### Windows

1. Lade den Installer herunter: [https://www.pgadmin.org/download/pgadmin-4-windows/](https://www.pgadmin.org/download/pgadmin-4-windows/)
2. Starte den Installer und folge den Schritten.
3. Öffne pgAdmin über das Startmenü.

### Ubuntu

```bash
sudo apt update
sudo apt install pgadmin4 -y
```

Oder die Webversion installieren:

```bash
sudo apt install pgadmin4-web
sudo /usr/pgadmin4/bin/setup-web.sh
```

---

## 🖥️ 2. Durchgeführte Schritte, um PostgreSQL auf der VM der Hochschule einzurichten

### Verbindung zur VM über PuTTY herstellen

1. PuTTY starten.
2. Unter **Session** eintragen:
   - Host Name: `rohefner@193.196.53.252`
   - Port: `22`
3. Navigiere zu:
   ```
   Connection → SSH → Auth → Credentials
   ```
4. Im Feld `Private key file for authrorization` den `.ppk` private key auswählen
5. Zurück zu **Session** → **Open**.

### PostgreSQL wurde installiert:

```bash
sudo apt update
sudo apt install postgresql -y
```

### Die Erweiterung `pgcrypto` wurde aktiviert:

```bash
sudo -u postgres psql -d sampledb
CREATE EXTENSION IF NOT EXISTS pgcrypto;
\q
```

### PostgreSQL wurde auf localhost (für den SSH-Tunnel) beschränkt:

`postgresql.conf` wurde bearbeitet:

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Folgende Zeile wurde eingefügt:

```conf
listen_addresses = 'localhost'
```

`pg_hba.conf` wurde bearbeitet:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Folgende Zeile muss existieren:

```conf
host    all             all             127.0.0.1/32            scram-sha-256
```

PostgreSQL neu starten:

```bash
sudo systemctl restart postgresql
```

---

## 🔐 3. Erstelle einen SSH-Tunnel

### Verbindung über PuTTY

1. Starte PuTTY.
2. Unter **Session** eintragen:
   - Host Name: `rohefner@193.196.53.252`
   - Port: `22`
3. Navigiere zu:
   ```
   Connection → SSH → Tunnels
   ```
4. Eintragen:
   - Source Port: `5432`
   - Destination: `localhost:5432`
   - Wähle **Local** und klicke auf **Add**.
5. Navigiere zu:
   ```
   Connection → SSH → Auth → Credentials
   ```
6. Im Feld `Private key file for authrorization` den `.ppk` private key auswählen
7. Zurück zu **Session** → **Open**.


Diese SSH-Sitzung muss im Hintergrund geöffnet bleiben, während pgAdmin verwendet wird.

---

## 🔌 4. Verbindung zur PostgreSQL über pgAdmin

1. Öffne pgAdmin.
2. Rechtsklick auf "Servers" → "Create" → "Server..."
3. Unter **General**:
   - Name: `Remote PostgreSQL via SSH`
4. Unter **Connection**:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres` (oder dein DB-User)
   - Password: `74qjGQNdr0b0w1EWEp&Z3ioOVecUskNA^$ZJxWU^BIU#qh@T@QwOhjtQk#l0eQ&M`
5. Klicke auf **Save** und verbinde dich.

Achte darauf, dass der SSH-Tunnel geöffnet ist.

---

## 🔐 5. Verwende pgcrypto in pgAdmin zur sicheren Speicherung von Passwörtern

Es existiert eien Tabelle `users` in der Datenbank `sampledb`. Die Tabelle hat die Felder `name`, `email` und `passwords`

### Schritt 1: Benutzer mit verschlüsseltem Passwort einfügen

```sql
INSERT INTO users (name, email, passwords)
VALUES (
    'Alice',
    'alice@example.com',
    crypt('MeinSicheresPasswort123!', gen_salt('bf'))
);
```

- `crypt()` verschlüsselt das Passwort
- `gen_salt('bf')` erzeugt einen **Blowfish (bcrypt)** Salt

### Schritt 2: Passwortüberprüfung (Login-Prüfung)

```sql
SELECT * FROM users
WHERE email = 'alice@example.com'
  AND passwords = crypt('MeinSicheresPasswort123!', passwords);
```

---

## ✅ Zusammenfassung

- **pgAdmin** wurde als Interface auf einem lokalen Rechner benutzt.
- Einen sicherer **PostgreSQL-Server** wurde auf der VM eingerichtet.
- Einen sicherer **SSH-Tunnel** wurde mit PuTTY erstellt.
- Mit `pgcrypto` wurde das Feld `passwords` **sicher gehasht und gespeichert**.
