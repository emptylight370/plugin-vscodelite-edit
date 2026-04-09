import { fetchPost, fetchSyncPost } from 'siyuan';

export async function _getFile(path: string) {
    return await fetchSyncPost(path).then((data) => {
        if (data.code !== 0) return data.msg as string;
        return data.data as string;
    });
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
    return await fetchSyncPost('/api/block/getBlockAttrs', {
        id: block,
    })
        .then((data) => {
            console.log('getBlockAttrs data:', data);
            return (data?.data || {}) as Record<string, string>;
        })
        .catch((e) => {
            console.error('getBlockAttrs error:', e);
            return {};
        });
}

/**
 * 设置块的属性
 * @param block - 块 ID
 * @param attrs - 要设置的属性对象，键值对形式
 * @returns 操作成功返回 true，失败返回错误信息字符串
 */
export async function setBlockAttrs(block: string, attrs: Record<string, string>): Promise<void> {
    try {
        fetchPost('/api/block/setBlockAttrs', { id: block, attrs: attrs });
    } catch (error) {
        console.error('setBlockAttrs error:', error);
    }
    return;
}
