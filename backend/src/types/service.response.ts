export interface ServiceResponse<T> {
    status: number;
    success: boolean;
    messages: string[];
    data?: T;
}