import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { MovieEntity } from './movie.entity';
import { ShowEntity } from './show.entity';

@Entity('languages')
export class LanguageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany(() => MovieEntity, (movies) => movies.languages)
  @JoinTable()
  movies: MovieEntity[];
  @OneToMany(() => ShowEntity, (show) => show.selectedLanguage)
  shows: ShowEntity[];
}