import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieEntity } from './movie.entity';

@Entity('genres')
export class GenreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => MovieEntity, (movie) => movie.genre)
  movies: MovieEntity[];
}