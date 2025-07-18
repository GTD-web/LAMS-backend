import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SystemVariableInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        description: '?�스??변???�이??,
        example: 'exSystemVariableId',
    })
    systemVariableId: string;

    @Column()
    @ApiProperty({
        description: '?�스??변???�름',
        example: 'exSystemVariableName',
    })
    systemVariableName: string;

    @Column()
    @ApiProperty({
        description: '?�스??변??�?,
        example: 'exSystemVariableValue',
    })
    systemVariableValue: string;
}
