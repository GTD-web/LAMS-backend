import { LamsUserEntity } from '@src/domain/user/entities/lams-user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    TableInheritance,
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class BaseNotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    notificationId: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: false, default: false })
    isRead: boolean;

    @ManyToOne(() => LamsUserEntity, { lazy: true })
    @JoinColumn({ name: 'userId' })
    recipient: LamsUserEntity;

    read() {
        this.isRead = true;
    }
}
