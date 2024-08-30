mal schnell mit chatgpt gemacht:

Übersicht
Dies ist ein Angular-Projekt mit einer einfachen CRUD-Anwendung (Create, Read, Update, Delete). Es enthält eine Frontend-Anwendung und ein Backend, die zusammenarbeiten, um Daten zu verwalten.

Voraussetzungen
Stelle sicher, dass die folgenden Softwarepakete auf deinem System installiert sind:

Node.js (Version 14 oder höher)
Angular CLI (Globale Installation empfohlen)
Git (Für die Versionskontrolle)
Java (Für das Backend, falls erforderlich)
Maven (Falls du das Backend mit Maven baust)
Installation
Repository klonen:

Klone das Projekt auf deinen lokalen Rechner:

bash
Code kopieren
git clone https://github.com/draarayan/Lernfel10-11.git
cd Lernfel10-11
Frontend installieren:

Gehe in das Verzeichnis frontend und installiere die benötigten Abhängigkeiten:

bash
Code kopieren
cd frontend
npm install
Frontend starten:

Um die Angular-Anwendung im Entwicklungsmodus zu starten, führe folgendes Kommando aus:

bash
Code kopieren
ng serve
Die Anwendung sollte unter http://localhost:4200/ verfügbar sein.

Backend (falls benötigt):

Wenn das Projekt ein Backend hat, stelle sicher, dass es korrekt konfiguriert ist und starte es:

Stelle sicher, dass die Datenbank korrekt konfiguriert ist (z.B. MySQL, PostgreSQL).

Baue und starte das Backend:

bash
Code kopieren
mvn clean install
mvn spring-boot:run
Dies sollte den Server auf http://localhost:8080/ oder einem anderen konfigurierten Port starten.

Datenbank
Stelle sicher, dass die erforderliche Datenbank installiert und konfiguriert ist.
Die Datenbank-Konfigurationsdateien (z.B. application.properties oder application.yml) sollten entsprechend angepasst werden.
Falls nötig, erstelle die Datenbanktabellen oder führe Migrationen aus.
Entwicklungshinweise
Um Änderungen am Code vorzunehmen, kannst du die Dateien in einem Texteditor wie Visual Studio Code bearbeiten.
Jede Änderung im Frontend wird automatisch durch den Angular Live Development Server neu geladen.
Backend-Änderungen erfordern einen Neustart des Servers.
