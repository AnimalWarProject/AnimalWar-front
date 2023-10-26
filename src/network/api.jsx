import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.0.222:8000';

// 초기설정 안됨. 수정해야함. 변수도 accessToken으로 바꿔야함

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

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await apiNoToken('/api/v1/auth/refresh', 'POST', {
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

function storeAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}

async function storeNewAccessToken() {
    try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            storeAccessToken(newAccessToken);
        } else {
            console.error('refresh token fail');
        }
    } catch (error) {
        console.error('Error', error);
    }
}

export async function requestWithAutoRefresh(endpoint, method, data) {
    try {
        const response = await api(endpoint, method, data);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log('Access token expired');
            await storeNewAccessToken();
            console.log('Retrying');
            const newResponse = await api(endpoint, method, data);
            return newResponse;
        }
        throw error;
    }
}
