import { InputType, Field } from '@nestjs/graphql';
import { StringFilter } from '../prisma/string-filter.input';
import { NullableStringFilter } from '../prisma/nullable-string-filter.input';
import { UserFilter } from './user-filter.input';
import { ArticleFilter } from '../article/article-filter.input';
import { NullableIntFilter } from '../prisma/nullable-int-filter.input';
import { CommentFilter } from '../comment/comment-filter.input';

@InputType({})
export class UserWhereInput {
    @Field(() => StringFilter, {
        nullable: true,
        description: undefined,
    })
    id?: StringFilter | null;

    @Field(() => StringFilter, {
        nullable: true,
        description: undefined,
    })
    email?: StringFilter | null;

    @Field(() => StringFilter, {
        nullable: true,
        description: undefined,
    })
    name?: StringFilter | null;

    @Field(() => StringFilter, {
        nullable: true,
        description: undefined,
    })
    password?: StringFilter | null;

    @Field(() => NullableStringFilter, {
        nullable: true,
        description: undefined,
    })
    bio?: NullableStringFilter | null;

    @Field(() => NullableStringFilter, {
        nullable: true,
        description: undefined,
    })
    image?: NullableStringFilter | null;

    @Field(() => UserFilter, {
        nullable: true,
        description: undefined,
    })
    following?: UserFilter | null;

    @Field(() => UserFilter, {
        nullable: true,
        description: undefined,
    })
    followers?: UserFilter | null;

    @Field(() => ArticleFilter, {
        nullable: true,
        description: undefined,
    })
    favoriteArticles?: ArticleFilter | null;

    @Field(() => NullableIntFilter, {
        nullable: true,
        description: undefined,
    })
    countComments?: NullableIntFilter | null;

    @Field(() => ArticleFilter, {
        nullable: true,
        description: undefined,
    })
    articles?: ArticleFilter | null;

    @Field(() => CommentFilter, {
        nullable: true,
        description: undefined,
    })
    comments?: CommentFilter | null;

    @Field(() => [UserWhereInput], {
        nullable: true,
        description: undefined,
    })
    AND?: UserWhereInput[] | null;

    @Field(() => [UserWhereInput], {
        nullable: true,
        description: undefined,
    })
    OR?: UserWhereInput[] | null;

    @Field(() => [UserWhereInput], {
        nullable: true,
        description: undefined,
    })
    NOT?: UserWhereInput[] | null;
}
