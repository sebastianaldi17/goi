import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Vocab } from "./vocab";

@Entity("definitions")
export class Definition extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    vocab_id: number;

    @Column("text", { array: true })
    parts_of_speech: string[];

    @Column("text", { array: true })
    meanings: string[];

    @Column("text", { array: true })
    tags: string[];

    @JoinColumn({ name: "vocab_id" })
    @ManyToOne(() => Vocab, (vocab) => vocab.definitions)
    vocab: Vocab;
}