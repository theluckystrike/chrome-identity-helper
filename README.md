# chrome-identity-helper

Chrome Identity API wrapper for OAuth2 and authentication flows.

## Overview

chrome-identity-helper simplifies OAuth2 authentication in Chrome extensions with token management, refresh handling, and secure storage.

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

## License

MIT
