export const fetcher = (url: string) =>fetch (url).then (res => res.json ());

export const ENV = (key: string, alt?: string) => (process.env[key] ?? alt) ?? "" 