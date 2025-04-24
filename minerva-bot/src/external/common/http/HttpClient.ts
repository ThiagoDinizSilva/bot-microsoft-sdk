import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface HttpClientConfig {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
}

export class HttpClient {
    private axiosInstance: AxiosInstance;
    protected logger: Console;

    constructor(config: HttpClientConfig) {
        const { baseUrl, defaultHeaders = {} } = config;
        this.logger = console;
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: defaultHeaders,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const urlPath = new URL(config.url || '', config.baseURL).pathname;
                this.logger.info({
                    message: `request - ${urlPath}`,
                    method: config.method,
                    headers: config.headers,
                });
                return config;
            },
            (error: AxiosError) => {
                if (error.config) {
                    const urlPath = new URL(error.config.url || '', error.config.baseURL).pathname;
                    this.logger.info({
                        message: `Request Error - ${urlPath}`,
                        error: JSON.stringify(error),
                        data: error.config.data,
                    });
                }
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                const urlPath = new URL(response.config.url || '', response.config.baseURL).pathname;
                this.logger.info({
                    message: `response - ${urlPath} ${response.status}`,
                    status: response.status,
                });
                return response;
            },
            (error: AxiosError) => {
                if (error.config) {
                    const urlPath = new URL(error.config.url || '', error.config.baseURL).pathname;
                    const status = error.response?.status || 'unknown';
                    this.logger.info({
                        message: `Response Error - ${urlPath} ${status}`,
                        status: status as number,
                        data: error.response?.data,
                    });
                } else {
                    this.logger.info({
                        message: 'Response Error:',
                        error: error.message,
                        stck: error.stack,
                        data: JSON.stringify(error),
                    });
                }
                return Promise.reject(error);
            }
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
        //todo implementar token sistemico
        const auth = await this.axiosInstance.post('/auth/login', {
            email: 'john.doe@example.com',
            password: 'admin',
        });
        const response = await this.axiosInstance.get<T>(url, {
            params,
            headers: { Authorization: `Bearer ${auth.data.access_token}` },
        });
        return response.data;
    }

    public async post<T, D>(url: string, data?: D): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data);
        return response.data;
    }

    public async put<T, D>(url: string, data?: D): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data);
        return response.data;
    }

    public async delete<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url);
        return response.data;
    }
}
