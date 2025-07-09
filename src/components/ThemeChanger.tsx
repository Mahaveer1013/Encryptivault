import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeChanger({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
    return (
        <button
            onClick={toggleTheme}
            className="flex items-center px-3 py-2 rounded-md bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] hover:bg-[var(--card-bg)] transition"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
            ) : (
                <MoonIcon className="h-5 w-5" />
            )}
        </button>
    );
}
