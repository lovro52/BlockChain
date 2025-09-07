# Tournament Betting App

## Opis aplikacije

Aplikacija omogućuje korisnicima da se klade na natjecatelje unutar sportskih turnira.

---

## Tehničke značajke

- **Pametni ugovor (Solidity)**:

  - Upravljanje turnirima
  - Klađenje korisnika
  - Postavljanje pobjednika
  - Isplata nagrada pobjednicima

- **Frontend (Vite+Vue)**:

  - Prikaz svih turnira s vizualnim statusima (otvoreni / zatvoreni)
  - Sučelje za klađenje s unosom iznosa
  - Prikaz osobnog uloga i mogućnosti preuzimanja nagrade
  - Filtriranje turnira po nazivu i natjecateljima

- **Web3 integracija (MetaMask)**:

  - Autentifikacija korisnika
  - Slanje transakcija (klađenje i preuzimanje nagrada)

- **Admin panel**:
  - Kreiranje turnira
  - Zatvaranje turnira i postavljanje pobjednika
  - Dostupan samo vlasniku ugovora

---

## Uloge korisnika

- **Korisnik**:

  - Može se kladiti jednom po turniru
  - Može preuzeti nagradu ako je pogodio pobjednika
  - Može pregledavati sve turnire i vlastite uloge

- **Admin (vlasnik ugovora)**:
  - Može dodavati turnire
  - Može zatvoriti turnire i odabrati pobjednika

---

## Način rada

1. **Admin** kreira turnir s popisom natjecatelja.
2. **Korisnici** se klade uplatom na željenog natjecatelja.
3. Po završetku, **admin postavlja pobjednika**.
4. **Korisnici koji su pogodili pobjednika** mogu preuzeti nagradu (povrat na temelju ukupnog fonda i svog uloga).

---

## 🛠️ Tehnologije

- Solidity
- Vue 3
- MetaMask
- Vite
- CSS
