import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Transaction extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @ObjectIdColumn()
    userId: ObjectID;

    @Column()
    status: number; // 0 -> New Order, 1 -> Accepted Order, 2 -> Cancelled Order 

    @Column("decimal", { precision: 5, scale: 2 }) // full_amount;
    grossCost: number;

    @Column("decimal", { precision: 5, scale: 2 }) // amount without tax;
    total: number;

    @Column("decimal", { precision: 5, scale: 2 })
    totalTax: number;

    @Column() // -> 0 Cash, 1 -> Card, 2 -> Online Banking 
    transactionMethod: number;

    @Column({ default: 0 }) // 0 -> default cash, 1 -> fpx, 2 -> card (Debit or Credit)
    transactionStatus: number;

    @Column({ default: "MYR" })
    currencyCode: string;

    @Column()
    prepaid: boolean;

    @Column()
    notes: string;

    @CreateDateColumn({ type: 'timestamp' })
    createDate: Date

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updateDate?: Date

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    deleteDate?: Date
}