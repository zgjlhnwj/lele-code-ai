import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    // 注册侧边栏 WebView
    const provider = new LeleCodeAiViewProvider(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('lele-code-ai-sidebar', provider)
    );

    // 保留命令注册，作为备用打开方式
    let disposable = vscode.commands.registerCommand('lele-code-ai.openCodeAi', () => {
        const panel = vscode.window.createWebviewPanel(
            'leleCodeAi',
            'LeleCodeAi',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebviewContent(context.extensionUri);
    });

    context.subscriptions.push(disposable);
}

class LeleCodeAiViewProvider implements vscode.WebviewViewProvider {
    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = getWebviewContent(this._extensionUri);
    }
}

function getWebviewContent(extensionUri: vscode.Uri) {
    const htmlPath = path.join(extensionUri.fsPath, 'src', 'webview', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    return htmlContent;
}

export function deactivate() {} 