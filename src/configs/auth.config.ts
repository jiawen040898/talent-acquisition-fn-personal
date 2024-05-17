import { envUtil } from '@pulsifi/fn';

export const AUTH0_CONFIG = () => ({
    domain: envUtil.get('AUTH0_ENTERPRISE_DOMAIN'),
    audience: envUtil.get('AUTH0_ENTERPRISE_API_AUDIENCE'),
    grantType: 'client_credentials',
    secretName: envUtil.get('AUTH0_SM_NAME'),
});
