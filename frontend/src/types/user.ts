export interface User {
    id: string;
    email: string;
    username: string;
    createdAt: string; // Assuming string format for now, adjust if Date or other type is used
    updatedAt: string; // Assuming string format for now, adjust if Date or other type is used
    // Add other user properties as needed based on backend schema
}