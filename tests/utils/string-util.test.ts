import { LambdaErrorMsg } from '@pulsifi/constants';
import { getFilename } from '@pulsifi/shared';

describe('getFilename', () => {
    it('should pass for valid filepath', async () => {
        const testFilepath =
            'candidates/resumes/f65e21b3-dcd0-4285-8beb-2c6f708ea44f/resume.pdf';

        const filename = getFilename(testFilepath);

        expect(filename).toEqual('resume.pdf');
    });

    it('should pass for valid URL filepath', async () => {
        const testFilepath =
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/87e07537-0179-455a-aa15-2cf254199289/Blank_Resume.docx';

        const filename = getFilename(testFilepath);

        expect(filename).toEqual('Blank_Resume.docx');
    });

    it('should fail for invalid URL filepath', async () => {
        const testFilepath =
            'https://pulsifi-sandbox-document.s3-ap-southeast-1.amazonaws.com/candidates/resumes/87e07537-0179-455a-aa15-2cf254199289/';

        expect.hasAssertions();
        try {
            getFilename(testFilepath);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toEqual(
                `${LambdaErrorMsg.FAIL_TO_PARSE_FILENAME}: ${testFilepath}`,
            );
        }
    });
});
