export default async function fetch(url) {
    const request = await window.fetch(url);
    return request.text();
}
