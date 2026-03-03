/**
 * Identity Helper — OAuth2 and Chrome Identity API wrapper
 */

export class IdentityError extends Error {
    constructor(
        message: string,
        public code: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'IdentityError';
        if (originalError?.stack) {
            this.stack = originalError.stack;
        }
    }
}

export const IdentityErrorCode = {
    GET_TOKEN_FAILED: 'GET_TOKEN_FAILED',
    REMOVE_TOKEN_FAILED: 'REMOVE_TOKEN_FAILED',
    PROFILE_FAILED: 'PROFILE_FAILED',
    AUTH_FLOW_FAILED: 'AUTH_FLOW_FAILED',
    SIGN_OUT_FAILED: 'SIGN_OUT_FAILED',
    AUTH_FETCH_FAILED: 'AUTH_FETCH_FAILED',
} as const;

export class IdentityHelper {
    /** Get OAuth2 token (interactive) */
    static async getToken(interactive: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive }, (token) => {
                if (chrome.runtime.lastError) {
                    const err = new Error(chrome.runtime.lastError.message);
                    reject(new IdentityError(
                        `Failed to get auth token: ${chrome.runtime.lastError.message}. ` +
                        `Make sure the extension has the "identity" permission in manifest.json and OAuth2 is properly configured.`,
                        IdentityErrorCode.GET_TOKEN_FAILED,
                        err
                    ));
                } else {
                    resolve(token || '');
                }
            });
        });
    }

    /** Remove cached token */
    static async removeToken(token: string): Promise<void> {
        if (!token) {
            throw new IdentityError(
                'Token is required to remove.',
                IdentityErrorCode.REMOVE_TOKEN_FAILED
            );
        }
        return new Promise((resolve, reject) => { 
            chrome.identity.removeCachedAuthToken({ token }, () => {
                if (chrome.runtime.lastError) {
                    const err = new Error(chrome.runtime.lastError.message);
                    reject(new IdentityError(
                        `Failed to remove cached token: ${chrome.runtime.lastError.message}.`,
                        IdentityErrorCode.REMOVE_TOKEN_FAILED,
                        err
                    ));
                } else {
                    resolve(); 
                }
            }); 
        });
    }

    /** Get user profile info */
    static async getProfileInfo(): Promise<chrome.identity.UserInfo> {
        return new Promise((resolve, reject) => {
            chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' as any }, (info) => {
                if (chrome.runtime.lastError) {
                    const err = new Error(chrome.runtime.lastError.message);
                    reject(new IdentityError(
                        `Failed to get profile info: ${chrome.runtime.lastError.message}. ` +
                        `Make sure the extension has the "identity" permission.`,
                        IdentityErrorCode.PROFILE_FAILED,
                        err
                    ));
                } else {
                    resolve(info);
                }
            });
        });
    }

    /** Launch web auth flow for third-party OAuth */
    static async launchWebAuth(url: string, interactive: boolean = true): Promise<string> {
        if (!url) {
            throw new IdentityError(
                'URL is required for web auth flow.',
                IdentityErrorCode.AUTH_FLOW_FAILED
            );
        }
        return new Promise((resolve, reject) => {
            chrome.identity.launchWebAuthFlow({ url, interactive }, (redirectUrl) => {
                if (chrome.runtime.lastError) {
                    const err = new Error(chrome.runtime.lastError.message);
                    reject(new IdentityError(
                        `Web auth flow failed: ${chrome.runtime.lastError.message}. ` +
                        `Verify the OAuth URL is correct and the redirect URL is whitelisted.`,
                        IdentityErrorCode.AUTH_FLOW_FAILED,
                        err
                    ));
                } else {
                    resolve(redirectUrl || '');
                }
            });
        });
    }

    /** Get redirect URL for OAuth callbacks */
    static getRedirectURL(path: string = ''): string { return chrome.identity.getRedirectURL(path); }

    /** Sign out (clear all cached tokens) */
    static async signOut(): Promise<{ success: boolean; error?: string }> {
        try {
            const token = await this.getToken(false);
            if (token) { 
                await this.removeToken(token); 
                try {
                    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
                } catch (fetchError) {
                    // Token revocation endpoint might fail but token was removed from cache
                    console.warn('[IdentityHelper] Token revocation request failed:', fetchError);
                }
            }
            return { success: true };
        } catch (error) {
            const err = error as Error;
            return { 
                success: false, 
                error: err.message || 'Sign out failed' 
            };
        }
    }

    /** Make authenticated fetch */
    static async authFetch(url: string, init?: RequestInit): Promise<Response> {
        if (!url) {
            throw new IdentityError(
                'URL is required for authenticated fetch.',
                IdentityErrorCode.AUTH_FETCH_FAILED
            );
        }
        
        let token: string;
        try {
            token = await this.getToken();
        } catch (error) {
            const err = error as Error;
            throw new IdentityError(
                `Failed to get authentication token: ${err.message}`,
                IdentityErrorCode.AUTH_FETCH_FAILED,
                err
            );
        }
        
        try {
            return await fetch(url, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } });
        } catch (error) {
            const err = error as Error;
            throw new IdentityError(
                `Authenticated fetch failed: ${err.message}. ` +
                `Check the URL is accessible and the server accepts the token.`,
                IdentityErrorCode.AUTH_FETCH_FAILED,
                err
            );
        }
    }
}
