import type { Request, Response } from "express";
import { issueService } from "./issues.service.js";
import sendResponse from "../../utils/sendResponse.js";

const createIssue = async(req: Request, res:Response)=>{
    try {

        const {title, description, type} = req.body
        const reporter_id = req.user!.id; 
        if (!title || !description || !type) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Title, description, and type are required',
      });
      return;
    }

    if (title.length > 150) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Title must not exceed 150 characters',
      });
      return;
    }

    if (description.length < 20) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Description must be at least 20 characters',
      });
      return;
    }

    if (type !== 'bug' && type !== 'feature_request') {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Type must be either bug or feature_request',
      });
      return;
    }
    
    
    
    const issue = await issueService.createIssueIntoDB(req.body, reporter_id);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Issue created successfully',
      data: issue,
    });
        
    } catch (error: any) {
        sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: {},
    });
    }
}

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    if (sort && sort !== 'newest' && sort !== 'oldest') {
      sendResponse(res, { statusCode: 400, success: false, message: 'Invalid sort value' });
      return;
    }
    if (type && type !== 'bug' && type !== 'feature_request') {
      sendResponse(res, { statusCode: 400, success: false, message: 'Invalid type value' });
      return;
    }
    if (status && !['open', 'in_progress', 'resolved'].includes(status as string)) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Invalid status value' });
      return;
    }

    const issues = await issueService.getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issues retrieved successfully', 
      data: issues.rows,
    });
  } catch (error: any) {
    sendResponse(res, { statusCode: 500, success: false, message: 'Failed to retrieve issues' });
  }
};


const getSingleIssue = async(req: Request, res: Response)=>{
  const {id} = req.params;
  try {

    const result = await issueService.getSingleIssueFromDB(id as string);

    if (!result) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue retrieved successfully',
      data: result,
    });

  } catch (error: any) {
    sendResponse(res, { statusCode: 500, success: false, message: 'Failed to retrieve issue' });
  }

}

const updateSingleIssue = async(req: Request, res: Response)=>{
try {
  const {id} = req.params;
  const {title, description, type} = req.body;
  const result  = await issueService.updateIssueInDB(req.body, id as string);
  if (!result) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Issue not found',
      });
    return;
    }
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue updated successfully',
      data: result,
    });
  

} catch (error: any) {
  
  sendResponse(res, { statusCode: 500, success: false, message: 'Failed to retrieve issues' });
}






}

const deleteIssue = async(req: Request, res: Response)=>{

  try {
    const {id} = req.params;
    const result = await issueService.deleteIssueFromDB(id as string)
    if (!result) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'Issue not found',
      });
    return;
    }
  sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Issue deleted successfully',
      data: result,
    });

  } catch (error: any) {
    sendResponse(res, { statusCode: 500, success: false, message: 'Failed to retrieve issues' });
  }

}

export const issueController = {
    createIssue, getAllIssues, getSingleIssue, updateSingleIssue, deleteIssue
}