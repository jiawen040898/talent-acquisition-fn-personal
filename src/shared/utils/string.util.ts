import { LambdaErrorMsg } from '@pulsifi/constants';

export const getFilename = (filePath: string): string => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    if (!fileName) {
        throw new Error(
            `${LambdaErrorMsg.FAIL_TO_PARSE_FILENAME}: ${filePath}`,
        );
    }

    return fileName;
};

export function getDomainName(value: string | undefined): string {
    return value?.replace('https://', '').replace('/', '') || '';
}

export function streamToString(stream: SafeAny): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: SafeAny = [];
        stream.on('data', (chunk: SafeAny) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}
