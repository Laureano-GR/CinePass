import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { LanguageEntity } from './language.entity';
import { ContentRatingEntity } from './contentRating.entity';
import { GenreEntity } from './genre.entity';
import { ShowEntity } from './show.entity';

@Entity('movies')
export class MovieEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  poster: string; //FIXME resolver como guardar imagenes de los posters
  @Column()
  description: string;
  @Column()
  duration: string; // duracion en minutos
  @ManyToMany(() => LanguageEntity, (languages) => languages.movies)
  @JoinTable()
  languages: LanguageEntity[];
  @ManyToOne(() => ContentRatingEntity, (contentRating) => contentRating.movies)
  contentRating: ContentRatingEntity;
  @ManyToOne(() => GenreEntity, (genre) => genre.movies)
  genre: GenreEntity;
  @ManyToMany(() => ShowEntity, (shows) => shows.movies)
  @JoinTable()
  shows: ShowEntity[];
}