import { NextApiRequest, NextApiResponse } from 'next';
import { publicConfig, serverConfig } from '../../lib/config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // 只返回公共配置，不返回服务器端敏感配置
    res.status(200).json({
        publicConfig,
        // 服务器端可以访问 serverConfig，但不应该返回给客户端
        serverConfigExists: !!serverConfig.apiSecretKey,
        environment: process.env.NODE_ENV
    });
} 