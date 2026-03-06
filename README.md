# chrome-identity-helper

Promise-based wrapper around the Chrome Identity API for Manifest V3 extensions. Handles OAuth2 login, token storage, refresh cycles, authenticated fetch, and user profile retrieval in two small classes.

INSTALL

```
npm install chrome-identity-helper
```

EXPORTS

The package exports two classes from `src/index.ts`.

`IdentityHelper` is a static utility class that wraps `chrome.identity` methods.

`TokenManager` is an instance class that persists OAuth tokens in `chrome.storage.local` and handles expiry checks and automatic refresh.


IDENTITYHELPER API

All methods on IdentityHelper are static and return promises unless noted.

`IdentityHelper.getToken(interactive?: boolean)` returns a promise that resolves to the OAuth2 access token string. Calls `chrome.identity.getAuthToken` under the hood. Defaults to interactive mode.

`IdentityHelper.removeToken(token: string)` removes a cached auth token so the next `getToken` call fetches a fresh one.

`IdentityHelper.getProfileInfo()` returns user profile info (email and id) via `chrome.identity.getProfileUserInfo`.

`IdentityHelper.launchWebAuth(url: string, interactive?: boolean)` launches a web auth flow for third-party OAuth providers. Returns the redirect URL string containing the authorization code or token.

`IdentityHelper.getRedirectURL(path?: string)` returns the redirect URL synchronously. This is not async. Useful when constructing OAuth URLs that need the extension redirect endpoint.

`IdentityHelper.signOut()` silently fetches the current token, removes it from the cache, and revokes it against Google's OAuth revocation endpoint.

`IdentityHelper.authFetch(url: string, init?: RequestInit)` grabs a token via `getToken()` and performs a `fetch` call with the `Authorization: Bearer` header injected.


TOKENMANAGER API

TokenManager is instantiated with an optional storage key (defaults to `__oauth_tokens__`).

```ts
const tokens = new TokenManager('my_app_tokens');
```

Token data shape stored and returned by TokenManager:

```ts
{
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes?: string[];
}
```

`save(data)` writes the token data object to `chrome.storage.local`.

`get()` reads stored token data. Returns null if nothing is saved.

`isExpired()` checks whether the current token has passed its `expiresAt` timestamp. Returns false if no expiry is set.

`clear()` removes the stored token data entirely.

`getValid(refreshFn?)` returns the access token string if it has not expired. If the token is expired and a `refreshToken` exists, it calls the provided `refreshFn` to obtain a new access token and persists the result before returning it. Returns null when no token is stored or refresh is not possible.

The refresh function signature:

```ts
(refreshToken: string) => Promise<{ accessToken: string; expiresAt: number }>
```


USAGE

Getting a token and making an authenticated request:

```ts
import { IdentityHelper } from 'chrome-identity-helper';

const token = await IdentityHelper.getToken();
```

Using authFetch to call a Google API:

```ts
const response = await IdentityHelper.authFetch('https://www.googleapis.com/oauth2/v1/userinfo');
const user = await response.json();
```

Storing and refreshing tokens for a third-party provider:

```ts
import { TokenManager } from 'chrome-identity-helper';

const tokens = new TokenManager();

await tokens.save({
  accessToken: 'abc',
  refreshToken: 'xyz',
  expiresAt: Date.now() + 3600 * 1000,
  scopes: ['read', 'write'],
});

const valid = await tokens.getValid(async (refreshToken) => {
  const res = await fetch('https://provider.com/token', {
    method: 'POST',
    body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });
  const json = await res.json();
  return { accessToken: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
});
```


MANIFEST PERMISSIONS

Your `manifest.json` needs the identity permission and an OAuth2 section if you are using Google sign-in:

```json
{
  "permissions": ["identity", "storage"],
  "oauth2": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "scopes": ["email", "profile"]
  }
}
```


DEVELOPMENT

```
git clone https://github.com/theluckystrike/chrome-identity-helper.git
cd chrome-identity-helper
npm install
npm run build
npm test
```

TypeScript compilation targets ES2020 and outputs to `dist/` with declaration files and source maps.


LICENSE

MIT. See LICENSE file.

---

Part of the zovo.one Chrome extension studio. Visit https://zovo.one for more tools and extensions.
