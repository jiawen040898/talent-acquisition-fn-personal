export interface Meta {
    type: string;
    message: string;
}

export interface ApiResponseDTO<T> {
    data?: T;
    meta?: Meta;
}

export interface IReceivedApiResponseDto<T> {
    data: T;
    meta?: Meta;
}
