import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import * as bcrypt from "bcrypt"
import { InternalServerErrorException } from "@nestjs/common";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";

//type UserRole = 'client' | 'owner' | 'delivery';
enum UserRole {
    Client,
    Owner,
    Delivery,
}

registerEnumType(UserRole, {name: 'UserRole'})

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{

    @Column({unique:true})
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({select:false}) //재해시를 막는 첫번째 방법. 패스워드가 나가지 않도록 한다. 즉, typeorm이 이 항목이 업데이트 되었다 보지 않도록 한다
    @Field(type => String)
    @IsString()
    password: string;

    @Column({type: 'enum', enum: UserRole})
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false })
    @Field(type => Boolean)
    @IsBoolean()
    verified: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword():Promise<void>{
        //재해시를 막는 두번째 방법. password가 있을때만 hash하도록
        if(this.password){
            try {
                this.password = await bcrypt.hash(this.password, 10)
            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException()
            }
        }
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            return bcrypt.compare(aPassword, this.password);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException()
        }
    }
}