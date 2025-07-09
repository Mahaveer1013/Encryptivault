import { Folder, Password, PasswordRequest } from "@/types";

export const getFolders = async (): Promise<Folder[]> => {
    const response = await fetch('/api/folders');
    return response.json() as Promise<Folder[]>;
};

export const getFolder = async (folderId: string): Promise<Folder> => {
    const response = await fetch(`/api/folders/${folderId}`);
    return response.json() as Promise<Folder>;
};

export const createFolder = async (folder: Folder): Promise<Folder> => {
    const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(folder),
    });
    return response.json() as Promise<Folder>;
};

export const getPasswords = async (folderId: string): Promise<Password[]> => {
    const response = await fetch(`/api/passwords?folder=${folderId}`);
    return response.json() as Promise<Password[]>;
};

export const createPassword = async (password: PasswordRequest): Promise<Password> => {
    const response = await fetch('/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(password),
    });
    return response.json() as Promise<Password>;
};

export const deletePassword = async (passwordId: string): Promise<Password> => {
    const response = await fetch(`/api/passwords/${passwordId}`, {
        method: 'DELETE',
    });
    return response.json() as Promise<Password>;
};
