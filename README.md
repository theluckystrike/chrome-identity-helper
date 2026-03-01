# chrome-identity-helper — OAuth2 for Chrome Extensions
> **Built by [Zovo](https://zovo.one)**

OAuth2 login, token management, profile info, and authenticated fetch. `npm i chrome-identity-helper`

```typescript
import { IdentityHelper, TokenManager } from 'chrome-identity-helper';
const token = await IdentityHelper.getToken();
const user = await IdentityHelper.getProfileInfo();
const resp = await IdentityHelper.authFetch('https://api.example.com/me');
```
MIT License
