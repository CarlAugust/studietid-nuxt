export interface Class {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface Room {
    id: number;
    name: string;
}

export interface Status {
    id: number;
    name: string;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
}

export interface SubjectClass {
    idSubject: number;
    idClass: number;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    idRole: number;
    isAdmin: boolean;
    email: string;
    imageId: string;
    password: string;
    idClass: number;
}

export interface ActivitySchedule {
    id: number;
    startTime: Date;
    duration: number;
    endTime: Date;
}

export interface Activity {
    id: number;
    idUser: number;
    startTime: Date;
    idSubject: number;
    idRoom: number;
    idStatus: number;
    duration: number;
    idDate: number;
    idTeacher: number;
}

export interface Id {
    id: number;
}