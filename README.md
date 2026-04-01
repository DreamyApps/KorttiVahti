# KorttiVahti

Pokemon card price tracker for Finland. Compare prices across 20+ Finnish stores, track price history, and get notified about deals.

## Tech Stack

- **Frontend**: Expo SDK 54, React Native, Expo Router v6, TypeScript
- **Backend**: Firebase Cloud Functions, Firestore, FCM
- **State**: TanStack React Query + Zustand
- **UI**: Custom design system, react-native-reanimated, react-native-svg

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS
npm run ios
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore, Cloud Functions, Authentication, and Cloud Messaging
3. Add your iOS app to the Firebase project
4. Download `GoogleService-Info.plist` and place it in the project root
5. Update `services/firebase.ts` with your Firebase config
6. Deploy Cloud Functions:

```bash
cd functions
npm install
npm run deploy
```

## Project Structure

```
app/                  # Expo Router screens
  (tabs)/             # Tab navigation (Home, Search, Favorites, Settings)
  product/[id].tsx    # Product detail screen
  (auth)/             # Sign-in screen
components/           # Reusable UI components
  ui/                 # Design system primitives
hooks/                # Custom React hooks
services/             # Firebase & API services
i18n/                 # Finnish & English translations
utils/                # Theme, types, utilities
functions/            # Firebase Cloud Functions
  src/scrapers/       # Store-specific scrapers (20+ stores)
  src/services/       # Product matching, notifications, price tracking
```

## Supported Stores

**Tier 1**: Poromagia, Puolenkuun Pelit, Fantasiapelit, Verkkokauppa.com, Pelikauppa
**Tier 2**: TCGKauppa, Karukortti, PokeKorner, InfinityPrints TCG, Blockhouse Games
**Tier 3**: Oh My Game, Kevin's Hobby Shop, VPD, Muksumassi, Swagykarp, Porvoon Pelikauppa, XS Lelut, Ellimadelli, Prisma, Kodintavaratalo

## License

Proprietary - DreamyApps
