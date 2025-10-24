import { AppDataSource } from "../src/data-source";
import { Tag } from "../src/entities/tag";
import { Vocab } from "../src/entities/vocab";
import { searchWordInJisho } from "../src/lib/jisho-lib";
import { loadSpreadsheet } from "../src/spreadsheet-client";
import { GoiRow } from "../src/types/goi-row";
import { JishoAPIResponse, JishoAPIResponseDatum } from "../src/types/jisho-response";
import { Definition } from "../src/entities/definition";
import { Example } from "../src/entities/example";
import dotenv from "dotenv";
import JishoAPI from "unofficial-jisho-api";

async function main() {
    try {
        const jisho = new JishoAPI();
        const dataSource = await AppDataSource.initialize();

        const spreadsheet = loadSpreadsheet(process.env.SPREADSHEET_ID || "");
        await spreadsheet.loadInfo();

        if (!process.env.SHEET_NAMES) {
            throw new Error("SHEET_NAMES environment variable is not set!");
        }
        const sheetNames = process.env.SHEET_NAMES.split(";");

        for (const sheetName of sheetNames) {
            const sheet = spreadsheet.sheetsByTitle[sheetName];
            if (!sheet) {
                throw new Error("Sheet not found");
            }
            const rows = await sheet.getRows<GoiRow>();
            if (!rows) {
                throw new Error("No rows found");
            }
            for (const row of rows) {
                await new Promise(resolve => setTimeout(resolve, 100)); // To avoid rate limiting
                const kanji = (row.get("Kanji") as string).trim();
                const kana = (row.get("Kana") as string).trim();
                const level = (row.get("Level") as string).trim();
                const tags = (row.get("Tag") as string).trim().split(";").map(tag => tag.trim()).filter(tag => tag.length > 0);

                const rawJishoResponse = await searchWordInJisho(kanji);
                if (!rawJishoResponse) {
                    console.warn(`Failed to fetch from Jisho: ${kanji}`);
                    continue;
                }
                const jishoResponse = rawJishoResponse as JishoAPIResponse;
                if (jishoResponse.data.length === 0) {
                    console.warn(`Word not found in Jisho: ${kanji}`);
                    continue;
                }

                let jishoEntry: JishoAPIResponseDatum | null = null;
                for (const entry of jishoResponse.data) {
                    const hasMatchingReading = entry.japanese.some(jp => jp.reading === kana);
                    if (hasMatchingReading) {
                        jishoEntry = entry;
                        break;
                    }
                }
                if (!jishoEntry) {
                    console.warn(`No matching entry with reading found in Jisho for: ${kanji} (${kana})`);
                    continue;
                }

                let vocabEntity = await Vocab.findOne({ where: { kanji, kana } });
                if (!vocabEntity) {
                    vocabEntity = new Vocab();
                    vocabEntity.kanji = kanji;
                    vocabEntity.kana = kana;
                    vocabEntity.level = level;
                    vocabEntity.jisho_raw_response = jishoResponse;
                }
                if (level > vocabEntity.level) { // N5 > N4 > N3 ...
                    vocabEntity.level = level;
                }
                await dataSource.manager.save(vocabEntity);

                const existingTags = await Tag.find({ where: { vocab_id: vocabEntity.id } });
                for (const tagName of tags) {
                    if (existingTags.some(t => t.tag_name === tagName)) {
                        continue;
                    }
                    const tagEntity = new Tag();
                    tagEntity.tag_name = tagName;
                    tagEntity.vocab_id = vocabEntity.id;
                    await dataSource.manager.save(tagEntity);
                }

                let definitions = await Definition.find({ where: { vocab_id: vocabEntity.id } });
                if (definitions && definitions.length > 0) {
                    continue;
                }

                for (const sense of jishoEntry.senses) {
                    const definitionEntity = new Definition();
                    definitionEntity.vocab_id = vocabEntity.id;
                    definitionEntity.meanings = sense.english_definitions;
                    definitionEntity.parts_of_speech = sense.parts_of_speech;
                    definitionEntity.tags = sense.tags;
                    await dataSource.manager.save(definitionEntity);
                }

                let examples = await Example.find({ where: { vocab_id: vocabEntity.id } });
                if (examples && examples.length > 0) {
                    continue;
                }

                let jishoExamples = await jisho.searchForExamples(kanji);
                if (!jishoExamples.found) {
                    jishoExamples = await jisho.searchForExamples(kana);
                }
                if (!jishoExamples.found) {
                    console.warn(`No examples found in Jisho for: ${kanji} / ${kana}`);
                    continue;
                }
                for (const ex of jishoExamples.results) {
                    const exampleEntity = new Example();
                    exampleEntity.vocab_id = vocabEntity.id;
                    exampleEntity.japanese = ex.kanji;
                    exampleEntity.english = ex.english;
                    await dataSource.manager.save(exampleEntity);
                }
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit(0);
    }
}

dotenv.config();
main();