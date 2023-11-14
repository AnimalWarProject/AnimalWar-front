import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

export const apiNoToken = async (url, method, data) => {
    try {
        const body = await axios({
            url,
            method,
            data,
        });
        return body;
    } catch (error) {
        console.error('Error in apiNoToken:', error);
        throw error;
    }
};

export const api = async (url, method, data) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const body = await axios({
            url,
            method,
            data,
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return body;
    } catch (error) {
        console.error('Error in api:', error);
        throw error;
    }
};

function storeAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}

async function storeNewAccessToken(refreshFunc) {
    const newAccessToken = await refreshFunc();
    if (newAccessToken && newAccessToken.accessToken) {
        storeAccessToken(newAccessToken.accessToken);
    } else {
        console.error('Failed to refresh the access token');
    }
}

export async function requestWithAutoRefresh(endpoint, method, data) {
    try {
        const response = await api(endpoint, method, data);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log('Access token expired');
            await storeNewAccessToken(refreshAccessToken);
            const newResponse = await api(endpoint, method, data);
            return newResponse;
        }
        console.error('Error in requestWithAutoRefresh:', error);
        throw error;
    }
}

export async function getRefreshTokenFromDB() {
    const response = await api('/api/v1/auth/getRefreshToken', 'GET');
    return response.data.refreshToken;
}

export async function refreshAccessToken() {
    const refreshToken = await getRefreshTokenFromDB();
    try {
        const response = await apiNoToken('/api/v1/auth/newAccessToken', 'POST', {
            refreshToken,
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Failed to refresh accessToken:', error);
        throw error;
    }
    return null;
}
