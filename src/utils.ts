import {} from 'siyuan';
import { _getFile } from './api';
import { ThemeConfig } from 'siyuan-vscodelite-edit/src/ts/types.d';

export async function getThemeLastSeenVersion() {
    const config: ThemeConfig = JSON.parse(await _getFile('/data/snippets/vsc_edit.config.json'));
    return config.lastSeen as string;
}
