import { fetchSyncPost } from 'siyuan';

export async function _getFile(path: string) {
    return await fetchSyncPost(path).then((data) => {
        if (data.code !== 0) return data.msg as string;
        return data.data as string;
    });
}
