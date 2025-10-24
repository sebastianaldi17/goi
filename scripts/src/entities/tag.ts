import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Vocab } from "./vocab"

@Entity("tags")
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    vocab_id: number;

    @Column()
    tag_name: string;

    @JoinColumn({ name: "vocab_id" })
    @ManyToOne(() => Vocab, (vocab) => vocab.tags)
    vocab: Vocab;
}