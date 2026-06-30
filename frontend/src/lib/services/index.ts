import { createProvider, createProviderFromEnv } from "./blockchain";

const provider = createProviderFromEnv("ethereum");

export function getProvider() {
  return provider;
}

export function getProviderForChain(chain: string) {
  return createProviderFromEnv(chain);
}

export { createProvider, createProviderFromEnv };
