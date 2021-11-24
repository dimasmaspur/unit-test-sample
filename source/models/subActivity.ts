import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum Category {
    rawat = 'Rawat',
    panen = 'Panen',
    transportasi = 'Transportasi'
}

@Entity({ name: 'subActivities' })
export class SubActivity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    accountNumber!: string;

    @Column()
    name!: string;

    @Column({ length: 250, nullable: true })
    description!: string;

    @Column({
        type: 'enum',
        enum: Category,
        default: Category.rawat
    })
    category!: Category;

    @Column({ default: false, select: false })
    isDeleted!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ select: false })
    createdBy!: string;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ nullable: true, select: false })
    updatedBy!: string;

    @DeleteDateColumn()
    deletedAt!: Date;
}
