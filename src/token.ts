/**
 * Token Manager — Store and refresh OAuth tokens
 */
export class TokenManager {
    private storageKey: string;

    constructor(storageKey: string = '__oauth_tokens__') { this.storageKey = storageKey; }

    /** Save token data */
    async save(data: { accessToken: string; refreshToken?: string; expiresAt?: number; scopes?: string[] }): Promise<void> {
        await chrome.storage.local.set({ [this.storageKey]: data });
    }

    /** Get stored token */
    async get(): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: number; scopes?: string[] } | null> {
        const result = await chrome.storage.local.get(this.storageKey);
        return result[this.storageKey] || null;
    }

    /** Check if token is expired */
    async isExpired(): Promise<boolean> {
        const data = await this.get();
        if (!data?.expiresAt) return false;
        return Date.now() >= data.expiresAt;
    }

    /** Clear tokens */
    async clear(): Promise<void> { await chrome.storage.local.remove(this.storageKey); }

    /** Get valid token (auto-refresh if needed) */
    async getValid(refreshFn?: (refreshToken: string) => Promise<{ accessToken: string; expiresAt: number }>): Promise<string | null> {
        const data = await this.get();
        if (!data) return null;
        if (!await this.isExpired()) return data.accessToken;
        if (data.refreshToken && refreshFn) {
            const refreshed = await refreshFn(data.refreshToken);
            await this.save({ ...data, ...refreshed });
            return refreshed.accessToken;
        }
        return null;
    }
}
