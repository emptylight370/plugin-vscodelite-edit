import { fetchPost, fetchSyncPost } from 'siyuan';

export async function _request(url: string, data: any) {
    const res = await fetchSyncPost(url, data);
    return res.code === 0 ? res.data : null;
}

export async function _getFile(path: string) {
    return await _request('/api/file/getFile', path);
}

/**
 * 获取指定块的属性
 * @param block - 块 ID
 * @returns 块属性数据对象，失败时返回错误信息字符串
 * @example 返回格式：
 * {
 *   "id": "20210912214605-uhi5gco",
 *   "title": "文档标题",
 *   "type": "doc",
 *   "updated": "20210916120715",
 *   "custom-attr1": "值",
 *   "custom-attr2": "值"
 * }
 */
export async function getBlockAttrs(block: string): Promise<Record<string, string>> {
    return await _request('/api/block/getBlockAttrs', { id: block });
}

/**
 * 设置块的属性
 * @param block - 块 ID
 * @param attrs - 要设置的属性对象，键值对形式
 * @returns null
 */
export async function setBlockAttrs(block: string, attrs: Record<string, string>): Promise<void> {
    return await _request('/api/block/setBlockAttrs', { id: block, attrs: attrs });
}
