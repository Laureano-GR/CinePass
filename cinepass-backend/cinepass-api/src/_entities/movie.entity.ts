import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { LanguageEntity } from './language.entity';
import { ContentRatingEntity } from './contentRating.entity';
import { GenreEntity } from './genre.entity';
import { ShowEntity } from './show.entity';
import { ShowTypeEntity } from './showType.entity';

@Entity('movies')
export class MovieEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  poster: string; // url de la imagen
  @Column()
  description: string;
  @Column()
  duration: string; // duracion en minutos
  @ManyToMany(() => LanguageEntity, (languages) => languages.movies)
  @JoinTable()
  languages: LanguageEntity[];
  @ManyToMany(() => ShowTypeEntity, (showTypes) => showTypes.movies)
  @JoinTable()
  showTypes: ShowTypeEntity[];
  @ManyToOne(() => ContentRatingEntity, (contentRating) => contentRating.movies)
  contentRating: ContentRatingEntity;
  @ManyToOne(() => GenreEntity, (genre) => genre.movies)
  genre: GenreEntity;
  @OneToMany(() => ShowEntity, (shows) => shows.movie)
  shows: ShowEntity[];
}