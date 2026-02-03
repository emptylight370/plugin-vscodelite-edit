import {} from 'siyuan';
import { _getFile } from './api';
import { ThemeConfig } from 'siyuan-vscodelite-edit/src/ts/types';
import * as semver from 'semver';

async function getThemeLastSeenVersion() {
    const response = await _getFile('/data/snippets/vsc_edit.config.json');
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const gThis = this;
    try {
        const config: ThemeConfig = JSON.parse(response);
        const gVar = globalThis.vscDefaultConf;
        // 主题配置文件和主题版本一致
        if (semver.eq(config.lastSeen, gVar.lastSeen)) return config.lastSeen;
        // 文件没有更新，但是主题的版本更新了，返回新版本
        else if (semver.lt(config.lastSeen, gVar.lastSeen)) return gVar.lastSeen;
        // 如果用valid检查会返回null，用以判断
        else return '0';
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error(`VSCE:${gThis.i18n.getFileError}, get ${response} from SiYuan.`);
        } else {
            console.error(`VSCE:${response}`);
        }
    }
}

/**
 * 指定一个版本，检测当前主题版本是否达到此版本要求
 * @param version 指定可用的版本
 * @returns 当前主题是否兼容
 */
export async function isCapableToVersion(version: string) {
    const themeVersion = await getThemeLastSeenVersion();
    if (semver.valid(themeVersion) != null) {
        if (semver.compare(version, themeVersion) < 0) return false;
        else return true;
    } else {
        return false;
    }
}
