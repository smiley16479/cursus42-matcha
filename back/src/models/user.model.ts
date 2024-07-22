// import { hash } from 'bcrypt';
import {
    BeforeCreate,
    BeforeUpdate,
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    Table
} from 'sequelize-typescript';

import {
    RoleCodes
} from './';
import path from 'path';

interface UserAttributes {
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    paidLeaveRemaining: number,
    birthday: Date,
    hiringDate: Date,
    mail: string,
    isActive: boolean,
    dayDeduction: number,
    phone: string,
    isUsingCra: boolean,
    isTrainee: boolean,
    isStaffRepresentative: boolean,
    rttRemaining: number,
    roleId: number,
    paceCode?: string,
    position?: string,
    firstExpDate?: Date,
    missionEndDate?: Date,
    osamiamToken?: string,
    missionLocation?: string,
    experience?: number,
    tjmMin?: number,
    technology?: string,
    pictureFile?: string,
}

export type UserCreationAttributes = UserAttributes;

@Table({
    tableName: 'Utilisateurs',
    timestamps: false,
    indexes: [
        {
            name: 'IDX_1483A5E9483BAC85',
            fields: ['USR_ROL'],
        }
    ]
})
export default class User extends Model<UserAttributes, UserCreationAttributes> {
    public static readonly IMAGE_DIR = path.join(process.env.UPLOAD_DIR || '/srv/www/api/uploads', 'images');

    @Column({
        type: DataType.STRING(20),
        field: 'USR_LOGIN',
        primaryKey: true,
        allowNull: false,
    })
    username!: string;

    @Column({
        type: DataType.STRING(255),
        field: 'USR_PASSWORD',
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING(50),
        field: 'USR_NOM',
        allowNull: false,
    })
    lastname!: string;

    @Column({
        type: DataType.STRING(50),
        field: 'USR_PRENOM',
        allowNull: false,
    })
    firstname!: string;

    @Column({
        type: DataType.STRING(50),
        field: 'USR_FONCTION',
        allowNull: true,
    })
    position?: string;

    @Column({
        type: DataType.DATEONLY,
        field: 'USR_DATE_NAISSANCE',
        allowNull: false,
    })
    birthday!: Date;

    @Column({
        type: DataType.DOUBLE,
        field: 'USR_JOUR_RESTANT',
        allowNull: false,
    })
    paidLeaveRemaining!: number;

    @Column({
        type: DataType.DATEONLY,
        field: 'USR_DATE_EMBAUCHE',
        allowNull: false,
    })
    hiringDate!: Date;

    @Column({
        type: DataType.DATEONLY,
        field: 'USR_DATE_FIRST_EXPERIENCE',
        allowNull: true,
    })
    firstExpDate?: Date;

    // pas utilisé
    // @Column({
    //     type: DataType.DECIMAL(2, 1),
    //     field: 'USR_TEMPS',
    //     allowNull: false,
    // })
    // workingTime!: number;

    @Column({
        type: DataType.STRING(150),
        field: 'USR_EMAIL',
        allowNull: false,
    })
    mail!: string;

    @Column({
        type: DataType.BOOLEAN,
        field: 'USR_ACTIF',
        allowNull: false,
    })
    isActive!: boolean;

    @Column({
        type: DataType.DOUBLE,
        field: 'USR_DEDUCTION_JOUR_ACQUIS',
        allowNull: false,
    })
    dayDeduction!: number;

    @Column({
        type: DataType.STRING(10),
        field: 'USR_TELPORT',
        allowNull: false,
    })
    phone!: string;

    @Column({
        type: DataType.BOOLEAN,
        field: 'USR_GESTION_CRA',
        allowNull: false,
    })
    isUsingCra!: boolean;

    // @Column({
    //     type: DataType.STRING(150),
    //     field: 'USR_TOKEN',
    //     allowNull: true,
    // })
    // token?: string;

    // @Column({
    //     type: DataType.DATEONLY,
    //     field: 'USR_DATE_TOKEN',
    //     allowNull: true,
    // })
    // tokenDate?: Date;

    @Column({
        type: DataType.DATEONLY,
        field: 'USR_DATE_PREVISIONNELLE_FIN_MISSION',
        allowNull: true,
    })
    missionEndDate?: Date;

    @Column({
        type: DataType.BOOLEAN,
        field: 'USR_STAGIAIRE',
        allowNull: false,
    })
    isTrainee!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        field: 'USR_DELEGUE_PERSONNEL',
        allowNull: false,
    })
    isStaffRepresentative!: boolean;

    @Column({
        type: DataType.DOUBLE,
        field: 'USR_RTT_RESTANT',
        allowNull: false,
    })
    rttRemaining!: number;

    // @Column({
    //     type: DataType.DOUBLE,
    //     field: 'USR_RTT_PRIS',
    //     allowNull: true,
    // })
    // rttTaken?: number;

    @Column({
        type: DataType.STRING(150),
        field: 'USR_TOKEN_OSAMIAM',
        allowNull: true,
    })
    osamiamToken?: string;

    @Column({
        type: DataType.STRING(30),
        field: 'USR_LIEU_MISSION',
        allowNull: true,
    })
    missionLocation?: string;

    @Column({
        type: DataType.DOUBLE,
        field: 'USR_EXPERIENCE',
        allowNull: true,
    })
    experience?: number;

    @Column({
        type: DataType.INTEGER,
        field: 'USR_TJM_MIN',
        allowNull: true,
    })
    tjmMin?: number;

    @Column({
        type: DataType.STRING(120),
        field: 'USR_TECHNOLOGIE',
        allowNull: true,
    })
    technology?: string;

    @Column({
        type: DataType.ENUM,
        field: 'USR_ROLE',
        allowNull: true,
    })
    role?: RoleCodes;

    @BeforeCreate
    @BeforeUpdate
    static async hashPassword(user: User) {
/*         if (user.changed('password')) {
            const hashedPassword = await hash(user.password, 10);
            user.password = hashedPassword;
        } */
    }

    public get formattedHiringDate(): string {
        const today = new Date(this.hiringDate);
        const yyyy = today.getFullYear();
        let mm: string | number = today.getMonth() + 1; // Months start at 0!
        let dd: string | number = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + '/' + mm + '/' + yyyy;
    }
}
