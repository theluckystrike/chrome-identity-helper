# chrome-identity-helper

[![npm version](https://img.shields.io/npm/v/chrome-identity-helper)](https://npmjs.com/package/chrome-identity-helper)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Web%20Extension-orange.svg)](https://developer.chrome.com/docs/extensions/)
[![CI Status](https://github.com/theluckystrike/chrome-identity-helper/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/chrome-identity-helper/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-identity-helper?style=social)](https://github.com/theluckystrike/chrome-identity-helper)

> Chrome Identity API wrapper for OAuth2 and authentication flows.

**chrome-identity-helper** simplifies OAuth2 authentication in Chrome extensions with token management, refresh handling, and secure storage. Part of the Zovo Chrome extension utilities.

Part of the [Zovo](https://zovo.one) developer tools family.

## Overview

chrome-identity-helper simplifies OAuth2 authentication in Chrome extensions with token management, refresh handling, and secure storage.

## Features

- ✅ **OAuth2 Support** - Full OAuth2 flow implementation
- ✅ **Token Management** - Automatic token refresh
- ✅ **Secure Storage** - Store tokens securely
- ✅ **Profile Fetching** - Get user profile data
- ✅ **TypeScript Support** - Full type definitions included

## Installation

```bash
npm install chrome-identity-helper
```

## Usage

### Get Auth Token

```javascript
import { Identity } from 'chrome-identity-helper';

const auth = new Identity({
  clientId: 'your-client-id.apps.googleusercontent.com',
  scopes: ['email', 'profile'],
});

const token = await auth.getToken();
console.log('Access token:', token);
```

### Get Profile

```javascript
const profile = await auth.getProfile();
console.log(profile.email, profile.name, profile.picture);
```

### With Refresh Token

```javascript
// Tokens automatically refreshed when expired
const auth = new Identity({
  clientId: 'your-client-id',
  refreshToken: 'stored-refresh-token',
});

const token = await auth.getToken(); // Auto-refreshes if needed
```

## API

### Options

| Option | Type | Description |
|--------|------|-------------|
| clientId | string | OAuth2 client ID |
| scopes | string[] | Permission scopes |
| redirectUri | string | Redirect URI |

### Methods

- `getToken()` - Get access token
- `getProfile()` - Get user profile
- `revokeToken()` - Revoke access token
- `logout()` - Clear all tokens

## Manifest

```json
{
  "oauth2": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "scopes": ["email", "profile"]
  }
}
```

## Browser Support

- Chrome 90+

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/identity-improvement`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/identity-improvement`
7. **Submit** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/theluckystrike/chrome-identity-helper.git
cd chrome-identity-helper

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [zovo-extension-template](https://github.com/theluckystrike/zovo-extension-template) - Boilerplate for building privacy-first Chrome extensions
- [zovo-types-webext](https://github.com/theluckystrike/zovo-types-webext) - Comprehensive TypeScript type definitions for browser extensions
- [chrome-data-encrypt](https://github.com/theluckystrike/chrome-data-encrypt) - AES-256 encryption

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT - [Zovo](https://zovo.one)

---

Built by [Zovo](https://zovo.one)
