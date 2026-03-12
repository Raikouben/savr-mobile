// Polyfill expo/winter globals for Jest 30 compatibility
// Expo lazily installs these via require() which fails in Jest 30's stricter module sandbox

if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

if (typeof globalThis.__ExpoImportMetaRegistry === "undefined") {
  globalThis.__ExpoImportMetaRegistry = { register: () => {} };
}
