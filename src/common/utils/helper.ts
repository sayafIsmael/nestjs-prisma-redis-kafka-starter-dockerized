export async function generateSlug(name: string): Promise<string> {
    return name.toLowerCase().replace(/\s+/g, '-'); // Converts to lowercase and replaces spaces with hyphens
}