export interface CinemaInfo {
  name: string;
  id_file: string;
  id_area: string;
  id_server: string;
  uuid: string;
}

export interface CinemaConfig {
  id_MovieTheater: Record<string, CinemaInfo>;
}