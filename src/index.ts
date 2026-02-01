import {
    adaptHotkey,
    confirm,
    Constants,
    Custom,
    Dialog,
    exitSiYuan,
    fetchPost,
    Files,
    getAllEditor,
    getBackend,
    getFrontend,
    getModelByDockType,
    ICard,
    ICardData,
    IOperation,
    lockScreen,
    Menu,
    openAttributePanel,
    openMobileFileById,
    openSetting,
    openTab,
    openWindow,
    platformUtils,
    Plugin,
    Protyle,
    saveLayout,
    Setting,
    showMessage,
} from 'siyuan';
import { IMenu, IMenuBaseDetail } from 'siyuan/types';
import './index.scss';
import { IClickBlockIconEventDetail } from './types/types';

export default class PluginSample extends Plugin {
    private isMobile: boolean;
    onload() {
        const frontEnd = getFrontend();
        const backEnd = getBackend();
        // 在前端和后端都是移动端时认定为移动端
        this.isMobile =
            (frontEnd === 'mobile' || frontEnd === 'browser-mobile') &&
            (backEnd === 'android' || backEnd === 'ios' || backEnd === 'harmony');

        this.eventBus.on('click-blockicon', this.handleBlockSelect.bind(this));

        console.log(this.i18n.helloPlugin);
    }

    onLayoutReady() {
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    onunload() {
        this.eventBus.off('click-blockicon', this.handleBlockSelect.bind(this));
        console.log(this.i18n.byePlugin);
    }

    uninstall() {
        this.eventBus.off('click-blockicon', this.handleBlockSelect.bind(this));
        console.log('uninstall');
    }

    /**
     * 处理选中块菜单事件
     * @param event 选中块菜单事件
     */
    private async handleBlockSelect(event: CustomEvent<IMenuBaseDetail>) {
        const detail = event.detail as unknown as IClickBlockIconEventDetail;
        console.log(detail);
        const blockElements = detail.blockElements;
        console.log(blockElements);
        const menu: Menu = detail.menu;
        let submenu: IMenu[] = [];
        if (blockElements.length === 1) {
            // 可以删除属性
            submenu = await this.selectSingleBlock(blockElements[0]);
            showMessage('VSCE:修改单个块');
        } else if (blockElements.length <= 0) {
            // 返回
            console.warn('VSCE:在选中0个块的情况下触发了选中块菜单事件');
            return;
        } else {
            // 不可以删除属性
            showMessage('VSCE:暂不支持同时操作多个块');
        }
        if (submenu.length > 0) {
            menu.addItem({
                icon: '',
                label: this.i18n.menuLabel,
                submenu: submenu,
            });
        }
    }

    /**
     * 选中单个块的时候可以删除属性
     * @param blockElements 选中的块
     * @returns 生成的操作菜单
     */
    private async selectSingleBlock(blockElement: HTMLElement) {
        const submenu: IMenu[] = [];
        // 数据库
        if (blockElement.dataset.type === 'NodeAttributeView') {
            submenu.push({
                label: this.i18n.addAVAttributeLabel,
                click: () => {},
            });
        }
        // 表格
        else if (blockElement.dataset.type === 'NodeTable') {
            submenu.push({
                label: this.i18n.a,
                click: () => {},
            });
        }
        return submenu;
    }
}
