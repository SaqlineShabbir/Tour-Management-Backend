import type { Types } from "mongoose"

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER= "USER",
    GUIDE="GUIDE"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface AuthProvider {
    provider:string
    providerId:string
}
export interface IUser {
    name:string
    email:string
    password?:string
    phone?:string
    picture?:string
    address?:string
    isDeleted?:string
    isActive?:IsActive
    isVarified?:string
     role:Role
    auths:AuthProvider[]
    bookings?:Types.ObjectId[]
    guideS?:Types.ObjectId[]

}