import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "./tag";
import { Definition } from "./definition";
import { Example } from "./example";

@Entity("vocabs")
export class Vocab extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    kanji: string;

    @Column()
    kana: string;

    @Column()
    level: string;

    @Column({ type: "jsonb" })
    jisho_raw_response: object;

    @JoinColumn({ referencedColumnName: "vocab_id" })
    @OneToMany(() => Tag, (tag) => tag.vocab)
    tags: Tag[];

    @JoinColumn({ referencedColumnName: "vocab_id" })
    @OneToMany(() => Definition, (definition) => definition.vocab)
    definitions: Definition[];
    
    @JoinColumn({ referencedColumnName: "vocab_id" })
    @OneToMany(() => Example, (example) => example.vocab)
    examples: Example[];
}