/**
 * Identity Helper — OAuth2 and Chrome Identity API wrapper
 */
export class IdentityHelper {
    /** Get OAuth2 token (interactive) */
    static async getToken(interactive: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive }, (token) => {
                if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                else resolve(token || '');
            });
        });
    }

    /** Remove cached token */
    static async removeToken(token: string): Promise<void> {
        return new Promise((resolve) => { chrome.identity.removeCachedAuthToken({ token }, () => resolve()); });
    }

    /** Get user profile info */
    static async getProfileInfo(): Promise<chrome.identity.UserInfo> {
        return new Promise((resolve, reject) => {
            chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' as any }, (info) => {
                if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                else resolve(info);
            });
        });
    }

    /** Launch web auth flow for third-party OAuth */
    static async launchWebAuth(url: string, interactive: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({ url, interactive }, (redirectUrl) => {
                if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                else resolve(redirectUrl || '');
            });
        });
    }

    /** Get redirect URL for OAuth callbacks */
    static getRedirectURL(path: string = ''): string { return chrome.identity.getRedirectURL(path); }

    /** Sign out (clear all cached tokens) */
    static async signOut(): Promise<void> {
        try {
            const token = await this.getToken(false);
            if (token) { await this.removeToken(token); await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`); }
        } catch { }
    }

    /** Make authenticated fetch */
    static async authFetch(url: string, init?: RequestInit): Promise<Response> {
        const token = await this.getToken();
        return fetch(url, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } });
    }
}
