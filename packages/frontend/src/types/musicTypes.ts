export interface Song {
    id?: number;
    title: string;
    artist_id: number;
    album_name?: string;
    genre?: string;
    created_at?: string;
    updated_at?: string;
}

export interface SongTable {
    current: number;
    data: Song[];
    pageSize: number;
    total: number;
}
