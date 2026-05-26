export interface PasskeyCredential {
  credentialId: string;
}

// Mock — swap for expo-passkeys / react-native-passkey when stable on Expo 54
export const passkeyService = {
  async create(_username: string): Promise<PasskeyCredential> {
    await new Promise<void>(resolve => setTimeout(resolve, 1500));
    return {
      credentialId: `pk_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };
  },
};
