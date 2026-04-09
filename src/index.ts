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
import { isUsingVSCE } from './utils';
import { getBlockAttrs, setBlockAttrs } from './api';

export default class PluginVSCE extends Plugin {
    // private isMobile: boolean;
    onload() {
        // const frontEnd = getFrontend();
        // const backEnd = getBackend();
        // 在前端和后端都是移动端时认定为移动端
        // this.isMobile =
        //     (frontEnd === 'mobile' || frontEnd === 'browser-mobile') &&
        //     (backEnd === 'android' || backEnd === 'ios' || backEnd === 'harmony');

        if (isUsingVSCE()) {
            this.eventBus.on('click-blockicon', this.handleBlockSelect.bind(this));
            console.log(this.i18n.initWithVSCE);
        } else {
            console.log(this.i18n.initWithoutVSCE);
        }
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
    private handleBlockSelect(event: CustomEvent<IMenuBaseDetail>) {
        const detail = event.detail as unknown as IClickBlockIconEventDetail;
        console.log(detail);
        const blockElements = detail.blockElements;
        console.log(blockElements);
        const menu: Menu = detail.menu;
        let submenu: IMenu[] = [];
        if (blockElements.length === 1) {
            // 可以删除属性
            submenu = this.selectSingleBlock(blockElements[0]);
            showMessage('VSCE:修改单个块');
        } else if (blockElements.length <= 0) {
            // 返回
            console.warn('VSCE:在选中0个块的情况下触发了选中块菜单事件');
            return;
        } else {
            // 不可以删除属性
            showMessage('VSCE:暂不支持同时操作多个块');
            return;
        }
        if (submenu.length > 0) {
            menu.addItem({
                icon: 'iconTheme',
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
    private selectSingleBlock(blockElement: HTMLElement) {
        const submenu: IMenu[] = [];
        const blockId = blockElement.dataset.nodeId;
        if (!blockId) {
            console.warn('VSCE: 无法获取块 ID');
            return submenu;
        }
        const attrs = blockElement.getAttribute('custom-vsce')?.split(' ') ?? [];

        // 数据库
        if (blockElement.dataset.type === 'NodeAttributeView') {
            if (!attrs.includes('av-no-add-entry'))
                submenu.push({
                    label: this.i18n.addAVNoAddEntry,
                    click: () => this.addBlockAttr(blockId, 'av-no-add-entry'),
                });
            else
                submenu.push({
                    label: this.i18n.removeAVNoAddEntry,
                    click: () => this.removeBlockAttr(blockId, 'av-no-add-entry'),
                });
            if (!attrs.includes('av-no-add-view'))
                submenu.push({
                    label: this.i18n.addAVNoAddView,
                    click: () => this.addBlockAttr(blockId, 'av-no-add-view'),
                });
            else
                submenu.push({
                    label: this.i18n.removeAVNoAddView,
                    click: () => this.removeBlockAttr(blockId, 'av-no-add-view'),
                });
        }
        // 表格
        else if (blockElement.dataset.type === 'NodeTable') {
            if (!attrs.includes('table-min'))
                submenu.push({
                    label: this.i18n.addTableMinWidth,
                    click: () => this.addBlockAttr(blockId, 'table-min'),
                });
            else
                submenu.push({
                    label: this.i18n.removeTableMinWidth,
                    click: () => this.removeBlockAttr(blockId, 'table-min'),
                });
            if (!attrs.includes('no-thead'))
                submenu.push({
                    label: this.i18n.addTableNoThead,
                    click: () => this.addBlockAttr(blockId, 'no-thead'),
                });
            else
                submenu.push({
                    label: this.i18n.removeTableNoThead,
                    click: () => this.removeBlockAttr(blockId, 'no-thead'),
                });
            if (!attrs.includes('hide-thead'))
                submenu.push({
                    label: this.i18n.addTableHideThead,
                    click: () => this.addBlockAttr(blockId, 'hide-thead'),
                });
            else
                submenu.push({
                    label: this.i18n.removeTableHideThead,
                    click: () => this.removeBlockAttr(blockId, 'hide-thead'),
                });
        }
        // 段落和文档
        else if (blockElement.dataset.type === 'NodeParagraph' || blockElement.dataset.docType === 'NodeDocument') {
            if (!attrs.includes('no-tag'))
                submenu.push({
                    label: this.i18n.addNoTagStyle,
                    click: () => this.addBlockAttr(blockId, 'no-tag'),
                });
            else
                submenu.push({
                    label: this.i18n.removeNoTagStyle,
                    click: () => this.removeBlockAttr(blockId, 'no-tag'),
                });
            if (!attrs.includes('mark-hide'))
                submenu.push({
                    label: this.i18n.addMarkHide,
                    click: () => this.addBlockAttr(blockId, 'mark-hide'),
                });
            else
                submenu.push({
                    label: this.i18n.removeMarkHide,
                    click: () => this.removeBlockAttr(blockId, 'mark-hide'),
                });
        }
        return submenu;
    }

    /**
     * 添加或更新块属性
     * @param blockId 块ID
     * @param value 属性值
     */
    private async addBlockAttr(blockId: string, value: string) {
        try {
            const attrs = await getBlockAttrs(blockId);
            console.log('attrs', attrs);
            const existing = attrs?.['custom-vsce'] || '';
            const vsceArr = existing ? existing.split(' ').filter((s) => s) : [];
            if (!vsceArr.includes(value)) {
                vsceArr.push(value);
                await setBlockAttrs(blockId, { 'custom-vsce': vsceArr.join(' ') });
            }
        } catch (error) {
            console.error('VSCE: 添加自定义属性失败', error);
        }
    }

    /**
     * 删除块属性
     * @param blockId 块ID
     * @param value 要删除的属性值
     */
    private async removeBlockAttr(blockId: string, value: string) {
        try {
            const attrs = await getBlockAttrs(blockId);
            const existing = attrs?.['custom-vsce'] || '';
            const vsceArr = existing ? existing.split(' ').filter((s) => s) : [];
            if (vsceArr.includes(value)) {
                vsceArr.splice(vsceArr.indexOf(value), 1);
                await setBlockAttrs(blockId, { 'custom-vsce': vsceArr.join(' ') });
            }
        } catch (error) {
            console.error('VSCE: 删除自定义属性失败', error);
        }
    }
}
