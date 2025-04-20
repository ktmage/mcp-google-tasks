import path from 'path';
import { fileURLToPath } from 'url';

// ファイルパスを取得するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// スコープの設定
export const SCOPES = ['https://www.googleapis.com/auth/tasks'];
// トークンパスの設定
export const TOKEN_PATH = path.join(__dirname, '../../token.json');
// 認証情報パスの設定
export const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json'); 