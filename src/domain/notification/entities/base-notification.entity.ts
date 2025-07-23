import { UserEntity } from '../../../domain/user/entities/user.entity';
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

    @ManyToOne(() => UserEntity, { lazy: true })
    @JoinColumn({ name: 'userId' })
    recipient: UserEntity;

    read() {
        this.isRead = true;
    }
}
