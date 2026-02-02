import {} from 'siyuan';
import { _getFile } from './api';
import { ThemeConfig } from 'siyuan-vscodelite-edit/src/ts/types.d';

async function getThemeLastSeenVersion() {
    const response = await _getFile('/data/snippets/vsc_edit.config.json');
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const gThis = this;
    try {
        const config: ThemeConfig = JSON.parse(response);
        return config.lastSeen as string;
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
    const versionChecker = new Version();
    if (versionChecker.compare(version, themeVersion) < 0) return false;
    else return true;
}

export class Version {
    /**
     * 检查一个版本号是否符合版本号规范
     * @param version 要检查的版本号
     * @returns boolean
     */
    public validate(version: string) {
        const vArray = version.split('.');
        if (vArray.length !== 3) return false;
        return vArray.every((item) => Number.isInteger(Number(item)));
    }

    /**
     * 比较版本号与基准版本号的大小
     * @param target 基准版本号
     * @param version 输入版本号
     * @returns 1-版本号大于基准版本号，0-版本号等于基准版本号，-1-版本号小于基准版本号
     */
    public compare(target: string, version: string) {
        if (!this.validate(target)) throw new Error(`${target} is not a valid semver string.`);
        if (!this.validate(version)) throw new Error(`${version} is not a valid semver string.`);

        const arr1 = target.split('.');
        const arr2 = version.split('.');

        for (let i = 0; i < 3; i++) {
            if (Number(arr1[i]) < Number(arr2[i])) return -1;
            else if (Number(arr1[i]) > Number(arr2[i])) return 1;
            else {
                if (i !== 2) continue;
                else return 0;
            }
        }
    }

    public gt(target: string, version: string) {
        if (!this.validate(target)) throw new Error(`${target} is not a valid semver string.`);
        if (!this.validate(version)) throw new Error(`${version} is not a valid semver string.`);

        const arr1 = target.split('.');
        const arr2 = version.split('.');

        for (let i = 0; i < 3; i++) {
            if (Number(arr1[i]) > Number(arr2[i])) return true;
            else {
                if (i !== 2) continue;
                else return false;
            }
        }
    }
    public lt(target: string, version: string) {
        if (!this.validate(target)) throw new Error(`${target} is not a valid semver string.`);
        if (!this.validate(version)) throw new Error(`${version} is not a valid semver string.`);

        const arr1 = target.split('.');
        const arr2 = version.split('.');

        for (let i = 0; i < 3; i++) {
            if (Number(arr1[i]) < Number(arr2[i])) return true;
            else {
                if (i !== 2) continue;
                else return false;
            }
        }
    }
    public eq(target: string, version: string) {
        if (!this.validate(target)) throw new Error(`${target} is not a valid semver string.`);
        if (!this.validate(version)) throw new Error(`${version} is not a valid semver string.`);

        const arr1 = target.split('.');
        const arr2 = version.split('.');

        for (let i = 0; i < 3; i++) {
            if (Number(arr1[i]) !== Number(arr2[i])) return false;
            else {
                if (i !== 2) continue;
                else return true;
            }
        }
    }
}
