import { pool } from "../../db/index.js";
import type { Issue, IssueQueryPayload } from "../../types/index.js";

const createIssueIntoDB = async(payload: any, reporter_id: number)=>{
    const { title, description, type} = payload;

    const result = await pool.query(`
        INSERT INTO issues(title, description, type, reporter_id) VALUES($1,$2,$3,$4) RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
        `, [title, description, type, reporter_id])
      return result.rows[0];
}


const getAllIssuesFromDB = async(payload: IssueQueryPayload)=>{
    const filters: string[] = [];
    const values: Array<string> = [];

    if (payload.type) {
        values.push(payload.type);
        filters.push(`type = $${values.length}`);
    }

    if (payload.status) {
        values.push(payload.status);
        filters.push(`status = $${values.length}`);
    }

    const sortDirection = payload.sort === "oldest" ? "ASC" : "DESC";
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

    const result = await pool.query(
        `
        SELECT id, title, description, type, status, reporter_id, created_at, updated_at
        FROM issues
        ${whereClause}
        ORDER BY created_at ${sortDirection}
        `,
        values
    );

    return result

}

const getSingleIssueFromDB = async(id: string)=>{

    const issue = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
    if(issue.rows.length === 0){
        return null;
    }

    const issueResult =  issue.rows[0];

    const reporter = await pool.query(`SELECT id, name, role FROM users WHERE id = $1`, [issueResult.reporter_id]);

    return{
        ...issueResult,
        reporter: reporter.rows[0]
    }

}


const updateIssueInDB = async(payload: Issue, id: string)=>{


    const {title, description, type} = payload;
    const result = await pool.query(`
    UPDATE issues 
    SET 
    title=$1, 
    description=$2, 
    type=$3
    WHERE id=$4
    RETURNING *`,[title, description, type, id]);
    return result.rows[0] || null
    }


const deleteIssueFromDB = async(id: string)=>{

    const result = await pool.query(`DELETE FROM issues WHERE id = $1 RETURNING *`, [id])
    return result;

}

export const issueService = {
    createIssueIntoDB, getAllIssuesFromDB, getSingleIssueFromDB, updateIssueInDB, deleteIssueFromDB
}