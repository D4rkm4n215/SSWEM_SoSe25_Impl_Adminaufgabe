# Sicherer Passwortbasierter Login – SSWEM SoSe25

Dieses Projekt stellt ein sicheres Login-System bereit, bestehend aus einem **Spring Boot Backend** und einem **nginx-gehosteten Frontend**.  
Es ermöglicht Benutzern, sich zu registrieren und anschließend über einen passwortbasierten Mechanismus anzumelden.

---

## 🧠 Funktionsübersicht

### Backend (Spring Boot API)
- **Port**: `localhost:8080`
- **Endpoints**:
  - `POST /register` – Benutzerregistrierung
  - `POST /login` – Benutzeranmeldung
- **Benutzerdaten** werden in der Datei `users.csv` gespeichert.
- **Passwörter** werden vor dem Speichern per **SHA-256** gehasht.
- Es wird ein **Google reCAPTCHA v2** (Checkbox) verwendet, um Brute-Force-Angriffe zu verhindern.

### Frontend
- Wird über **nginx** gehostet
- Läuft auf `localhost:80`
- Enthält:
  - Login-Seite mit reCAPTCHA
  - Möglichkeit zur Registrierung

---

## 🛠️ Backend einrichten & starten

### Voraussetzungen
- **Java 17+**
- **IntelliJ IDEA** (oder eine andere IDE, die Spring Boot unterstützt)
- **Maven** (optional, falls außerhalb der IDE gebaut wird)

### Schritte
1. Projekt klonen:
   ```bash
   git clone https://github.com/D4rkm4n215/SSWEM_SoSe25_Impl_Adminaufgabe.git
   cd SSWEM_SoSe25_Impl_Adminaufgabe/Sicherer_passwortbasierter_Login
   ```

2. Projekt in IntelliJ IDEA importieren:
   - Als Maven-Projekt öffnen
   - `BackendApplication.java` starten

3. Das Backend läuft jetzt unter:
   ```
   http://localhost:8080
   ```

---

## 🌐 Frontend mit nginx einrichten

Für das Frontend ist nginx erforderlich, da Google reCAPTCHA v2 nur über Domains wie localhost und nicht direkt über file://-Zugriffe funktioniert.
Vorgehensweise:

nginx installieren (z. B. unter Ubuntu/Debian):
```
sudo apt install nginx
```
Lege deine HTML-Dateien z. B. in frontend/ ab und kopiere sie in den Webroot:
```
sudo cp -r frontend/* /var/www/html/
```
nginx starten:
```
sudo systemctl start nginx
```
Die Seite ist jetzt aufrufbar unter:
```
http://localhost
```
---
## 🧾 Passwortanforderungen bei Registrierung

Beim Anlegen eines neuen Kontos müssen folgende Passwortkriterien erfüllt sein:

    Mindestens 8 Zeichen

    Mindestens ein Großbuchstabe (A–Z)

    Mindestens ein Kleinbuchstabe (a–z)

    Mindestens eine Zahl (0–9)

    Mindestens ein Sonderzeichen aus: -+_!@#$%^&*.,?

Andernfalls wird eine entsprechende Fehlermeldung zurückgegeben.

---

## 📋 Benutzung der Anwendung

1. http://localhost im Browser öffnen

2. Login-Seite mit reCAPTCHA wird angezeigt

3. Auf „Register“ wechseln, um einen neuen Account anzulegen

4. Nach erfolgreicher Registrierung ist der Login mit dem neuen Benutzer möglich

5. Passwörter werden mittels Argon2 in der users.json gespeichert

## 📁 Verzeichnisstruktur (Kurzüberblick)

```
Sicherer_passwortbasierter_Login/
├── Backend
   ├──src
   ├──pom.xml
   ├──users.csv
├── frontend
   ├── css
   ├── js
   ├── index.html
   └── register.html
├── README.md
```
