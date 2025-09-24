export function removeProtocol(url: string) {
    return url.replace(/^https?:\/\//, "");
}

export function normalizeUrl(siteUrl: string): string {
    let url = siteUrl.trim();

    if (!url) throw new Error("URL cannot be empty.");
    if (/\s/.test(url)) throw new Error("URL cannot contain whitespace.");

    const domainPattern = /^(\*\.)?([\w-]+\.)+[a-zA-Z]{2,}$/;

    const parts = url.split("/", 2);
    const domain = parts[0];
    let path = url.slice(domain.length);

    if (!domainPattern.test(domain)) {
        throw new Error(
            "Invalid domain format. Example: 'example.com' or '*.example.com'.",
        );
    }

    path = path.split("?")[0].split("#")[0];

    if (!path) {
        path = "/";
    }

    if (path !== "/") {
        if (!path.endsWith("*")) {
            path += "*";
        }
    }

    return domain + path;
}
