import { BaseEntity, Entity, ObjectIdColumn, Column, CreateDateColumn, ObjectID } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @ObjectIdColumn()
    id: ObjectID;

    @Column("simple-json")
    name: { first: string, last: string };

    @Column()
    email: string;

    @Column("simple-json")
    photo: { url: string }

    @Column()
    phoneNumber: string;

    @Column()
    isVerified: string;

    @CreateDateColumn({ type: 'timestamp' })
    createDate: Date

    @Column({ type: "timestamp", nullable: true })
    updateDate?: Date

    @Column({ type: "timestamp", nullable: true })
    verifiedDate?: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteDate?: Date

}