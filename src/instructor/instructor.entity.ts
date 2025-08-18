import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GenderEnum } from "../common/gender-enum";

@Entity('instructors')
export class Instructor{

    @PrimaryGeneratedColumn('uuid')
    id : string;
    
    @Column({type : 'varchar', default: null})
    name : string;
    
    @Column({unique: true})
    email : string;

    
    @Column({unique: true})
    phone : string;
    
    @Column()
    password : string;
    
    @Column({type: 'enum', enum: GenderEnum, nullable : true, default: null})  
    gender : GenderEnum | null;
    
    @Column({nullable : true, default : '/images/avatar.png'})
    imageUrl : string;
        
    @Column({default : false})
    is_verified : boolean;
    
    @Column({nullable : true})
    bio : string;
    
    @Column({nullable : true})
    specilization : string;
  
    @Column({nullable: true, type: 'date'})
    birth_date : Date;

    @Column({nullable : true})
    otp : string;

    @Column({ type: 'timestamptz' , nullable : true})
    expires_at : Date;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at : Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at : Date;

    @BeforeInsert()
    setExpiry() {
        const now = new Date();
        this.expires_at = new Date(now.getTime() + 5 * 60 * 1000);
    }
    


}
