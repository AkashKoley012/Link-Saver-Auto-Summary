import { expect, test } from "@jest/globals";

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

test("validates URLs correctly", () => {
    expect(isValidUrl("https://en.wikipedia.org/wiki/Artificial_intelligence")).toBe(true);
    expect(isValidUrl("not-a-url")).toBe(false);
});
