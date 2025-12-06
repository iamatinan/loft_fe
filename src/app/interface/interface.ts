
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
export interface LineProfileInterface {
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
    contactId: CustomerInterface | null;
    connectLineAt: Date | null;
    connectLineBy: string | null;
}


export interface MetaLineProfileData {
    data: LineProfileInterface[];
    meta: Meta;
}

export interface TagReference {
    _id: string;
    name: string;
}

export interface CustomerInterface {
    _id: string;
    hnNumber: string;
    idCard: string;
    firstName: string;
    lastName: string;
    gender: string | null;
    isOrthodontics: boolean;
    lineId: string | null;
    dateOfBirth: Date | null;
    age: number;
    phone: string;
    isConnectLine: boolean;
    lineProfileId: string | LineProfileInterface | null;
    appointmentDate: Date[];
    appointmentFollowUp: Date[];
    tag: string[] | null;
    tagIds?: TagReference[];
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    // Legacy fields for backward compatibility
    name?: string;
    weight?: number | null;
    height?: number | null;
    email?: string;
    addresses?: string;
    customerType?: string;
    connectLineAt?: Date | null;
    connectLineBy?: string | null;
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

export interface MetaCustomerData {
    data: CustomerInterface[];
    meta: Meta;
}