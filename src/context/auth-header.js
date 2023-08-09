export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('jwtToken'));

    if (user && user.accessToken) {
        // for Node.js Express back-end
        return { Authorization: `Bearer ${user}` };
    } else {
        return {};
    }
}