/**
 * EstateBasic - Authentication & Role Manager
 */
const Auth = {
    getCurrentUser() {
        const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    isLoggedIn() {
        return !!this.getCurrentUser() && !!localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    },

    hasRole(roleCode) {
        const user = this.getCurrentUser();
        if (!user || !user.roles) return false;
        return user.roles.includes(roleCode);
    },

    isManager() {
        return this.hasRole('MANAGER');
    },

    isStaff() {
        return this.hasRole('STAFF');
    },

    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        window.location.href = 'login.html';
    },

    // Fast switch simulation for demo testing
    switchRole(username) {
        const db = MockDatabase.getDB();
        const user = db.users.find(u => u.username === username);
        if (user) {
            const userRoles = db.userRoles.filter(ur => ur.userid == user.id);
            const roles = db.roles.filter(r => userRoles.some(ur => ur.roleid == r.id)).map(r => r.code);
            
            const authUser = {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                roles: roles
            };

            localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, `mock-token-${user.username}`);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(authUser));
            window.location.reload();
        }
    }
};

if (typeof window !== 'undefined') {
    window.Auth = Auth;
}
