/**
 * Interface for the current user
 */
export interface CurrentUser {
    // The id of the user
    id: number;
    // The email of the user
    email: string;
    // The name of the user
    name: string;
    // The role of the user
    role: string;
}