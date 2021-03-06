import { Field, InputType } from '@nestjs/graphql';

import { ArticleFilter } from '../article/article-filter.input';
import { StringFilter } from '../prisma/string-filter.input';

@InputType({})
export class TagScalarWhereInput {
    @Field(() => StringFilter, {
        nullable: true,
        description: undefined,
    })
    id?: string | StringFilter;

    @Field(() => StringFilter, {
        nullable: true,
        description: undefined,
    })
    name?: string | StringFilter;

    @Field(() => ArticleFilter, {
        nullable: true,
        description: undefined,
    })
    articles?: ArticleFilter | null;

    @Field(() => [TagScalarWhereInput], {
        nullable: true,
        description: undefined,
    })
    AND?: TagScalarWhereInput | Array<TagScalarWhereInput>;

    @Field(() => [TagScalarWhereInput], {
        nullable: true,
        description: undefined,
    })
    OR?: Array<TagScalarWhereInput>;

    @Field(() => [TagScalarWhereInput], {
        nullable: true,
        description: undefined,
    })
    NOT?: TagScalarWhereInput | Array<TagScalarWhereInput>;
}
