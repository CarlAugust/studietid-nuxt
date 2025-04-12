import Database from 'better-sqlite3';
import fs from 'fs/promises';
const db = new Database('database/database.db');
import * as sqlType from '~/server/types/sql-types';



export async function initializeDatabase()
{   
    const sql = await fs.readFile('~/database/initdb.sql', 'utf8');
    db.exec(sql);

    let roles = ['Administrator', 'Lærer', 'student'];

    for (const role of roles)
    {
        // Try catch to avoid duplicate entries with roles unique constraint
        // Probobly bad solution might cahnge later
        try { db.prepare(`INSERT INTO role (name) VALUES (?)`).run(role); }
        catch (e) { }
    }
}

export function getUser(email: string)
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email
        FROM user
        inner join role on user.idRole = role.id
        WHERE user.email = ?`);

    let rows = sql.all(email);

    return rows[0];
}

export function getUserId(email: string)
{
    const item = db.prepare('SELECT id FROM user where user.email = ?').get(email) as sqlType.Id;
    return item;
}

export function getPassword(email: string)
{
    let sql = db.prepare(`SELECT password FROM user WHERE email = ?`);
}

export function getUsers()
{
    let sql = db.prepare(
        `SELECT user.id as userID, user.firstName, user.lastName, role.id as roleID, role.name as role, user.email, user.password as password, user.isAdmin as isAdmin
        FROM user
        inner join role on user.idRole = role.id`);

    let rows = sql.all();

    return rows;
}

export function getSubjects()
{
    let sql = db.prepare(`SELECT * FROM subject`);

    let rows = sql.all();

    return rows;
}

export function getRooms()
{
    let sql = db.prepare(`SELECT * FROM room`);

    let rows = sql.all();

    return rows;
}

export function addUser(user: sqlType.User)
{
    const {firstName, lastName, email, password, idClass, isAdmin, idRole} = user;

    let re = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    if (!re.test(email))
    {
        return "Invalid";
    }

    let sql = db.prepare(`SELECT email FROM user WHERE email = ?`);

    let rows = sql.all(email);
    
    if (rows.length > 0)
    {
        return "InUse";
    }

    sql = db.prepare(`INSERT INTO user (firstName, lastName, idRole, isAdmin, email, password, idClass) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    sql.run(firstName, lastName, idRole, isAdmin, email, password, idClass);

    return "Success";
};

export function addActivity(activity: sqlType.Activity)
{
    const {idUser, startTime, idSubject, idRoom, idStatus, duration} = activity;

    let sql = db.prepare(`INSERT INTO activity (idUser, startTime, idSubject, idRoom, idStatus, duration)
         VALUES (?, ?, ?, ?, ?, ?)`);
         
    sql.run(idUser, startTime, idSubject, idRoom, idStatus, duration);
}

// TODO: CHANGE!!!! Im definitly gonna forget this.
export function addRoom(name: string)
{
    let sql = db.prepare(`INSERT INTO room (name) VALUES (?)`);
    const info = sql.run(name);

    sql = db.prepare(`SELECT id FROM room WHERE id = ?`);

    let rows = sql.all(info.lastInsertRowid);
    console.log("Rowslength:" + rows.length);

    return rows[0];
}

export function addSubject(subject: sqlType.Subject)
{
    const {name, code} = subject;
    let existingItem = db.prepare(`SELECT id FROM subject WHERE code = ?`).get(code) as sqlType.Id;

    if (existingItem)
    {
        return existingItem.id;
    }
    else
    {
        const result = db.prepare(`INSERT INTO subject (name, code) VALUES (?, ?)`).run(name, code);
        return result.lastInsertRowid;
    }
}

function addClass(name: String)
{
    const existingItem = db.prepare(`SELECT id FROM class WHERE name = ?`).get(name) as sqlType.Id;

    if (existingItem)
    {
        return existingItem.id;
    }
    else
    {
        const result = db.prepare(`INSERT INTO class (name) VALUES (?)`).run(name);
        return result.lastInsertRowid;
    }
}

function addSubjectClass(subjectClass: sqlType.SubjectClass)
{
    const {idSubject, idClass} = subjectClass;
    const existingItem = db.prepare(`SELECT idSubject FROM subject_class WHERE idSubject = ? AND idClass = ?`).all(idSubject, idClass);

    if (existingItem.length > 0)
    {
        return existingItem.id;
    }
    else
    {
        const result = db.prepare(`INSERT INTO subject_class (idSubject, idClass) VALUES (?, ?)`).run(idSubject, idClass);
        return result.lastInsertRowid;
    }
}

// Here are all the delete related functions
//------------------------------------------------//

export function deleteUser(email: string)
{   
    let row = getUserId(email) as sqlType.Id;

    // To anonymize the data we change the idUser to 1, which is the root user
    let sql = db.prepare(`UPDATE activity SET idUser = 1 WHERE idUser = ?`);
    sql.run(row.userID);

    sql = db.prepare(`DELETE FROM user WHERE id = ?`);
    sql.run(row.userID);
}

export function deleteSubject(name)
{
    let sql = db.prepare(`DELETE FROM subject WHERE name = ?`);
    sql.run(name);
}

export function deleteRoom(name)
{
    let sql = db.prepare(`DELETE FROM room WHERE name = ?`);
    sql.run(name);
}

// export function getAllActivities(): sqlType.Activity[]
// {
//     let sql = db.prepare(`SELECT 
//     activity.id AS activity_id,
//     activity.startTime,
//     activity.idStatus,
//     activity.idSubject,
//     activity.idRoom,
//     user.id AS user_id,
//     user.firstName,
//     user.lastName,
//     subject.name as subject,
//     room.name as room
//     FROM 
//     activity
//     INNER JOIN 
//     user ON activity.idUser = user.id
//     INNER JOIN
//     subject ON activity.idSubject = subject.id
//     INNER JOIN
//     room ON activity.idRoom = room.id
//     ORDER BY user.firstName ASC
//     ;`);

//     let rows = sql.all();

//     return rows;
// }

// interface getActivity
// {
//     startime: Date;
//     subject: String;
//     room: String;
//     status: String;
// }

// export function getActivity(id: number): getActivity
// {
//     let sql = db.prepare(`SELECT activity.startTime, subject.name as subject, room.name as room, status.name as status
//                         FROM activity
//                         INNER JOIN subject on activity.idSubject = subject.id
//                         INNER JOIN room on activity.idRoom = room.id
//                         INNER JOIN status on activity.idStatus = status.id
//                         WHERE idUser = ?`);

//     let rows = sql.all(id) as getActivity[];

//     return rows;
// }

export function getImageId(id: number)
{
    let sql = db.prepare(`SELECT imageId FROM user WHERE id = ?`).get(id);
    return sql;
}

export function approveActivity(id: number)
{
    let sql = db.prepare(`UPDATE activity SET idStatus = 2 WHERE id = ?`);

    sql.run(id);
}

export function denyActivity(id: number)
{
    let sql = db.prepare(`UPDATE activity SET idStatus = 3 WHERE id = ?`);

    sql.run(id);
}