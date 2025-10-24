export async function searchWordInJisho(word: string): Promise<any> {
    const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`);
    const data = await response.json();
    return data;
}