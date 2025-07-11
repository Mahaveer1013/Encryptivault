import { Folder, Password, PasswordRequest } from "@/types";

export const getFoldersApi = async (): Promise<Folder[]> => {
    const response = await fetch('/api/folders');
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<Folder[]>;
};

export const getFolderApi = async (folderId: string): Promise<Folder> => {
    const response = await fetch(`/api/folders/${folderId}`);
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<Folder>;
};

export const createFolderApi = async (name: string, salt: string, hashedKey: string): Promise<Folder> => {
    const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, salt, hashedKey }),
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<Folder>;
};

export const getPasswordsApi = async (folderId: string): Promise<Password[]> => {
    const response = await fetch(`/api/passwords?folder=${folderId}`);
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<Password[]>;
};

export const createPasswordApi = async (password: PasswordRequest): Promise<Password> => {
    const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(password),
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<Password>;
};

export const deletePasswordApi = async (passwordId: string): Promise<Password> => {
    const response = await fetch(`/api/passwords/${passwordId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<Password>;
};

export const loginApi = async (email: string, password: string, rememberMe: boolean): Promise<{ user: string }> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    return response.json() as Promise<{ user: string }>;
}

export const logoutApi = async () => {
    await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
    });
};

export const verifyApi = async (): Promise<{ user: string } | null> => {
    const response = await fetch('/api/auth/verify-user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to fetch folders');
    }
    const data = await response.json();

    if (!data.user) {
        return null;
    }
    return data.user as Promise<{ user: string }>;
};
