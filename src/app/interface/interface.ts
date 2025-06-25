import { Dayjs } from "dayjs";

// export interface IinitialValuesLineProfile {
//     _id: string;
//     userId: string;
//     displayName: string;
//     statusMessage: string;
//     picPath: string;
//     isActive: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//     createdBy: string;
//     updatedBy: string;
//     contactId: ICUSTOMER | null;
//     connectLineAt: Date | null;
//     connectLineBy: string | null;
// }
export interface ILineProfile {
    _id: string;
    userId: string;
    displayName: string;
    statusMessage: string;
    picPath: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    contactId: ICUSTOMER | null;
    connectLineAt: Date | null;
    connectLineBy: string | null;
}


export interface metaLineProfileData {
    data: ILineProfile[];
    meta: Meta;
}

export interface ICUSTOMER {
    name: string;
    lastName: string;
    phone: string;
    lineId: ILineProfile | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    dateOfBirth: Date | null;
    email: string;
    addresses: string;
    customerType: string;
    connectLineAt: Date | null;
    connectLineBy: string | null;
}
export interface IinitialValuesCreateCustomer {
    name: string;
    lastName: string;
    phone: string;
    lineId: string | null;
    age: number | null;
    weight: number | null;
    height: number | null;
    dateOfBirth: Date | null;
    email: string;
    addresses: string;
    customerType: string;
    connectLineAt?: Date | null;
    connectLineBy?: string | null;
}
export interface Meta {
    count: number;
    page: number;
    limit: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    orderBy?: {
        isActive?: number;
        updatedAt?: number;
    }

}

export interface metaCustomerData {
    data: any[];
    meta: Meta;
}