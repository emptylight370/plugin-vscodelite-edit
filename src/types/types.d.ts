import { Menu, Protyle } from 'siyuan';
import { ThemeConfig, vscCounters, vscMessage, vscObservers, vscTimers } from 'siyuan-vscodelite-edit/src/ts/types';

interface IClickBlockIconEventDetail {
    menu: Menu;
    protyle: Protyle;
    blockElements: HTMLElement[];
}

declare global {
    // 主题代码中添加的全局变量
    /** 默认配置文件 */
    var vscDefaultConf: Readonly<ThemeConfig>;
    /** 本地化提示信息 */
    var vscMessage: Readonly<vscMessage>;
    /** 默认语言，可由浏览器方法获取 */
    var vscLang: keyof vscMessage['language'];
    /** 目前所有的计时器 */
    var vscTimers: vscTimers;
    /** 目前所有的观察器 */
    var vscObservers: vscObservers;
    /** 目前所有的计数器 */
    var vscCounters: vscCounters;
}
