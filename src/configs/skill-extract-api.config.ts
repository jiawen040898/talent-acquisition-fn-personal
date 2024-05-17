import { envUtil } from '@pulsifi/fn';

export const SkillExtractAPI = () => ({
    apiUrl: envUtil.get('SKILL_EXTRACT_API_URL'),
    apiKey: envUtil.get('SKILL_EXTRACT_API_KEY'),
});
