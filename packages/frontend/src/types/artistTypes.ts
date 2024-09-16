export interface Artist {
    id?: number; 
    name: string;
    dob?: string;
    gender?: 'M' | 'F' | 'O';
    address?: string;
    no_of_albums_released?: number;
    bio?: string;
    first_release_year?: number;
    created_at?: string;
    updated_at?: string; 
}

export interface ArtistTable {
    current: number;
    data: Artist[];
    pageSize: number;
    total: number;
}
  