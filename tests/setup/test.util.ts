import { ApiResponse } from '@pulsifi/fn';
import { AxiosResponse } from 'axios';

const mockAxiosResponse = <T>(obj: T): AxiosResponse<ApiResponse<T>> => {
    return {
        data: {
            data: obj,
        },
        status: 200,
        statusText: 'OK',
        headers: {} as SafeAny,
        config: {} as SafeAny,
    };
};

const mockUuid = (seed: number): string => {
    const indexToInsertDash = [8, 12, 16, 20];

    let result = '';
    [...String(seed).padStart(32, '0')].forEach((value, index) => {
        if (indexToInsertDash.includes(index)) {
            result += '-';
        }

        result += value;
    });

    return result;
};

export const testUtil = {
    mockAxiosResponse,
    mockUuid,
};
