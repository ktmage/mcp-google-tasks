import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs';
import { SCOPES, TOKEN_PATH, CREDENTIALS_PATH } from './config.js';

/**
 * 保存されたトークンの読み込み、または新しい認証の実行
 */
export async function authorize() {
    let client = null;
    try {
        // トークンファイルが存在する場合は読み込む
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content.toString());
        client = google.auth.fromJSON(credentials);
    } catch (err) {
        // トークンファイルが存在しない場合は新しい認証を実行
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        // トークンを保存
        if (client.credentials) {
            const keys = JSON.parse(fs.readFileSync(CREDENTIALS_PATH).toString());
            const payload = JSON.stringify({
                type: 'authorized_user',
                client_id: keys.installed.client_id,
                client_secret: keys.installed.client_secret,
                refresh_token: client.credentials.refresh_token,
            });
            fs.writeFileSync(TOKEN_PATH, payload);
        }
    }
    return client;
}

/**
 * Google Tasksサービスのインスタンスを取得
 */
export async function getTasksService() {
    const auth = await authorize();
    return google.tasks({
        version: 'v1',
        auth: auth as any
    });
} 