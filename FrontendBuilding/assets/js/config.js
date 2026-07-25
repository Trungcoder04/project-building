/**
 * EstateBasic - System Configuration
 * Switch between MOCK_DATA (for frontend demo) and SPRING_BOOT_API (for backend integration)
 */
const CONFIG = {
    // Mode: 'MOCK' or 'API'
    MODE: 'MOCK',
    
    // Spring Boot REST API Base URL
    API_BASE_URL: 'http://localhost:8080/api',

    // App Information
    APP_NAME: 'EstateBasic',
    APP_VERSION: '1.0.0',

    // Local Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'eb_auth_token',
        USER: 'eb_auth_user',
        MOCK_DB: 'eb_mock_db'
    }
};

if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
