import { createProvider } from "./blockchain";

const provider = createProvider("ethereum");

export function getProvider() {
  return provider;
}

export function getProviderForChain(chain: string) {
  return createProvider(chain);
}

export { createProvider };
