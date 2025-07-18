import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SystemVariableInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: '?úÏä§??Î≥Ä???ÑÏù¥??,
        example: 'exSystemVariableId',
    })
    systemVariableId: string;

    @Column()
    @ApiProperty({
        description: '?úÏä§??Î≥Ä???¥Î¶Ñ',
        example: 'exSystemVariableName',
    })
    systemVariableName: string;

    @Column()
    @ApiProperty({
        description: '?úÏä§??Î≥Ä??Í∞?,
        example: 'exSystemVariableValue',
    })
    systemVariableValue: string;
}
