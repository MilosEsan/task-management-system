import axios from 'axios';
export default axios.create({
    // baseURL: `https://example.com/api`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+localStorage.getItem("token")??""
    }
});