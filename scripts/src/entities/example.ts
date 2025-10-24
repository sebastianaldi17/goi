import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Vocab } from "./vocab";

@Entity("examples")
export class Example extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    vocab_id: number;

    @Column()
    japanese: string;

    @Column()
    english: string;

    @JoinColumn({ name: "vocab_id" })
    @ManyToOne(() => Vocab, (vocab) => vocab.examples)
    vocab: Vocab;
}