// Module that exports fuctions to manage to-do items

//model for a to-do item
import {TodoItem} from "../models/TodoItem";
// Utility function that extracts a user ID from a JSON Web Token (JWT)
import {parseUserId} from "../auth/utils";
// Type for a request to create a new to-do item
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
// Type for a request to update a new to-do item
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
// Type for an update to a to-do item
import {TodoUpdate} from "../models/TodoUpdate";
// Data access layer fot to-do items
import {ToDoAccess} from "../dataLayer/ToDoAccess";

const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();

// Retrieves all the to-do items for the user specified by the JWT token
export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(userId);
}
// Creates a new to-do item with the specified request and attaches it to the user specified by the JWT token
export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const userId = parseUserId(jwtToken);
    const todoId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    return toDoAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}
// Updates the to-do item specified by the ID with the new request
export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}
// Deletes the to-do item specified by the ID
export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(todoId, userId);
}
// Generates a pre-signed URL that can be used to upload a file attachment for the to-do item specified by the ID
export function generateUploadUrl(todoId: string): Promise<string> {
    return toDoAccess.generateUploadUrl(todoId);
}
