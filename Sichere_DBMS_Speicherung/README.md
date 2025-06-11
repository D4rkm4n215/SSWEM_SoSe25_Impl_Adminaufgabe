
# Administration Aufgabe II – Sichere Datenspeicherung innerhalb eines DBMS

Diese Anleitung erklärt, wie man:

1. **pgAdmin** unter Windows oder Ubuntu installiert.
2. **PostgreSQL** auf einer VM über SSH einrichtet.
3. Über einen **SSH-Tunnel** mit PuTTY eine Verbindung zur PostgreSQL-Datenbank auf der VM herstellt und diese durch **SSL Zertifikate** absichert.
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

### SSL Zertifikate wurden mit der bereitgestellten Domain ersetllt:

```bash
cd /etc/ssl/certs
sudo openssl req -new -x509 -days 365 -nodes \
  -out postgresql.crt \
  -keyout /etc/ssl/private/postgresql.key \
  -subj "/CN=your-db-server"
```
Der erstellte private Key wird so verändert, dass er nur vom Benutzer bearbeiter und gelesen werden kann. Danach wird der Key und das Zertifikat dem Benutzer `postgres` zugeordnet. 
```bash
sudo chmod 600 /etc/ssl/private/postgresql.key
sudo chown postgres:postgres /etc/ssl/private/postgresql.key /etc/ssl/certs/postgresql.crt
```

### PostgreSQL wurde auf localhost (für den SSH-Tunnel) und nur auf SSL Verbindungen beschränkt:

`postgresql.conf` wurde bearbeitet:

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Folgende Zeile wurde eingefügt:

```conf
listen_addresses = 'localhost'

ssl = on
ssl_cert_file = '/etc/ssl/certs/postgresql.crt'
ssl_key_file = '/etc/ssl/private/postgresql.key'
```

`pg_hba.conf` wurde bearbeitet:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Es dürfen nur Verbindungen mit `hostssl` zugelassen werden:

```conf        
hostssl all all 127.0.0.1/32 scram-sha-256
hostssl all all ::1/128 scram-sha-256
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
   - Name: `SSWEM`
4. Unter **Connection**:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `74qjGQNdr0b0w1EWEp&Z3ioOVecUskNA^$ZJxWU^BIU#qh@T@QwOhjtQk#l0eQ&M`
5. Unter **Parameters**:
   - SSL_Mode: `require`
6. **Save** klicken.
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
- Einen sicherer **SSH-Tunnel**  wurde mit PuTTY erstellt, wobei **SSL Zertifikate** verwendet wurden.
- Mit `pgcrypto` wurde das Feld `passwords` **sicher gehasht und gespeichert**.
